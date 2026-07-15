import { axiosInstance } from '@/api/axiosInstance'
import type { User, RolePermission, RoleDefinition, UserSchoolEnrollment, PagedResult } from '@/shared/types'

export const enrollmentsApi = {
  getAll: (params?: object) => axiosInstance.get<UserSchoolEnrollment[]>('/enrollments', { params }).then(r => r.data),
  create: (data: object) => axiosInstance.post<UserSchoolEnrollment>('/enrollments', data).then(r => r.data),
  delete: (id: string) => axiosInstance.delete(`/enrollments/${id}`),
}

export const getEnrollments = enrollmentsApi.getAll
export const createEnrollment = enrollmentsApi.create
export const deleteEnrollment = enrollmentsApi.delete
