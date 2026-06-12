import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import type { AcademicYear, AppNotification, Article, ArticleListItem, ArticleStatus, AskTutorResponse, Category, ChatMessage, ChatSession, CreateDeliveryRequest, DashboardStats, Delivery, FlashcardSet, FlashcardSetSummary, House, LessonPlan, LessonPlanSummary, LoginResponse, Material, MaterialChunk, Narration, NarrationKind, NarrationVoice, PagedResult, PendingMember, PendingSchool, PublicSchool, Quiz, QuizAttemptResult, QuizDifficulty, QuizSummary, RoleDefinition, RolePermission, School, SchoolClass, Section, Subject, Term, TutorStreamEvent, User, UserSchoolEnrollment } from '../types'

const api = axios.create({ baseURL: '/api', timeout: 60000 })

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refreshToken')
      if (refresh) {
        try {
          const res = await axios.post<LoginResponse>('/api/auth/refresh', { refreshToken: refresh })
          useAuthStore.getState().login(res.data)
          err.config.headers.Authorization = `Bearer ${res.data.accessToken}`
          return api.request(err.config)
        } catch { useAuthStore.getState().logout() }
      }
    }
    return Promise.reject(err)
  }
)

// ── AUTH ──────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }).then(r => r.data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me').then(r => r.data),
  // Public self-registration (no auth required).
  publicSchools: () => api.get<PublicSchool[]>('/auth/schools').then(r => r.data),
  registerSchool: (data: object) =>
    api.post<{ message: string }>('/auth/register/school', data).then(r => r.data),
  registerMember: (data: object) =>
    api.post<{ message: string }>('/auth/register/member', data).then(r => r.data),
}

// ── APPROVALS (self-registration review) ──────────────────────────
export const approvalsApi = {
  pendingSchools: () => api.get<PendingSchool[]>('/approvals/schools').then(r => r.data),
  approveSchool: (id: string) => api.post(`/approvals/schools/${id}/approve`),
  rejectSchool: (id: string) => api.post(`/approvals/schools/${id}/reject`),
  pendingMembers: () => api.get<PendingMember[]>('/approvals/members').then(r => r.data),
  approveMember: (id: string) => api.post(`/approvals/members/${id}/approve`),
  rejectMember: (id: string) => api.post(`/approvals/members/${id}/reject`),
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────
export const notificationsApi = {
  getAll: () => api.get<AppNotification[]>('/notifications').then(r => r.data),
  markRead: (id: string) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
}

// ── DASHBOARD ─────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats').then(r => r.data),
}

// ── SCHOOLS ───────────────────────────────────────────────────────
export const schoolsApi = {
  getAll: (params?: object) => api.get<PagedResult<School>>('/schools', { params }).then(r => r.data),
  getById: (id: string) => api.get<School>(`/schools/${id}`).then(r => r.data),
  create: (data: object) => api.post<School>('/schools', data).then(r => r.data),
  update: (id: string, data: object) => api.put<School>(`/schools/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/schools/${id}`),
}

// ── USERS ─────────────────────────────────────────────────────────
export const usersApi = {
  getAll: (params?: object) => api.get<PagedResult<User>>('/users', { params }).then(r => r.data),
  create: (data: object) => api.post<User>('/users', data).then(r => r.data),
  toggleActive: (id: string) => api.patch(`/users/${id}/toggle-active`),
  delete: (id: string) => api.delete(`/users/${id}`),
}

export const rolesApi = {
  getRoles: () => api.get<RoleDefinition[]>('/roles').then(r => r.data),
  createRole: (data: object) => api.post<RoleDefinition>('/roles', data).then(r => r.data),
  updateRole: (id: string, data: object) => api.put<RoleDefinition>(`/roles/${id}`, data).then(r => r.data),
  deleteRole: (id: string) => api.delete(`/roles/${id}`),
  getPermissions: (roleDefinitionId?: string) => api.get<RolePermission[]>('/roles/permissions', { params: { roleDefinitionId } }).then(r => r.data),
  upsertPermission: (data: Omit<RolePermission, 'id' | 'roleName' | 'roleDisplayName'>) => api.post<RolePermission>('/roles/permissions', data).then(r => r.data),
  deletePermission: (id: string) => api.delete(`/roles/permissions/${id}`),
}

export const enrollmentsApi = {
  getAll: (params?: object) => api.get<UserSchoolEnrollment[]>('/enrollments', { params }).then(r => r.data),
  create: (data: object) => api.post<UserSchoolEnrollment>('/enrollments', data).then(r => r.data),
  delete: (id: string) => api.delete(`/enrollments/${id}`),
}

