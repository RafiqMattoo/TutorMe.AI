import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createEnrollment,
  createRole,
  createUser,
  deleteEnrollment,
  deleteRole,
  deleteRolePermission,
  deleteUser,
  getEnrollments,
  getRolePermissions,
  getRoles,
  getUsers,
  toggleUserActive,
  updateRole,
  upsertRolePermission,
} from '../services'

export const useGetUsers = (params?: object) =>
  useQuery({ queryKey: ['users', params], queryFn: () => getUsers(params) })

export const useCreateUser = () => useMutation({ mutationFn: createUser })
export const useToggleUserActive = () => useMutation({ mutationFn: toggleUserActive })
export const useDeleteUser = () => useMutation({ mutationFn: deleteUser })

export const useGetRoles = () =>
  useQuery({ queryKey: ['roles'], queryFn: getRoles })

export const useGetRolePermissions = (roleDefinitionId?: string) =>
  useQuery({ queryKey: ['role-permissions', roleDefinitionId], queryFn: () => getRolePermissions(roleDefinitionId) })

export const useCreateRole = () => useMutation({ mutationFn: createRole })
export const useUpdateRole = () =>
  useMutation({ mutationFn: ({ id, data }: { id: string; data: object }) => updateRole(id, data) })
export const useDeleteRole = () => useMutation({ mutationFn: deleteRole })
export const useUpsertRolePermission = () => useMutation({ mutationFn: upsertRolePermission })
export const useDeleteRolePermission = () => useMutation({ mutationFn: deleteRolePermission })

export const useGetEnrollments = (params?: object) =>
  useQuery({ queryKey: ['enrollments', params], queryFn: () => getEnrollments(params) })

export const useCreateEnrollment = () => useMutation({ mutationFn: createEnrollment })
export const useDeleteEnrollment = () => useMutation({ mutationFn: deleteEnrollment })
