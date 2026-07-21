import type { UserRole } from "../types/index.ts";

export const roleProfiles: Record<
  UserRole,
  {
    label: string;
    email: string;
    description: string;
    scope: string;
    accent: string;
    allowedRoutes: string[];
  }
> = {
  SuperAdmin: {
    label: 'Super Admin',
    email: 'admin@vidyaai.com',
    description: 'Platform command center with every school, user, and content workflow.',
    scope: 'Global platform access',
    accent: 'from-teal-500 to-cyan-400',
    allowedRoutes: ['/dashboard', '/today', '/deliveries', '/schools', '/approvals', '/users', '/roles', '/enrollments', '/academics', '/students', '/transport', '/articles', '/categories', '/materials', '/tutor', '/simple-bot', '/flashcards', '/quizzes', '/recite', '/explain', '/scenes', '/lesson-plans' , '/audio-recap' ,'/video', '/video/:id'],
  },
  SchoolAdmin: {
    label: "School Admin",
    email: "schooladmin@vidyaai.com",
    description:
      "Runs school operations, manages campus users, and keeps publishing moving.",
    scope: "Own school only",
    accent: "from-blue-500 to-indigo-400",
    allowedRoutes: [
      "/dashboard",
      "/today",
      "/deliveries",
      "/approvals",
      "/users",
      "/roles",
      "/enrollments",
      "/academics",
      "/students",
      "/transport",
      "/articles",
      "/categories",
      "/materials",
      "/tutor",
      "/simple-bot",
      "/flashcards",
      "/quizzes",
      "/recite",
      "/explain",
      "/scenes",
      "/lesson-plans",
    ],
  },
  Teacher: {
    label: "Teacher",
    email: "teacher@vidyaai.com",
    description:
      "Creates learning content, drafts lessons, and tracks classroom engagement.",
    scope: "Content workspace",
    accent: "from-emerald-500 to-teal-400",
    allowedRoutes: [
      "/dashboard",
      "/today",
      "/deliveries",
      "/students",
      "/articles",
      "/categories",
      "/materials",
      "/tutor",
      "/simple-bot",
      "/flashcards",
      "/quizzes",
      "/recite",
      "/explain",
      "/scenes",
      "/lesson-plans",
    ],
  },
  Student: {
    label: "Student",
    email: "student@vidyaai.com",
    description:
      "A focused learner view for articles, knowledge drops, and study updates.",
    scope: "Learning view",
    accent: "from-amber-500 to-orange-400",
    allowedRoutes: [
      "/dashboard",
      "/today",
      "/articles",
      "/categories",
      "/materials",
      "/tutor",
      "/simple-bot",
      "/flashcards",
      "/quizzes",
      "/recite",
      "/explain",
      "/scenes",
    ],
  },
  Parent: {
    label: "Parent",
    email: "parent@vidyaai.com",
    description:
      "Follows school content and sees learning activity through a guardian lens.",
    scope: "Guardian view",
    accent: "from-rose-500 to-pink-400",
    allowedRoutes: [
      "/dashboard",
      "/today",
      "/articles",
      "/categories",
      "/materials",
      "/tutor",
      "/simple-bot",
      "/flashcards",
      "/quizzes",
      "/recite",
      "/explain",
      "/scenes",
    ],
  },
};

export const roleOrder: UserRole[] = [
  "SuperAdmin",
  "SchoolAdmin",
  "Teacher",
  "Student",
  "Parent",
];

export function canAccess(role: UserRole | undefined, path: string) {
  if (!role) return false;
  return roleProfiles[role].allowedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
}

export function manageableRoles(role: UserRole | undefined): UserRole[] {
  if (role === "SuperAdmin") return roleOrder;
  if (role === "SchoolAdmin") return ["Teacher", "Student", "Parent"];
  return [];
}

// ── Capability matrix for AI Learning ─────────────────────────────
// Teachers + admins create/upload/generate. Students + parents only consume.
const CREATOR_ROLES: UserRole[] = ["SuperAdmin", "SchoolAdmin", "Teacher"];

export function canCreateMaterials(role: UserRole | undefined) {
  return !!role && CREATOR_ROLES.includes(role);
}
export function canGenerateStudyContent(role: UserRole | undefined) {
  return !!role && CREATOR_ROLES.includes(role);
}
export function canDeleteStudyContent(role: UserRole | undefined) {
  return !!role && CREATOR_ROLES.includes(role);
}
