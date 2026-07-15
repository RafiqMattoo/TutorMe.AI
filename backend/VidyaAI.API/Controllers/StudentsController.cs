using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using VidyaAI.Application.Articles.Commands;
using VidyaAI.Application.Articles.Queries;
using VidyaAI.Application.Auth.Commands;
using VidyaAI.Application.Dashboard.Queries;
using VidyaAI.Application.Deliveries.Commands;
using VidyaAI.Application.Deliveries.Queries;
using VidyaAI.Application.Flashcards.Commands;
using VidyaAI.Application.Flashcards.Queries;
using VidyaAI.Application.LessonPlans.Commands;
using VidyaAI.Application.LessonPlans.Queries;
using VidyaAI.Application.Academics.Commands;
using VidyaAI.Application.Academics.Queries;
using VidyaAI.Application.Students.Commands;
using VidyaAI.Application.Students.Queries;
using VidyaAI.Application.Transport.Commands;
using VidyaAI.Application.Transport.Queries;
using VidyaAI.Application.Approvals.Commands;
using VidyaAI.Application.Approvals.Queries;
using VidyaAI.Application.Materials.Commands;
using VidyaAI.Application.Materials.Queries;
using VidyaAI.Application.Narration.Commands;
using VidyaAI.Application.Narration.Queries;
using VidyaAI.Application.Notifications.Commands;
using VidyaAI.Application.Notifications.Queries;
using VidyaAI.Application.Registration.Commands;
using VidyaAI.Application.Registration.Queries;
using VidyaAI.Application.Quizzes.Commands;
using VidyaAI.Application.Quizzes.Queries;
using VidyaAI.Application.Schools.Commands;
using VidyaAI.Application.Schools.Queries;
using VidyaAI.Application.SimpleBot.Commands;
using VidyaAI.Application.Tutor.Commands;
using VidyaAI.Application.Tutor.Queries;
using VidyaAI.Application.Users.Commands;
using VidyaAI.Application.Users.Queries;
using VidyaAI.Application.DTOs;
using VidyaAI.Application.Enrollments;
using VidyaAI.Application.Roles;
using VidyaAI.Domain.Enums;

namespace VidyaAI.API.Controllers
{

    // ── STUDENT INFORMATION SYSTEM (A2) ──────────────────────────────
    // Student master. Teachers may read the roster; only SuperAdmin/SchoolAdmin may write.
    // SuperAdmin operates on a school passed via ?schoolId=; everyone else is pinned to their own.
    [Route("api/students"), Authorize(Roles = "SuperAdmin,SchoolAdmin,Teacher")]
    public sealed class StudentsController(ISender sender) : BaseController(sender)
    {
        private Guid Scope(Guid? schoolId)
            => ((IsSuperAdmin ? (schoolId ?? CurrentSchoolId) : CurrentSchoolId))
               ?? throw new InvalidOperationException("A school context is required.");

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] Guid? schoolId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null, [FromQuery] Guid? classId = null,
            [FromQuery] Guid? sectionId = null, [FromQuery] StudentStatus? status = null,
            CancellationToken ct = default)
            => Ok(await Sender.Send(new GetStudentsQuery(Scope(schoolId), page, pageSize, search, classId, sectionId, status), ct));

        [HttpGet("next-admission-number")]
        public async Task<IActionResult> NextAdmissionNumber([FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(new { admissionNumber = await Sender.Send(new GetNextAdmissionNumberQuery(Scope(schoolId)), ct) });

        [HttpGet("options")]
        public async Task<IActionResult> Options([FromQuery] Guid? schoolId, [FromQuery] string? search, CancellationToken ct)
            => Ok(await Sender.Send(new GetStudentOptionsQuery(Scope(schoolId), search), ct));

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
            => Ok(await Sender.Send(new GetStudentByIdQuery(id, Scope(schoolId)), ct));

        [HttpPost, Authorize(Roles = "SuperAdmin,SchoolAdmin")]
        public async Task<IActionResult> Create([FromBody] SaveStudentRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveStudentCommand(null, Scope(req.SchoolId), req), ct));

        [HttpPut("{id:guid}"), Authorize(Roles = "SuperAdmin,SchoolAdmin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] SaveStudentRequest req, CancellationToken ct)
            => Ok(await Sender.Send(new SaveStudentCommand(id, Scope(req.SchoolId), req), ct));

        [HttpDelete("{id:guid}"), Authorize(Roles = "SuperAdmin,SchoolAdmin")]
        public async Task<IActionResult> Delete(Guid id, [FromQuery] Guid? schoolId, CancellationToken ct)
        { await Sender.Send(new DeleteStudentCommand(id, Scope(schoolId)), ct); return NoContent(); }
    }
}
