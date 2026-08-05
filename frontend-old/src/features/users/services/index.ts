import api from '@/api/client'
import type { User, RolePermission, RoleDefinition, UserSchoolEnrollment, PagedResult } from '../../types'

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

export { schoolsApi } from '@/features/schools/services'
