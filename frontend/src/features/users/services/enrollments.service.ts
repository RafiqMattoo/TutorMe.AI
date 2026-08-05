import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { User, RolePermission, RoleDefinition, UserSchoolEnrollment, PagedResult } from '../../../shared/types/index.ts'

export const enrollmentsApi = {
  getAll: (params?: object) => axiosInstance.get<UserSchoolEnrollment[]>('/enrollments', { params }).then(r => r.data),
  create: (data: object) => axiosInstance.post<UserSchoolEnrollment>('/enrollments', data).then(r => r.data),
  delete: (id: string) => axiosInstance.delete(`/enrollments/${id}`),
}

export const getEnrollments = enrollmentsApi.getAll
export const createEnrollment = enrollmentsApi.create
export const deleteEnrollment = enrollmentsApi.delete
