import { axiosInstance } from '@/api/axiosInstance'
import type { User, RolePermission, RoleDefinition, UserSchoolEnrollment, PagedResult } from '@/shared/types'

export const rolesApi = {
  getRoles: () => axiosInstance.get<RoleDefinition[]>('/roles').then(r => r.data),
  createRole: (data: object) => axiosInstance.post<RoleDefinition>('/roles', data).then(r => r.data),
  updateRole: (id: string, data: object) => axiosInstance.put<RoleDefinition>(`/roles/${id}`, data).then(r => r.data),
  deleteRole: (id: string) => axiosInstance.delete(`/roles/${id}`),
  getPermissions: (roleDefinitionId?: string) => axiosInstance.get<RolePermission[]>('/roles/permissions', { params: { roleDefinitionId } }).then(r => r.data),
  upsertPermission: (data: Omit<RolePermission, 'id' | 'roleName' | 'roleDisplayName'>) => axiosInstance.post<RolePermission>('/roles/permissions', data).then(r => r.data),
  deletePermission: (id: string) => axiosInstance.delete(`/roles/permissions/${id}`),
}

export const getRoles = rolesApi.getRoles
export const createRole = rolesApi.createRole
export const updateRole = rolesApi.updateRole
export const deleteRole = rolesApi.deleteRole
export const getRolePermissions = rolesApi.getPermissions
export const upsertRolePermission = rolesApi.upsertPermission
export const deleteRolePermission = rolesApi.deletePermission
