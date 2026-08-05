import api from '@/api/client'
import type { PublicSchool, LoginResponse } from '../../types'

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
