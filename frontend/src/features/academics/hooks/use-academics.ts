import { useMutation, useQuery } from '@tanstack/react-query'
import {
  deleteAcademicYear,
  deleteGradeBand,
  deleteGradingScale,
  deleteHouse,
  deleteSchoolClass,
  deleteSection,
  deleteStream,
  deleteSubject,
  deleteSubjectAllocation,
  getAcademicYears,
  getGradingScales,
  getHouses,
  getSchoolClasses,
  getSections,
  getStreams,
  getSubjectAllocations,
  getSubjects,
  getTeachers,
  saveAcademicYear,
  saveGradeBand,
  saveGradingScale,
  saveHouse,
  saveSchoolClass,
  saveSection,
  saveStream,
  saveSubject,
  saveSubjectAllocation,
} from '../services'

export const useGetAcademicYears = (schoolId?: string) =>
  useQuery({ queryKey: ['years', schoolId], queryFn: () => getAcademicYears(schoolId) })

export const useGetSchoolClasses = (schoolId?: string) =>
  useQuery({ queryKey: ['classes', schoolId], queryFn: () => getSchoolClasses(schoolId) })

export const useGetSections = (schoolId?: string, classId?: string) =>
  useQuery({ queryKey: ['sections', schoolId, classId], queryFn: () => getSections(schoolId, classId) })

export const useGetSubjects = (schoolId?: string) =>
  useQuery({ queryKey: ['subjects', schoolId], queryFn: () => getSubjects(schoolId) })

export const useGetHouses = (schoolId?: string) =>
  useQuery({ queryKey: ['houses', schoolId], queryFn: () => getHouses(schoolId) })

export const useGetTeachers = (schoolId?: string) =>
  useQuery({ queryKey: ['teachers', schoolId], queryFn: () => getTeachers(schoolId) })

export const useGetStreams = (schoolId?: string) =>
  useQuery({ queryKey: ['streams', schoolId], queryFn: () => getStreams(schoolId) })

export const useGetSubjectAllocations = (schoolId?: string, classId?: string) =>
  useQuery({ queryKey: ['allocations', schoolId, classId], queryFn: () => getSubjectAllocations(schoolId, classId) })

export const useGetGradingScales = (schoolId?: string) =>
  useQuery({ queryKey: ['grading', schoolId], queryFn: () => getGradingScales(schoolId) })

export const useSaveAcademicYear = () =>
  useMutation({ mutationFn: ({ data, id }: { data: object; id?: string }) => saveAcademicYear(data, id) })
export const useDeleteAcademicYear = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteAcademicYear(id, schoolId) })
export const useSaveSchoolClass = () =>
  useMutation({ mutationFn: ({ data, id }: { data: object; id?: string }) => saveSchoolClass(data, id) })
export const useDeleteSchoolClass = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteSchoolClass(id, schoolId) })
export const useSaveSection = () =>
  useMutation({ mutationFn: ({ data, id, schoolId }: { data: object; id?: string; schoolId?: string }) => saveSection(data, id, schoolId) })
export const useDeleteSection = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteSection(id, schoolId) })
export const useSaveSubject = () =>
  useMutation({ mutationFn: ({ data, id }: { data: object; id?: string }) => saveSubject(data, id) })
export const useDeleteSubject = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteSubject(id, schoolId) })
export const useSaveHouse = () =>
  useMutation({ mutationFn: ({ data, id }: { data: object; id?: string }) => saveHouse(data, id) })
export const useDeleteHouse = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteHouse(id, schoolId) })
export const useSaveStream = () =>
  useMutation({ mutationFn: ({ data, id }: { data: object; id?: string }) => saveStream(data, id) })
export const useDeleteStream = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteStream(id, schoolId) })
export const useSaveSubjectAllocation = () =>
  useMutation({ mutationFn: ({ data, id }: { data: object; id?: string }) => saveSubjectAllocation(data, id) })
export const useDeleteSubjectAllocation = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteSubjectAllocation(id, schoolId) })
export const useSaveGradingScale = () =>
  useMutation({ mutationFn: ({ data, id }: { data: object; id?: string }) => saveGradingScale(data, id) })
export const useDeleteGradingScale = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteGradingScale(id, schoolId) })
export const useSaveGradeBand = () =>
  useMutation({ mutationFn: ({ scaleId, data, schoolId }: { scaleId: string; data: object; schoolId?: string }) => saveGradeBand(scaleId, data, schoolId) })
export const useDeleteGradeBand = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteGradeBand(id, schoolId) })
