import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createStudent,
  deleteStudent,
  getNextAdmissionNumber,
  getStudentById,
  getStudentOptions,
  getStudents,
  updateStudent,
} from '../services'
import type { StudentStatus } from '../../../shared/types/index.ts'

type StudentListParams = {
  page?: number
  pageSize?: number
  search?: string
  classId?: string
  sectionId?: string
  status?: StudentStatus
  schoolId?: string
}

export const useGetStudents = (params?: StudentListParams) =>
  useQuery({ queryKey: ['students', params], queryFn: () => getStudents(params) })

export const useGetStudentById = (id?: string, schoolId?: string) =>
  useQuery({ queryKey: ['student', id, schoolId], queryFn: () => getStudentById(id!, schoolId), enabled: !!id })

export const useGetNextAdmissionNumber = (schoolId?: string) =>
  useQuery({ queryKey: ['next-admission-number', schoolId], queryFn: () => getNextAdmissionNumber(schoolId) })

export const useGetStudentOptions = (schoolId?: string, search?: string) =>
  useQuery({ queryKey: ['student-options', schoolId, search], queryFn: () => getStudentOptions(schoolId, search) })

export const useCreateStudent = () => useMutation({ mutationFn: createStudent })
export const useUpdateStudent = () =>
  useMutation({ mutationFn: ({ id, data }: { id: string; data: object }) => updateStudent(id, data) })
export const useDeleteStudent = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteStudent(id, schoolId) })
