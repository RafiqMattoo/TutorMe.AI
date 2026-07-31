

using VidyaAI.Domain.Common;

namespace VidyaAI.Domain.Entities;

public class Exam : BaseEntity
{
    public Guid SchoolId { get; set; }
    public School School { get; set; } = null!;

    public Guid AcademicYearId { get; set; }
    public AcademicYear AcademicYear { get; set; } = null!;

    public Guid? TermId { get; set; }
    public Term? Term { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    public ICollection<ExamSubject> Subjects { get; set; } = [];
}

public class ExamSubject : BaseEntity
{
    public Guid ExamId { get; set; }
    public Exam Exam { get; set; } = null!;

    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;

    public decimal MaxMarks { get; set; }
    public decimal PassMarks { get; set; }

    public ICollection<StudentExamResult> Results { get; set; } = [];
}

public class StudentExamResult : BaseEntity
{
    public Guid StudentId { get; set; }
    public Student Student { get; set; } = null!;

    public Guid ExamSubjectId { get; set; }
    public ExamSubject ExamSubject { get; set; } = null!;

    public decimal MarksObtained { get; set; }

    public string? Grade { get; set; }
    public string? Remarks { get; set; }
}