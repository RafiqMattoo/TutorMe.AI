import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { School, PagedResult } from '../../../shared/types/index.ts'

// ── SCHOOLS ───────────────────────────────────────────────────────

export const schoolsApi = {
  getAll: (params?: object) => axiosInstance.get<PagedResult<School>>('/schools', { params }).then(r => r.data),
  getById: (id: string) => axiosInstance.get<School>(`/schools/${id}`).then(r => r.data),
  create: (data: object) => axiosInstance.post<School>('/schools', data).then(r => r.data),
  update: (id: string, data: object) => axiosInstance.put<School>(`/schools/${id}`, data).then(r => r.data),
  delete: (id: string) => axiosInstance.delete(`/schools/${id}`),
}

export const getSchools = schoolsApi.getAll
export const getSchoolById = schoolsApi.getById
export const createSchool = schoolsApi.create
export const updateSchool = schoolsApi.update
export const deleteSchool = schoolsApi.delete
