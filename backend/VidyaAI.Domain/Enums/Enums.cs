namespace VidyaAI.Domain.Enums;

public enum UserRole { SuperAdmin, SchoolAdmin, Teacher, Student, Parent }
public enum BoardType { CBSE, ICSE, JKBOSE, StateBoard, IGCSE, Other }
public enum ArticleStatus { Draft, Published, Archived }
public enum ContentType { Text, Image, YouTube }
public enum SchoolType { Private, Government, CoachingCentre, College }
public enum SubscriptionPlan { Free, Starter, Growth, Pro, Enterprise }
public enum SubscriptionStatus { Active, Expired, Cancelled, Trial }
public enum NotificationType { CommentLiked, NewComment, ArticlePublished, Announcement }
public enum PermissionModule { Dashboard, Schools, Users, Roles, Articles, Categories }
public enum EnrollmentStatus { Active, Pending, Suspended, Alumni }
public enum MaterialStatus { Processing, Ready, Failed }
public enum ChatRole { User, Assistant, System }
public enum QuizDifficulty { Easy, Medium, Hard }
