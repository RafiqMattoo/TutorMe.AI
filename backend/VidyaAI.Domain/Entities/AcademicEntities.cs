using VidyaAI.Domain.Common;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Domain.Entities;

// ── ACADEMIC STRUCTURE (A1) ───────────────────────────────────────
// The academic backbone every SMS module references. All rows are tenant-scoped by
// SchoolId and soft-deleted. NEP 2020 stage structure is modeled on SchoolClass.

// An academic session, e.g. "2025-26". Exactly one IsCurrent per school.
public class AcademicYear : BaseEntity
{
    public Guid SchoolId { get; set; }
    public School School { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsCurrent { get; set; }

    public ICollection<Term> Terms { get; set; } = [];
}

// A term/semester within an academic year (e.g. "Term 1"). Drives exams & report cards.
public class Term : BaseEntity
{
    public Guid SchoolId { get; set; }
    public Guid AcademicYearId { get; set; }
    public AcademicYear AcademicYear { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int SortOrder { get; set; }
}

// A grade/class, e.g. "Grade 5" or "Balvatika". Level is the ordinal used for ordering
// and year-end promotion (e.g. Balvatika = 0, Grade 1 = 1 … Grade 12 = 12). Stage maps
// the grade to its NEP 2020 stage.
public class SchoolClass : BaseEntity
{
    public Guid SchoolId { get; set; }
    public School School { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public SchoolStage Stage { get; set; } = SchoolStage.Foundational;
    public int Level { get; set; }

    public ICollection<Section> Sections { get; set; } = [];
}

// A division within a class, e.g. "5-A", with an optional homeroom/class teacher.
public class Section : BaseEntity
{
    public Guid SchoolId { get; set; }
    public Guid SchoolClassId { get; set; }
    public SchoolClass SchoolClass { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }

    public Guid? ClassTeacherId { get; set; }
    public User? ClassTeacher { get; set; }
}

// A subject taught at the school. NEP multilingual/three-language and co-scholastic
// classification are first-class so curriculum & HPC can reason about them.
public class Subject : BaseEntity
{
    public Guid SchoolId { get; set; }
    public School School { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? MediumOfInstruction { get; set; }
    public bool IsLanguage { get; set; }       // counts toward the three-language formula
    public bool IsCoScholastic { get; set; }   // arts/sports/life-skills (HPC co-scholastic)
}

// A school house (e.g. for sports/values/house-points), with an optional house master.
public class House : BaseEntity
{
    public Guid SchoolId { get; set; }
    public School School { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string? ColorHex { get; set; }

    public Guid? HouseMasterId { get; set; }
    public User? HouseMaster { get; set; }
}
