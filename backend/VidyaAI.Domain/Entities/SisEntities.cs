using VidyaAI.Domain.Common;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Domain.Entities;

// ── STUDENT INFORMATION SYSTEM (A2) ───────────────────────────────
// The student master — the spine of admissions, attendance, assessment, fees & the HPC.
// Tenant-scoped by SchoolId and soft-deleted. Current placement references the academic
// backbone (Class/Section/Year/House). Sensitive identifiers (Aadhaar) are captured here
// but PII encryption & DPDP consent are deferred to platform hardening (E7).
public class Student : BaseEntity
{
    public Guid SchoolId { get; set; }
    public School School { get; set; } = null!;

    // ── Identity ──
    public string AdmissionNumber { get; set; } = string.Empty;   // unique per school
    public string? RollNumber { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public Gender Gender { get; set; } = Gender.Male;
    public DateTime DateOfBirth { get; set; }
    public DateTime AdmissionDate { get; set; }
    public StudentStatus Status { get; set; } = StudentStatus.Active;
    public string? PhotoUrl { get; set; }

    // ── Current placement (references the academic backbone) ──
    public Guid? AcademicYearId { get; set; }
    public AcademicYear? AcademicYear { get; set; }
    public Guid? SchoolClassId { get; set; }
    public SchoolClass? SchoolClass { get; set; }
    public Guid? SectionId { get; set; }
    public Section? Section { get; set; }
    public Guid? HouseId { get; set; }
    public House? House { get; set; }

    // ── Contact ──
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Pincode { get; set; }

    // ── Demographics, NEP & compliance ──
    public StudentCategory Category { get; set; } = StudentCategory.General;
    public string? BloodGroup { get; set; }
    public string? Nationality { get; set; }
    public string? MotherTongue { get; set; }
    public string? Religion { get; set; }
    public bool IsCwsn { get; set; }                  // Children With Special Needs (divyang)
    public string? CwsnNature { get; set; }
    public bool IsRte { get; set; }                   // admitted under the RTE 25% EWS quota
    public string? AadhaarNumber { get; set; }        // sensitive — encryption deferred (E7)
    public string? ApaarId { get; set; }              // APAAR / "One Nation One Student ID"

    // ── Guardians (inline; sibling links & full guardian normalization are a later slice) ──
    public string? FatherName { get; set; }
    public string? FatherPhone { get; set; }
    public string? FatherOccupation { get; set; }
    public string? MotherName { get; set; }
    public string? MotherPhone { get; set; }
    public string? MotherOccupation { get; set; }
    public string? GuardianName { get; set; }
    public string? GuardianPhone { get; set; }
    public string? GuardianEmail { get; set; }
    public string? GuardianRelation { get; set; }

    // Optional link to a login account (Student/Parent). Account provisioning deferred.
    public Guid? UserId { get; set; }
    public User? User { get; set; }
}