// ── ARTICLES ──────────────────────────────────────────────────────
export const articlesApi = {
  getAll: (params?: object) => api.get<PagedResult<ArticleListItem>>('/articles', { params }).then(r => r.data),
  getById: (id: string) => api.get<Article>(`/articles/${id}`).then(r => r.data),
  create: (data: object) => api.post<Article>('/articles', data).then(r => r.data),
  update: (id: string, data: object) => api.put<Article>(`/articles/${id}`, data).then(r => r.data),
  publish: (id: string) => api.post(`/articles/${id}/publish`),
  unpublish: (id: string) => api.post(`/articles/${id}/unpublish`),
  delete: (id: string) => api.delete(`/articles/${id}`),
}

// ── CATEGORIES ────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories').then(r => r.data),
  create: (data: object) => api.post<Category>('/categories', data).then(r => r.data),
  update: (id: string, data: object) => api.put<Category>(`/categories/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/categories/${id}`),
}

// ── MATERIALS ─────────────────────────────────────────────────────
export const materialsApi = {
  getAll: (params?: object) => api.get<PagedResult<Material>>('/materials', { params }).then(r => r.data),
  getById: (id: string) => api.get<Material>(`/materials/${id}`).then(r => r.data),
  getChunks: (id: string) =>
    api.get<MaterialChunk[]>(`/materials/${id}/chunks`).then(r => r.data),
  upload: (file: File, title?: string, categoryId?: string) => {
    const fd = new FormData()
    fd.append('file', file)
    if (title) fd.append('title', title)
    if (categoryId) fd.append('categoryId', categoryId)
    return api.post<Material>('/materials/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000,
    }).then(r => r.data)
  },
  delete: (id: string) => api.delete(`/materials/${id}`),
}

// ── NARRATION (audio read-along) ──────────────────────────────────
export const narrationApi = {
  // Current narration of a kind (Verbatim = recite, Explained = animated explainer).
  get: (materialId: string, kind: NarrationKind = 'Verbatim') =>
    api.get<Narration | null>(`/materials/${materialId}/narration`, { params: { kind } }).then(r => r.data),
  // Kicks off (or restarts) background synthesis; returns the Processing record.
  generate: (materialId: string, voice?: string, kind: NarrationKind = 'Verbatim') =>
    api.post<Narration>(`/materials/${materialId}/narration`, { voice, kind }).then(r => r.data),
  voices: () => api.get<NarrationVoice[]>('/narration/voices').then(r => r.data),
}

// ── ACADEMIC STRUCTURE (A1) ───────────────────────────────────────
// schoolId is optional: SchoolAdmins are scoped by their JWT; a SuperAdmin passes one.
export const academicsApi = {
  years: (schoolId?: string) => api.get<AcademicYear[]>('/academics/years', { params: { schoolId } }).then(r => r.data),
  saveYear: (data: object, id?: string) =>
    (id ? api.put<AcademicYear>(`/academics/years/${id}`, data) : api.post<AcademicYear>('/academics/years', data)).then(r => r.data),
  deleteYear: (id: string, schoolId?: string) => api.delete(`/academics/years/${id}`, { params: { schoolId } }),
  saveTerm: (yearId: string, data: object, schoolId?: string) =>
    api.post<Term>(`/academics/years/${yearId}/terms`, data, { params: { schoolId } }).then(r => r.data),
  deleteTerm: (id: string, schoolId?: string) => api.delete(`/academics/terms/${id}`, { params: { schoolId } }),

  classes: (schoolId?: string) => api.get<SchoolClass[]>('/academics/classes', { params: { schoolId } }).then(r => r.data),
  saveClass: (data: object, id?: string) =>
    (id ? api.put<SchoolClass>(`/academics/classes/${id}`, data) : api.post<SchoolClass>('/academics/classes', data)).then(r => r.data),
  deleteClass: (id: string, schoolId?: string) => api.delete(`/academics/classes/${id}`, { params: { schoolId } }),

  sections: (schoolId?: string, classId?: string) =>
    api.get<Section[]>('/academics/sections', { params: { schoolId, classId } }).then(r => r.data),
  saveSection: (data: object, id?: string, schoolId?: string) =>
    (id ? api.put<Section>(`/academics/sections/${id}`, data, { params: { schoolId } })
        : api.post<Section>('/academics/sections', data, { params: { schoolId } })).then(r => r.data),
  deleteSection: (id: string, schoolId?: string) => api.delete(`/academics/sections/${id}`, { params: { schoolId } }),

  subjects: (schoolId?: string) => api.get<Subject[]>('/academics/subjects', { params: { schoolId } }).then(r => r.data),
  saveSubject: (data: object, id?: string) =>
    (id ? api.put<Subject>(`/academics/subjects/${id}`, data) : api.post<Subject>('/academics/subjects', data)).then(r => r.data),
  deleteSubject: (id: string, schoolId?: string) => api.delete(`/academics/subjects/${id}`, { params: { schoolId } }),

  houses: (schoolId?: string) => api.get<House[]>('/academics/houses', { params: { schoolId } }).then(r => r.data),
  saveHouse: (data: object, id?: string) =>
    (id ? api.put<House>(`/academics/houses/${id}`, data) : api.post<House>('/academics/houses', data)).then(r => r.data),
  deleteHouse: (id: string, schoolId?: string) => api.delete(`/academics/houses/${id}`, { params: { schoolId } }),
}

