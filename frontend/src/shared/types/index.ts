export type UserRole = 'SuperAdmin' | 'SchoolAdmin' | 'Teacher' | 'Student' | 'Parent'
export type ArticleStatus = 'Draft' | 'Published' | 'Archived'
export type ContentType = 'Text' | 'Image' | 'YouTube'
export type BoardType = 'CBSE' | 'ICSE' | 'JKBOSE' | 'StateBoard' | 'IGCSE' | 'Other'
export type SchoolType = 'Private' | 'Government' | 'CoachingCentre' | 'College'
export type SubscriptionPlan = 'Free' | 'Starter' | 'Growth' | 'Pro' | 'Enterprise'
export type SubscriptionStatus = 'Active' | 'Expired' | 'Cancelled' | 'Trial'
export type PermissionModule = 'Dashboard' | 'Schools' | 'Users' | 'Roles' | 'Articles' | 'Categories'
export type EnrollmentStatus = 'Active' | 'Pending' | 'Suspended' | 'Alumni'

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected'

export interface User {
  id: string; firstName: string; lastName: string; email: string
  phone?: string; avatarUrl?: string; role: UserRole
  isActive: boolean; emailVerified: boolean; lastLoginAt?: string
  schoolId?: string; schoolName?: string; createdAt: string
  approvalStatus: ApprovalStatus
  gradeLevel?: string; rollNumber?: string; dateOfBirth?: string
  guardianName?: string; guardianPhone?: string
}

// ── SELF-REGISTRATION & APPROVALS ─────────────────────────────────
export interface PublicSchool { id: string; name: string; city?: string; state?: string }

export interface PendingSchool {
  id: string; name: string; city?: string; state?: string
  type: SchoolType; board: BoardType
  adminName?: string; adminEmail?: string; createdAt: string
}

export interface PendingMember {
  id: string; firstName: string; lastName: string; email: string; role: UserRole
  schoolId?: string; schoolName?: string; gradeLevel?: string; rollNumber?: string; createdAt: string
}

export type NotificationType =
  | 'CommentLiked' | 'NewComment' | 'ArticlePublished' | 'Announcement'
  | 'ApprovalRequested' | 'ApprovalGranted' | 'ApprovalRejected'

export interface AppNotification {
  id: string; type: NotificationType; title: string; message: string
  isRead: boolean; referenceId?: string; createdAt: string
}

export interface RolePermission {
  id: string; roleDefinitionId: string; roleName: string; roleDisplayName: string; module: PermissionModule
  canView: boolean; canCreate: boolean; canEdit: boolean; canDelete: boolean; canApprove: boolean
}

export interface RoleDefinition {
  id: string; name: string; displayName: string; description?: string
  isSystemRole: boolean; isActive: boolean; createdAt: string
}

export interface UserSchoolEnrollment {
  id: string; userId: string; userName: string; schoolId: string; schoolName: string
  role: UserRole; status: EnrollmentStatus; isPrimary: boolean; enrolledAt: string
}

export interface School {
  id: string; name: string; address?: string; city?: string; state?: string
  phone?: string; email?: string; logoUrl?: string
  type: SchoolType; board: BoardType
  plan: SubscriptionPlan; subscriptionStatus: SubscriptionStatus
  subscriptionExpiresAt?: string; isActive: boolean
  totalUsers: number; totalArticles: number; createdAt: string
  approvalStatus: ApprovalStatus
}

export interface Article {
  id: string; title: string; body: string; summary?: string; aiSummary?: string
  coverImageUrl?: string; youtubeUrl?: string
  contentType: ContentType; status: ArticleStatus
  tags?: string; viewCount: number; likeCount: number; commentCount: number
  publishedAt?: string; scheduledAt?: string
  authorId: string; authorName: string
  schoolId?: string; schoolName?: string
  categoryId?: string; categoryName?: string
  createdAt: string
}

export interface ArticleListItem {
  id: string; title: string; coverImageUrl?: string
  contentType: ContentType; status: ArticleStatus
  tags?: string; viewCount: number; likeCount: number; commentCount: number
  publishedAt?: string; authorName: string; categoryName?: string; createdAt: string
}

