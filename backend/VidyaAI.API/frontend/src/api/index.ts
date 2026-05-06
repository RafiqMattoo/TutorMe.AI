import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import type { Article, ArticleListItem, ArticleStatus, Category, DashboardStats, LoginResponse, PagedResult, RoleDefinition, RolePermission, School, User, UserSchoolEnrollment } from '../types'

const api = axios.create({ baseURL: '/api', timeout: 15000 })

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

export default api
