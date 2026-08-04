using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using VidyaAI.Application.Common;
using VidyaAI.Application.Common.Interfaces;
using VidyaAI.Application.DTOs;
using VidyaAI.Application.Notifications;
using VidyaAI.Domain.Entities;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Application.Registration.Queries
{
    // Public list of approved, active schools so a self-registering member can pick
    // which school to join. Exposes the bare minimum (no contacts/subscription).
    public record GetPublicSchoolsQuery : IRequest<IReadOnlyList<PublicSchoolDto>>;

    public sealed class GetPublicSchoolsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetPublicSchoolsQuery, IReadOnlyList<PublicSchoolDto>>
    {
        public async Task<IReadOnlyList<PublicSchoolDto>> Handle(GetPublicSchoolsQuery q, CancellationToken ct) =>
            await db.Schools.AsNoTracking()
                .Where(s => s.IsActive && s.ApprovalStatus == ApprovalStatus.Approved)
                .OrderBy(s => s.Name)
                .Select(s => new PublicSchoolDto(s.Id, s.Name, s.City, s.State))
                .ToListAsync(ct);
    }
}

namespace VidyaAI.Application.Registration.Commands
{
    // ── REGISTER A SCHOOL (anonymous) ─────────────────────────────
    // Creates a Pending school plus its first SchoolAdmin (also Pending). Neither
    // can sign in until a SuperAdmin approves the school. SuperAdmins are notified.
    public record RegisterSchoolCommand(
        string SchoolName, string? City, string? State, string? Phone, string? Email,
        SchoolType Type, BoardType Board,
        string AdminFirstName, string AdminLastName, string AdminEmail, string AdminPassword, string? AdminPhone,
        string? DocumentUrl = null,
        string? CaptchaToken = null)
        : IRequest<RegisterResponse>;

    public sealed class RegisterSchoolCommandValidator : AbstractValidator<RegisterSchoolCommand>
    {
        public RegisterSchoolCommandValidator()
        {
            RuleFor(x => x.SchoolName).NotEmpty().MaximumLength(200);
            RuleFor(x => x.AdminFirstName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.AdminLastName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.AdminEmail).NotEmpty().EmailAddress();
            RuleFor(x => x.AdminPassword).NotEmpty().MinimumLength(6)
                .Matches(@"[A-Z]").WithMessage("Password must contain an uppercase letter.")
                .Matches(@"[0-9]").WithMessage("Password must contain a digit.");
        }
    }

    public sealed class RegisterSchoolCommandHandler(IAppDbContext db, ICaptchaVerifier captcha, IEmailService email)
        : IRequestHandler<RegisterSchoolCommand, RegisterResponse>
    {
        public async Task<RegisterResponse> Handle(RegisterSchoolCommand cmd, CancellationToken ct)
        {
            if (!await captcha.VerifyAsync(cmd.CaptchaToken, ct))
                throw new ArgumentException("Captcha verification failed. Please try again.");

            if (await db.Users.AnyAsync(u => u.Email == cmd.AdminEmail, ct))
                throw new ArgumentException("An account with this email already exists.");

            var school = new School
            {
                Name = cmd.SchoolName, City = cmd.City, State = cmd.State,
                Phone = cmd.Phone, Email = cmd.Email, Type = cmd.Type, Board = cmd.Board,
                DocumentUrl = cmd.DocumentUrl,
                Plan = SubscriptionPlan.Free, SubscriptionStatus = SubscriptionStatus.Trial,
                IsActive = false, ApprovalStatus = ApprovalStatus.Pending,
            };
            db.Schools.Add(school);

            var admin = new User
            {
                FirstName = cmd.AdminFirstName, LastName = cmd.AdminLastName, Email = cmd.AdminEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(cmd.AdminPassword),
                Phone = cmd.AdminPhone, Role = UserRole.SchoolAdmin, SchoolId = school.Id,
                IsActive = false, ApprovalStatus = ApprovalStatus.Pending,
            };
            db.Users.Add(admin);

            db.UserSchoolEnrollments.Add(new UserSchoolEnrollment
            {
                UserId = admin.Id, SchoolId = school.Id, Role = UserRole.SchoolAdmin,
                Status = EnrollmentStatus.Pending, IsPrimary = true,
            });

            await NotificationFactory.AddForRoleAsync(db, UserRole.SuperAdmin, null,
                NotificationType.ApprovalRequested, "New school awaiting approval",
                $"{cmd.SchoolName} registered and is waiting for review.", school.Id.ToString(), ct);

            await db.SaveChangesAsync(ct);

            var (subject, html) = EmailTemplates.SchoolRegistrationReceived(
                $"{cmd.AdminFirstName} {cmd.AdminLastName}", cmd.SchoolName);
            await email.SendAsync(cmd.AdminEmail, subject, html, ct); // best-effort (never throws)

            return new RegisterResponse(
                "Your school has been registered and is pending approval. You'll be able to sign in once an administrator approves it.");
        }
    }