export interface Category {
  id: string; name: string; description?: string
  iconUrl?: string; sortOrder: number; isActive: boolean; articleCount: number
}

export interface DashboardStats {
  totalSchools: number; totalUsers: number; totalArticles: number
  totalStudents: number; totalTeachers: number
  publishedArticles: number; draftArticles: number
  totalLikes: number; totalComments: number; totalViews: number
  newUsersThisWeek: number; newArticlesThisWeek: number
  topArticles: TopArticle[]; recentActivity: RecentActivity[]
}

export interface TopArticle {
  id: string; title: string; viewCount: number
  likeCount: number; commentCount: number; authorName: string; publishedAt?: string
}

export interface RecentActivity {
  type: string; description: string; userName?: string; occurredAt: string
}

export interface PagedResult<T> {
  items: T[]; totalCount: number; page: number
  pageSize: number; totalPages: number
  hasNextPage: boolean; hasPreviousPage: boolean
}

export interface LoginResponse {
  accessToken: string; refreshToken: string; user: User
}

export interface AuthState {
  user: User | null; token: string | null
  login: (res: LoginResponse) => void; logout: () => void
}

// ── MATERIALS / TUTOR ─────────────────────────────────────────────
export type MaterialStatus = 'Processing' | 'Ready' | 'Failed'
export type ChatRole = 'User' | 'Assistant' | 'System'

export interface Material {
  id: string; title: string; fileName: string; fileUrl: string; contentType: string
  fileSize: number; pageCount: number; status: MaterialStatus; errorMessage?: string
  uploadedById: string; uploadedByName: string
  schoolId?: string; categoryId?: string; categoryName?: string
  chunkCount: number; createdAt: string
}

export interface ChunkCitation {
  chunkId: string; pageNumber?: number; snippet: string
}

export interface ChatMessage {
  id: string; role: ChatRole; content: string
  citations: ChunkCitation[]; createdAt: string
}

export interface ChatSession {
  id: string; title: string; materialId?: string; materialTitle?: string
  messageCount: number; createdAt: string
}

export interface AskTutorResponse {
  sessionId: string; message: ChatMessage
}

// One frame in the streamed (SSE) tutor response.
export interface TutorStreamEvent {
  type: 'meta' | 'token' | 'done' | 'error'
  sessionId?: string
  delta?: string
  citations?: ChunkCitation[]
  messageId?: string
}

// ── SIMPLE BOT ───────────────────────────────────────────────────
export type SimpleBotRole = 'user' | 'assistant'

export interface SimpleBotTurn {
  role: SimpleBotRole; content: string
}

export interface AskSimpleBotRequest {
  message: string; history?: SimpleBotTurn[]
}

export interface SimpleBotResponse {
  reply: string
}

// ── FLASHCARDS ────────────────────────────────────────────────────
export interface Flashcard {
  id: string; orderIndex: number; front: string; back: string
}

export interface FlashcardSetSummary {
  id: string; title: string; description?: string; cardCount: number
  materialId?: string; materialTitle?: string
  createdByName: string; createdAt: string
}

export interface FlashcardSet extends FlashcardSetSummary {
  cards: Flashcard[]
}

// ── QUIZZES ──────────────────────────────────────────────────────
export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard'

export interface QuizQuestion {
  id: string; orderIndex: number; questionText: string
  options: string[]; correctIndex?: number; explanation?: string
}

export interface QuizSummary {
  id: string; title: string; questionCount: number; difficulty: QuizDifficulty
  materialId?: string; materialTitle?: string
  attemptCount: number; createdByName: string; createdAt: string
}

export interface Quiz extends Omit<QuizSummary, 'attemptCount'> {
  description?: string; questions: QuizQuestion[]
}

export interface QuizQuestionResult {
  questionId: string; questionText: string; options: string[]
  correctIndex: number; selectedIndex?: number; isCorrect: boolean; explanation?: string
}