// ── TUTOR ─────────────────────────────────────────────────────────
export const tutorApi = {
  getSessions: () => api.get<ChatSession[]>('/tutor/sessions').then(r => r.data),
  getMessages: (sessionId: string) =>
    api.get<ChatMessage[]>(`/tutor/sessions/${sessionId}/messages`).then(r => r.data),
  ask: (data: { sessionId?: string; materialId?: string; question: string }) =>
    api.post<AskTutorResponse>('/tutor/ask', data, { timeout: 120000 }).then(r => r.data),
  // Streams the answer token-by-token over SSE. Invokes onEvent for each frame
  // (meta → tokens → done, or error). Returns when the stream ends.
  askStream: async (
    data: { sessionId?: string; materialId?: string; question: string },
    onEvent: (ev: TutorStreamEvent) => void,
    signal?: AbortSignal,
  ) => {
    const token = useAuthStore.getState().token
    const res = await fetch('/api/tutor/ask/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(data),
      signal,
    })
    if (!res.ok || !res.body) throw new Error(`Tutor stream failed (${res.status})`)

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      // SSE frames are separated by a blank line; each carries a `data:` field.
      let sep
      while ((sep = buffer.indexOf('\n\n')) >= 0) {
        const frame = buffer.slice(0, sep)
        buffer = buffer.slice(sep + 2)
        const dataLine = frame.split('\n').find(l => l.startsWith('data:'))
        if (!dataLine) continue
        const json = dataLine.slice(5).trim()
        if (!json) continue
        try { onEvent(JSON.parse(json) as TutorStreamEvent) } catch { /* skip malformed frame */ }
      }
    }
  },
  deleteSession: (sessionId: string) => api.delete(`/tutor/sessions/${sessionId}`),
}

// ── FLASHCARDS ────────────────────────────────────────────────────
export const flashcardsApi = {
  getAll: (materialId?: string) =>
    api.get<FlashcardSetSummary[]>('/flashcards', { params: { materialId } }).then(r => r.data),
  getById: (id: string) => api.get<FlashcardSet>(`/flashcards/${id}`).then(r => r.data),
  generate: (data: { materialId: string; title?: string; count: number }) =>
    api.post<FlashcardSet>('/flashcards/generate', data, { timeout: 180000 }).then(r => r.data),
  delete: (id: string) => api.delete(`/flashcards/${id}`),
}

// ── QUIZZES ───────────────────────────────────────────────────────
export const quizzesApi = {
  getAll: (materialId?: string) =>
    api.get<QuizSummary[]>('/quizzes', { params: { materialId } }).then(r => r.data),
  getById: (id: string) => api.get<Quiz>(`/quizzes/${id}`).then(r => r.data),
  generate: (data: { materialId: string; title?: string; count: number; difficulty: QuizDifficulty }) =>
    api.post<QuizSummary>('/quizzes/generate', data, { timeout: 180000 }).then(r => r.data),
  submit: (id: string, answers: Record<string, number>) =>
    api.post<QuizAttemptResult>(`/quizzes/${id}/submit`, { answers }).then(r => r.data),
  delete: (id: string) => api.delete(`/quizzes/${id}`),
}

// ── LESSON PLANS ──────────────────────────────────────────────────
export const lessonPlansApi = {
  getAll: (materialId?: string) =>
    api.get<LessonPlanSummary[]>('/lesson-plans', { params: { materialId } }).then(r => r.data),
  getById: (id: string) => api.get<LessonPlan>(`/lesson-plans/${id}`).then(r => r.data),
  generate: (data: { materialId: string; title?: string; subject?: string; gradeLevel?: string; durationMinutes: number }) =>
    api.post<LessonPlan>('/lesson-plans/generate', data, { timeout: 180000 }).then(r => r.data),
  delete: (id: string) => api.delete(`/lesson-plans/${id}`),
}

// ── DELIVERIES (Delivered Today) ──────────────────────────────────
export const deliveriesApi = {
  // Teacher / admin: manage deliveries (optionally one day).
  getAll: (date?: string) =>
    api.get<Delivery[]>('/deliveries', { params: { date } }).then(r => r.data),
  // Student: what's delivered for a day (pass the browser's local date).
  getToday: (date: string) =>
    api.get<Delivery[]>('/deliveries/today', { params: { date } }).then(r => r.data),
  create: (data: CreateDeliveryRequest) =>
    api.post<Delivery>('/deliveries', data).then(r => r.data),
  delete: (id: string) => api.delete(`/deliveries/${id}`),
}

export default api
