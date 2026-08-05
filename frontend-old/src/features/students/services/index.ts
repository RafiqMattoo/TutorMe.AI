import api from '@/api/client'
import type { PagedResult, StudentStatus, StudentListItem, Student, StudentOption } from '../../types'

// ── STUDENTS (SIS) ────────────────────────────────────────────────
export const studentsApi = {
  getAll: (params?: { page?: number; pageSize?: number; search?: string; classId?: string; sectionId?: string; status?: StudentStatus; schoolId?: string }) =>
    api.get<PagedResult<StudentListItem>>('/students', { params }).then(r => r.data),
  getById: (id: string, schoolId?: string) =>
    api.get<Student>(`/students/${id}`, { params: { schoolId } }).then(r => r.data),
  nextAdmissionNumber: (schoolId?: string) =>
    api.get<{ admissionNumber: string }>('/students/next-admission-number', { params: { schoolId } }).then(r => r.data.admissionNumber),
  options: (schoolId?: string, search?: string) =>
    api.get<StudentOption[]>('/students/options', { params: { schoolId, search } }).then(r => r.data),
  create: (data: object) => api.post<Student>('/students', data).then(r => r.data),
  update: (id: string, data: object) => api.put<Student>(`/students/${id}`, data).then(r => r.data),
  delete: (id: string, schoolId?: string) => api.delete(`/students/${id}`, { params: { schoolId } }),
}

export { academicsApi } from '@/features/academics/services'