    // ── REGISTER A MEMBER (teacher / student, anonymous) ──────────
    // Joins an existing approved school as a Pending teacher/student; the school's
    // SchoolAdmins are notified and approve them.
    public record RegisterMemberCommand(
        Guid SchoolId, UserRole Role,
        string FirstName, string LastName, string Email, string Password, string? Phone,
        string? GradeLevel, string? RollNumber, DateTime? DateOfBirth, string? GuardianName, string? GuardianPhone,
        string? CaptchaToken = null)
        : IRequest<RegisterResponse>;

    public sealed class RegisterMemberCommandValidator : AbstractValidator<RegisterMemberCommand>
    {
        public RegisterMemberCommandValidator()
        {
            RuleFor(x => x.SchoolId).NotEmpty();
            RuleFor(x => x.Role).Must(r => r is UserRole.Teacher or UserRole.Student)
                .WithMessage("You can only register as a teacher or student.");
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6)
                .Matches(@"[A-Z]").WithMessage("Password must contain an uppercase letter.")
                .Matches(@"[0-9]").WithMessage("Password must contain a digit.");
        }
    }

    public sealed class RegisterMemberCommandHandler(IAppDbContext db, ICaptchaVerifier captcha, IEmailService email)
        : IRequestHandler<RegisterMemberCommand, RegisterResponse>
    {
        public async Task<RegisterResponse> Handle(RegisterMemberCommand cmd, CancellationToken ct)
        {
            if (!await captcha.VerifyAsync(cmd.CaptchaToken, ct))
                throw new ArgumentException("Captcha verification failed. Please try again.");

            var school = await db.Schools.AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == cmd.SchoolId, ct)
                ?? throw new KeyNotFoundException("Selected school was not found.");
            if (school.ApprovalStatus != ApprovalStatus.Approved || !school.IsActive)
                throw new ArgumentException("This school is not accepting registrations yet.");

            if (await db.Users.AnyAsync(u => u.Email == cmd.Email, ct))
                throw new ArgumentException("An account with this email already exists.");

            var user = new User
            {
                FirstName = cmd.FirstName, LastName = cmd.LastName, Email = cmd.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(cmd.Password),
                Phone = cmd.Phone, Role = cmd.Role, SchoolId = cmd.SchoolId,
                IsActive = false, ApprovalStatus = ApprovalStatus.Pending,
                GradeLevel = cmd.GradeLevel, RollNumber = cmd.RollNumber, DateOfBirth = cmd.DateOfBirth,
                GuardianName = cmd.GuardianName, GuardianPhone = cmd.GuardianPhone,
            };
            db.Users.Add(user);

            db.UserSchoolEnrollments.Add(new UserSchoolEnrollment
            {
                UserId = user.Id, SchoolId = cmd.SchoolId, Role = cmd.Role,
                Status = EnrollmentStatus.Pending, IsPrimary = true,
            });

            await NotificationFactory.AddForRoleAsync(db, UserRole.SchoolAdmin, cmd.SchoolId,
                NotificationType.ApprovalRequested, $"New {cmd.Role.ToString().ToLower()} awaiting approval",
                $"{cmd.FirstName} {cmd.LastName} requested to join as a {cmd.Role.ToString().ToLower()}.",
                user.Id.ToString(), ct);

            await db.SaveChangesAsync(ct);

            var (subject, html) = EmailTemplates.MemberRegistrationReceived(
                $"{cmd.FirstName} {cmd.LastName}", cmd.Role.ToString(), school.Name);
            await email.SendAsync(cmd.Email, subject, html, ct); // best-effort (never throws)

            return new RegisterResponse(
                $"Your request to join {school.Name} is pending approval. You'll be able to sign in once a school admin approves it.");
        }
    }
}
