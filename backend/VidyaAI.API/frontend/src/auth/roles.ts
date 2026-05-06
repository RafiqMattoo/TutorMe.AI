import type { UserRole } from '../types'

export const roleProfiles: Record<UserRole, {
  label: string
  email: string
  description: string
  scope: string
  accent: string
  allowedRoutes: string[]
}> = {
  SuperAdmin: {
    label: 'Super Admin',
    email: 'admin@vidyaai.com',
    description: 'Platform command center with every school, user, and content workflow.',
    scope: 'Global platform access',
    accent: 'from-teal-500 to-cyan-400',
    allowedRoutes: ['/dashboard', '/schools', '/users', '/roles', '/enrollments', '/articles', '/categories'],
  },
  SchoolAdmin: {
    label: 'School Admin',
    email: 'schooladmin@vidyaai.com',
    description: 'Runs school operations, manages campus users, and keeps publishing moving.',
    scope: 'Own school only',
    accent: 'from-blue-500 to-indigo-400',
    allowedRoutes: ['/dashboard', '/users', '/roles', '/enrollments', '/articles', '/categories'],
  },
  Teacher: {
    label: 'Teacher',
    email: 'teacher@vidyaai.com',
    description: 'Creates learning content, drafts lessons, and tracks classroom engagement.',
    scope: 'Content workspace',
    accent: 'from-emerald-500 to-teal-400',
    allowedRoutes: ['/dashboard', '/articles', '/categories'],
  },
  Student: {
    label: 'Student',
    email: 'student@vidyaai.com',
    description: 'A focused learner view for articles, knowledge drops, and study updates.',
    scope: 'Learning view',
    accent: 'from-amber-500 to-orange-400',
    allowedRoutes: ['/dashboard', '/articles', '/categories'],
  },
  Parent: {
    label: 'Parent',
    email: 'parent@vidyaai.com',
    description: 'Follows school content and sees learning activity through a guardian lens.',
    scope: 'Guardian view',
    accent: 'from-rose-500 to-pink-400',
    allowedRoutes: ['/dashboard', '/articles', '/categories'],
  },
}

export const roleOrder: UserRole[] = ['SuperAdmin', 'SchoolAdmin', 'Teacher', 'Student', 'Parent']

export function canAccess(role: UserRole | undefined, path: string) {
  if (!role) return false
  return roleProfiles[role].allowedRoutes.some(route => path === route || path.startsWith(`${route}/`))
}

export function manageableRoles(role: UserRole | undefined): UserRole[] {
  if (role === 'SuperAdmin') return roleOrder
  if (role === 'SchoolAdmin') return ['Teacher', 'Student', 'Parent']
  return []
}
