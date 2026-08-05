using VidyaAI.Domain.Common;
using VidyaAI.Domain.Enums;

namespace VidyaAI.Domain.Entities;

// ── FLASHCARD SET ─────────────────────────────────────────────────
public class FlashcardSet : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CardCount { get; set; }

    public Guid? MaterialId { get; set; }
    public Material? Material { get; set; }

    public Guid CreatedById { get; set; }
    public User CreatedBy { get; set; } = null!;

    public Guid? SchoolId { get; set; }
    public School? School { get; set; }

    public ICollection<Flashcard> Cards { get; set; } = [];
}

public class Flashcard : BaseEntity
{
    public Guid SetId { get; set; }
    public FlashcardSet Set { get; set; } = null!;

    public int OrderIndex { get; set; }
    public string Front { get; set; } = string.Empty;
    public string Back { get; set; } = string.Empty;
    public Guid? SourceChunkId { get; set; }
}

// ── QUIZ ──────────────────────────────────────────────────────────
public class Quiz : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int QuestionCount { get; set; }
    public QuizDifficulty Difficulty { get; set; } = QuizDifficulty.Medium;

    public Guid? MaterialId { get; set; }
    public Material? Material { get; set; }

    public Guid CreatedById { get; set; }
    public User CreatedBy { get; set; } = null!;

    public Guid? SchoolId { get; set; }
    public School? School { get; set; }

    public ICollection<QuizQuestion> Questions { get; set; } = [];
    public ICollection<QuizAttempt> Attempts { get; set; } = [];
}

public class QuizQuestion : BaseEntity
{
    public Guid QuizId { get; set; }
    public Quiz Quiz { get; set; } = null!;

    public int OrderIndex { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string OptionsJson { get; set; } = "[]";   // JSON array of strings
    public int CorrectIndex { get; set; }
    public string? Explanation { get; set; }
    public Guid? SourceChunkId { get; set; }
}

// ── LESSON PLAN ───────────────────────────────────────────────────
public class LessonPlan : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Subject { get; set; }
    public string? GradeLevel { get; set; }
    public int DurationMinutes { get; set; } = 60;
    public string ContentMarkdown { get; set; } = string.Empty;

    public Guid? MaterialId { get; set; }
    public Material? Material { get; set; }

    public Guid CreatedById { get; set; }
    public User CreatedBy { get; set; } = null!;

    public Guid? SchoolId { get; set; }
    public School? School { get; set; }
}

public class QuizAttempt : BaseEntity
{
    public Guid QuizId { get; set; }
    public Quiz Quiz { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    // JSON: { "questionId": selectedIndex, ... }
    public string AnswersJson { get; set; } = "{}";
}

// ── DELIVERY ──────────────────────────────────────────────────────
// A teacher "delivers" study content to students for a specific day.
// Students see today's deliveries and read / listen / practise. Any of
// the three content links may be set; at least one is required.
public class Delivery : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Instructions { get; set; }

    // The calendar day this delivery is for (date only, no time component).
    public DateOnly ScheduledDate { get; set; }

    // Optional targeting hint (e.g. "Grade 8", "Class 10-A"). Free text for now.
    public string? GradeLevel { get; set; }

    // Read — the book/chapter PDF.
    public Guid? MaterialId { get; set; }
    public Material? Material { get; set; }

    // Practise — auto-generated quiz.
    public Guid? QuizId { get; set; }
    public Quiz? Quiz { get; set; }

    // Practise — auto-generated flashcards.
    public Guid? FlashcardSetId { get; set; }
    public FlashcardSet? FlashcardSet { get; set; }

    public Guid CreatedById { get; set; }
    public User CreatedBy { get; set; } = null!;

    public Guid? SchoolId { get; set; }
    public School? School { get; set; }
}