export interface QuizAttemptResult {
  id: string; quizId: string; score: number; totalQuestions: number
  completedAt: string; questions: QuizQuestionResult[]
}

// ── MATERIAL CHUNKS / RECITATION ──────────────────────────────────
export interface MaterialChunk {
  id: string; chunkIndex: number; pageNumber?: number; content: string
}

// ── NARRATION (audio read-along) ──────────────────────────────────
export type NarrationStatus = 'Processing' | 'Ready' | 'Failed'
export type NarrationKind = 'Verbatim' | 'Explained' | 'Illustrated'

export interface NarrationSegment {
  segmentIndex: number; chunkIndex: number; pageNumber?: number
  text: string; startMs: number; endMs: number; imageUrl?: string
}

export interface Narration {
  id: string; materialId: string; kind: NarrationKind; status: NarrationStatus
  audioUrl?: string; contentType: string; voice?: string
  durationMs: number; errorMessage?: string
  segments: NarrationSegment[]; createdAt: string
}

export interface NarrationVoice { id: string; name: string; language: string }

// ── ACADEMIC STRUCTURE (A1) ───────────────────────────────────────
export type SchoolStage = 'Foundational' | 'Preparatory' | 'Middle' | 'Secondary'

export interface Term {
  id: string; academicYearId: string; name: string
  startDate: string; endDate: string; sortOrder: number
}
export interface AcademicYear {
  id: string; schoolId: string; name: string
  startDate: string; endDate: string; isCurrent: boolean
  terms: Term[]; createdAt: string
}
export interface SchoolClass {
  id: string; schoolId: string; name: string; stage: SchoolStage
  level: number; sectionCount: number; createdAt: string
}
export interface Section {
  id: string; schoolId: string; schoolClassId: string; schoolClassName: string
  name: string; capacity: number; classTeacherId?: string; classTeacherName?: string
  streamId?: string; streamName?: string; createdAt: string
}
export interface Subject {
  id: string; schoolId: string; name: string; code?: string; mediumOfInstruction?: string
  isLanguage: boolean; isCoScholastic: boolean; createdAt: string
}
export interface House {
  id: string; schoolId: string; name: string; colorHex?: string
  houseMasterId?: string; houseMasterName?: string; createdAt: string
}
export interface Stream {
  id: string; schoolId: string; name: string; code?: string; createdAt: string
}
export interface TeacherOption { id: string; name: string }
export interface SubjectAllocation {
  id: string; schoolId: string; subjectId: string; subjectName: string
  schoolClassId: string; schoolClassName: string; sectionId?: string; sectionName?: string
  teacherId: string; teacherName: string; createdAt: string
}
export interface GradeBand {
  id: string; gradingScaleId: string; grade: string
  minPercent: number; maxPercent: number; gradePoint?: number; description?: string
}
export interface GradingScale {
  id: string; schoolId: string; name: string; board?: BoardType; isDefault: boolean
  bands: GradeBand[]; createdAt: string
}

// ── STUDENT INFORMATION SYSTEM (A2) ───────────────────────────────
export type Gender = 'Male' | 'Female' | 'Other'
export type StudentCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
export type StudentStatus = 'Active' | 'Inactive' | 'TransferredOut' | 'Graduated' | 'Alumni'

export interface StudentListItem {
  id: string; admissionNumber: string; rollNumber?: string; fullName: string
  gender: Gender; category: StudentCategory; status: StudentStatus
  schoolClassId?: string; className?: string; sectionName?: string; photoUrl?: string; admissionDate: string
}

export interface Student {
  id: string; schoolId: string; admissionNumber: string; rollNumber?: string
  firstName: string; lastName: string; gender: Gender; dateOfBirth: string; admissionDate: string
  status: StudentStatus; photoUrl?: string
  academicYearId?: string; schoolClassId?: string; className?: string; sectionId?: string; sectionName?: string
  houseId?: string; houseName?: string
  email?: string; phone?: string; address?: string; city?: string; state?: string; pincode?: string
  category: StudentCategory; bloodGroup?: string; nationality?: string; motherTongue?: string; religion?: string
  isCwsn: boolean; cwsnNature?: string; isRte: boolean; aadhaarNumber?: string; apaarId?: string
  fatherName?: string; fatherPhone?: string; fatherOccupation?: string
  motherName?: string; motherPhone?: string; motherOccupation?: string
  guardianName?: string; guardianPhone?: string; guardianEmail?: string; guardianRelation?: string
  createdAt: string
}
export interface StudentOption { id: string; name: string; admissionNumber: string; className?: string }

