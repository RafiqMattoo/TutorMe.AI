import axiosInstance from '../../../api/axiosInstance'
import type { PublicSchool, LoginResponse } from '../../../shared/types/index.ts'

// ── AUTH ──────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    axiosInstance.post<LoginResponse>('/auth/login', { email, password }).then(r => r.data),
  logout: () => axiosInstance.post('/auth/logout'),
  me: () => axiosInstance.get('/auth/me').then(r => r.data),
  // Public self-registration (no auth required).
  publicSchools: () => axiosInstance.get<PublicSchool[]>('/auth/schools').then(r => r.data),
  registerSchool: (data: object) =>
    axiosInstance.post<{ message: string }>('/auth/register/school', data).then(r => r.data),
  registerMember: (data: object) =>
    axiosInstance.post<{ message: string }>('/auth/register/member', data).then(r => r.data),
}

export const loginUser = authApi.login
export const logoutUser = authApi.logout
export const getCurrentUser = authApi.me
export const getPublicSchools = authApi.publicSchools
export const registerSchool = authApi.registerSchool
export const registerMember = authApi.registerMember
