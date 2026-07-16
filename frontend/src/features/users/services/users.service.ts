import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { User, RolePermission, RoleDefinition, UserSchoolEnrollment, PagedResult } from '../../../shared/types/index.ts'

// ── USERS ─────────────────────────────────────────────────────────

export const usersApi = {
  getAll: (params?: object) => axiosInstance.get<PagedResult<User>>('/users', { params }).then(r => r.data),
  create: (data: object) => axiosInstance.post<User>('/users', data).then(r => r.data),
  toggleActive: (id: string) => axiosInstance.patch(`/users/${id}/toggle-active`),
  delete: (id: string) => axiosInstance.delete(`/users/${id}`),
}

export const getUsers = usersApi.getAll
export const createUser = usersApi.create
export const toggleUserActive = usersApi.toggleActive
export const deleteUser = usersApi.delete
