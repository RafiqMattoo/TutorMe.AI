namespace VidyaAI.Domain.Enums;

public enum UserRole { SuperAdmin, SchoolAdmin, Teacher, Student, Parent }
public enum BoardType { CBSE, ICSE, JKBOSE, StateBoard, IGCSE, Other }
public enum ArticleStatus { Draft, Published, Archived }
public enum ContentType { Text, Image, YouTube }
public enum SchoolType { Private, Government, CoachingCentre, College }
public enum SubscriptionPlan { Free, Starter, Growth, Pro, Enterprise }
public enum SubscriptionStatus { Active, Expired, Cancelled, Trial }
public enum NotificationType { CommentLiked, NewComment, ArticlePublished, Announcement, ApprovalRequested, ApprovalGranted, ApprovalRejected }

// Lifecycle of a self-registered school or member awaiting admin approval.
public enum ApprovalStatus { Pending, Approved, Rejected }
public enum PermissionModule { Dashboard, Schools, Users, Roles, Articles, Categories }
public enum EnrollmentStatus { Active, Pending, Suspended, Alumni }
public enum MaterialStatus { Processing, Ready, Failed }

// NEP 2020 5+3+3+4 school stages. Foundational = Balvatika–Grade 2 (play/activity, FLN
// focus); Preparatory = Grades 3–5; Middle = Grades 6–8; Secondary = Grades 9–12.
public enum SchoolStage { Foundational, Preparatory, Middle, Secondary }
public enum ChatRole { User, Assistant, System }
public enum QuizDifficulty { Easy, Medium, Hard }
public enum NarrationStatus { Processing, Ready, Failed }

// Verbatim = narrate the document text as-is (Recite). Explained = an AI-simplified
// explanation of each section, narrated for the animated explainer. Illustrated =
// like Explained, plus an AI-generated picture per section for the animated story
// scenes view.
public enum NarrationKind { Verbatim, Explained, Illustrated }
