export type UserRole = 'SuperAdmin' | 'SchoolAdmin' | 'Teacher' | 'Student' | 'Parent'
export type ArticleStatus = 'Draft' | 'Published' | 'Archived'
export type ContentType = 'Text' | 'Image' | 'YouTube'
export type BoardType = 'CBSE' | 'ICSE' | 'JKBOSE' | 'StateBoard' | 'IGCSE' | 'Other'
export type SchoolType = 'Private' | 'Government' | 'CoachingCentre' | 'College'
export type SubscriptionPlan = 'Free' | 'Starter' | 'Growth' | 'Pro' | 'Enterprise'
export type SubscriptionStatus = 'Active' | 'Expired' | 'Cancelled' | 'Trial'
export type PermissionModule = 'Dashboard' | 'Schools' | 'Users' | 'Roles' | 'Articles' | 'Categories'
export type EnrollmentStatus = 'Active' | 'Pending' | 'Suspended' | 'Alumni'

export interface User {
  id: string; firstName: string; lastName: string; email: string
  phone?: string; avatarUrl?: string; role: UserRole
  isActive: boolean; emailVerified: boolean; lastLoginAt?: string
  schoolId?: string; schoolName?: string; createdAt: string
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