// ── TRANSPORT (D4) ────────────────────────────────────────────────
export type TransportFeeFrequency = 'Monthly' | 'Quarterly' | 'HalfYearly' | 'Annual'

export interface TransportVehicle {
  id: string; schoolId: string; registrationNumber: string; model?: string; capacity: number
  driverName?: string; driverPhone?: string; notes?: string; isActive: boolean; routeCount: number; createdAt: string
}
export interface TransportRoute {
  id: string; schoolId: string; name: string; code?: string; description?: string
  vehicleId?: string; vehicleName?: string; fare: number; feeFrequency: TransportFeeFrequency
  isActive: boolean; stopCount: number; studentCount: number; createdAt: string
}
export interface TransportStop {
  id: string; schoolId: string; routeId: string; name: string; sortOrder: number
  pickupTime?: string; dropTime?: string; stopFare?: number; createdAt: string
}
export interface StudentTransport {
  id: string; schoolId: string; studentId: string; studentName: string; admissionNumber: string
  routeId: string; routeName: string; stopId?: string; stopName?: string; fare: number; isActive: boolean; createdAt: string
}

// ── LESSON PLANS ──────────────────────────────────────────────────
export interface LessonPlanSummary {
  id: string; title: string; subject?: string; gradeLevel?: string
  durationMinutes: number; materialId?: string; materialTitle?: string
  createdByName: string; createdAt: string
}

export interface LessonPlan extends LessonPlanSummary {
  contentMarkdown: string
}

// ── DELIVERIES (Delivered Today) ──────────────────────────────────
export interface Delivery {
  id: string
  title: string
  instructions?: string
  scheduledDate: string          // YYYY-MM-DD (DateOnly)
  gradeLevel?: string
  materialId?: string
  materialTitle?: string
  materialStatus?: MaterialStatus
  materialFileUrl?: string
  quizId?: string
  quizTitle?: string
  quizQuestionCount?: number
  flashcardSetId?: string
  flashcardSetTitle?: string
  flashcardCardCount?: number
  createdByName: string
  createdAt: string
}

export interface CreateDeliveryRequest {
  title: string
  instructions?: string
  scheduledDate: string          // YYYY-MM-DD
  gradeLevel?: string
  materialId?: string
  quizId?: string
  flashcardSetId?: string
}

// export interface Video {
//   id: string;
//   title: string;
//   author: string;
//   thumbnail: string;
//   views: string;
//   createdAt: string;
// }

export interface VideoCardProps {
  video: Video;
}

export interface VideoPlayerProps {
  video: Video;
}
export interface VideoInfoProps {
  video: Video;
}

export interface DescriptionCardProps {
  video: Video;
}
export interface KeepWatchingProps {
  video: Video;
}
export interface MasterTopicProps {
  video: Video;
}
export interface VideoDescriptionPageProps {
  video: Video;
}
export interface VideosPageProps {
  videos: Video[];
}

export interface Video {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  createdAt: string;
  views: string;
  description: string;
  duration: string;
  videoUrl?: string;
  authorAvatar?: string;
likes?: number;
}

import type {
  InputHTMLAttributes,
  ReactNode,
} from "react"


export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {

  /**
   * Icon displayed inside left side
   */
  leftIcon?: ReactNode


  /**
   * Icon displayed inside right side
   */
  rightIcon?: ReactNode


  /**
   * Input size
   */
  size?: "sm" | "md" | "lg"


  /**
   * Show clear button
   */
  clearable?: boolean


  /**
   * Clear callback
   */
  onClear?: () => void
}