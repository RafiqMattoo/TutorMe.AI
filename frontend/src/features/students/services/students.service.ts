import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { PagedResult, StudentStatus, StudentListItem, Student, StudentOption } from '../../../shared/types/index.ts'

// ── STUDENTS (SIS) ────────────────────────────────────────────────

export const studentsApi = {
  getAll: (params?: { page?: number; pageSize?: number; search?: string; classId?: string; sectionId?: string; status?: StudentStatus; schoolId?: string }) =>
    axiosInstance.get<PagedResult<StudentListItem>>('/students', { params }).then(r => r.data),
  getById: (id: string, schoolId?: string) =>
    axiosInstance.get<Student>(`/students/${id}`, { params: { schoolId } }).then(r => r.data),
  nextAdmissionNumber: (schoolId?: string) =>
    axiosInstance.get<{ admissionNumber: string }>('/students/next-admission-number', { params: { schoolId } }).then(r => r.data.admissionNumber),
  options: (schoolId?: string, search?: string) =>
    axiosInstance.get<StudentOption[]>('/students/options', { params: { schoolId, search } }).then(r => r.data),
  create: (data: object) => axiosInstance.post<Student>('/students', data).then(r => r.data),
  update: (id: string, data: object) => axiosInstance.put<Student>(`/students/${id}`, data).then(r => r.data),
  delete: (id: string, schoolId?: string) => axiosInstance.delete(`/students/${id}`, { params: { schoolId } }),
}

export const getStudents = studentsApi.getAll
export const getStudentById = studentsApi.getById
export const getNextAdmissionNumber = studentsApi.nextAdmissionNumber
export const getStudentOptions = studentsApi.options
export const createStudent = studentsApi.create
export const updateStudent = studentsApi.update
export const deleteStudent = studentsApi.delete
