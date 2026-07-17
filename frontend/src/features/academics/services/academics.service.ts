import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { Term, AcademicYear, SchoolClass, Section, Subject, House, Stream, TeacherOption, SubjectAllocation, GradingScale } from '../../../shared/types/index.ts'

// ── ACADEMIC STRUCTURE (A1) ───────────────────────────────────────
// schoolId is optional: SchoolAdmins are scoped by their JWT; a SuperAdmin passes one.

export const academicsApi = {
  years: (schoolId?: string) => axiosInstance.get<AcademicYear[]>('/academics/years', { params: { schoolId } }).then(r => r.data),
  saveYear: (data: object, id?: string) =>
    (id ? axiosInstance.put<AcademicYear>(`/academics/years/${id}`, data) : axiosInstance.post<AcademicYear>('/academics/years', data)).then(r => r.data),
  deleteYear: (id: string, schoolId?: string) => axiosInstance.delete(`/academics/years/${id}`, { params: { schoolId } }),
  saveTerm: (yearId: string, data: object, schoolId?: string) =>
    axiosInstance.post<Term>(`/academics/years/${yearId}/terms`, data, { params: { schoolId } }).then(r => r.data),
  deleteTerm: (id: string, schoolId?: string) => axiosInstance.delete(`/academics/terms/${id}`, { params: { schoolId } }),

  classes: (schoolId?: string) => axiosInstance.get<SchoolClass[]>('/academics/classes', { params: { schoolId } }).then(r => r.data),
  saveClass: (data: object, id?: string) =>
    (id ? axiosInstance.put<SchoolClass>(`/academics/classes/${id}`, data) : axiosInstance.post<SchoolClass>('/academics/classes', data)).then(r => r.data),
  deleteClass: (id: string, schoolId?: string) => axiosInstance.delete(`/academics/classes/${id}`, { params: { schoolId } }),

  sections: (schoolId?: string, classId?: string) =>
    axiosInstance.get<Section[]>('/academics/sections', { params: { schoolId, classId } }).then(r => r.data),
  saveSection: (data: object, id?: string, schoolId?: string) =>
    (id ? axiosInstance.put<Section>(`/academics/sections/${id}`, data, { params: { schoolId } })
        : axiosInstance.post<Section>('/academics/sections', data, { params: { schoolId } })).then(r => r.data),
  deleteSection: (id: string, schoolId?: string) => axiosInstance.delete(`/academics/sections/${id}`, { params: { schoolId } }),

  subjects: (schoolId?: string) => axiosInstance.get<Subject[]>('/academics/subjects', { params: { schoolId } }).then(r => r.data),
  saveSubject: (data: object, id?: string) =>
    (id ? axiosInstance.put<Subject>(`/academics/subjects/${id}`, data) : axiosInstance.post<Subject>('/academics/subjects', data)).then(r => r.data),
  deleteSubject: (id: string, schoolId?: string) => axiosInstance.delete(`/academics/subjects/${id}`, { params: { schoolId } }),

  houses: (schoolId?: string) => axiosInstance.get<House[]>('/academics/houses', { params: { schoolId } }).then(r => r.data),
  saveHouse: (data: object, id?: string) =>
    (id ? axiosInstance.put<House>(`/academics/houses/${id}`, data) : axiosInstance.post<House>('/academics/houses', data)).then(r => r.data),
  deleteHouse: (id: string, schoolId?: string) => axiosInstance.delete(`/academics/houses/${id}`, { params: { schoolId } }),

  teachers: (schoolId?: string) => axiosInstance.get<TeacherOption[]>('/academics/teachers', { params: { schoolId } }).then(r => r.data),

  streams: (schoolId?: string) => axiosInstance.get<Stream[]>('/academics/streams', { params: { schoolId } }).then(r => r.data),
  saveStream: (data: object, id?: string) =>
    (id ? axiosInstance.put<Stream>(`/academics/streams/${id}`, data) : axiosInstance.post<Stream>('/academics/streams', data)).then(r => r.data),
  deleteStream: (id: string, schoolId?: string) => axiosInstance.delete(`/academics/streams/${id}`, { params: { schoolId } }),

  allocations: (schoolId?: string, classId?: string) =>
    axiosInstance.get<SubjectAllocation[]>('/academics/allocations', { params: { schoolId, classId } }).then(r => r.data),
  saveAllocation: (data: object, id?: string) =>
    (id ? axiosInstance.put<SubjectAllocation>(`/academics/allocations/${id}`, data) : axiosInstance.post<SubjectAllocation>('/academics/allocations', data)).then(r => r.data),
  deleteAllocation: (id: string, schoolId?: string) => axiosInstance.delete(`/academics/allocations/${id}`, { params: { schoolId } }),

  gradingScales: (schoolId?: string) => axiosInstance.get<GradingScale[]>('/academics/grading-scales', { params: { schoolId } }).then(r => r.data),
  saveGradingScale: (data: object, id?: string) =>
    (id ? axiosInstance.put<GradingScale>(`/academics/grading-scales/${id}`, data) : axiosInstance.post<GradingScale>('/academics/grading-scales', data)).then(r => r.data),
  deleteGradingScale: (id: string, schoolId?: string) => axiosInstance.delete(`/academics/grading-scales/${id}`, { params: { schoolId } }),
  saveGradeBand: (scaleId: string, data: object, schoolId?: string) =>
    axiosInstance.post(`/academics/grading-scales/${scaleId}/bands`, data, { params: { schoolId } }).then(r => r.data),
  deleteGradeBand: (id: string, schoolId?: string) => axiosInstance.delete(`/academics/bands/${id}`, { params: { schoolId } }),
}

export const getAcademicYears = academicsApi.years
export const saveAcademicYear = academicsApi.saveYear
export const deleteAcademicYear = academicsApi.deleteYear
export const saveAcademicTerm = academicsApi.saveTerm
export const deleteAcademicTerm = academicsApi.deleteTerm
export const getSchoolClasses = academicsApi.classes
export const saveSchoolClass = academicsApi.saveClass
export const deleteSchoolClass = academicsApi.deleteClass
export const getSections = academicsApi.sections
export const saveSection = academicsApi.saveSection
export const deleteSection = academicsApi.deleteSection
export const getSubjects = academicsApi.subjects
export const saveSubject = academicsApi.saveSubject
export const deleteSubject = academicsApi.deleteSubject
export const getHouses = academicsApi.houses
export const saveHouse = academicsApi.saveHouse
export const deleteHouse = academicsApi.deleteHouse
export const getTeachers = academicsApi.teachers
export const getStreams = academicsApi.streams
export const saveStream = academicsApi.saveStream
export const deleteStream = academicsApi.deleteStream
export const getSubjectAllocations = academicsApi.allocations
export const saveSubjectAllocation = academicsApi.saveAllocation
export const deleteSubjectAllocation = academicsApi.deleteAllocation
export const getGradingScales = academicsApi.gradingScales
export const saveGradingScale = academicsApi.saveGradingScale
export const deleteGradingScale = academicsApi.deleteGradingScale
export const saveGradeBand = academicsApi.saveGradeBand
export const deleteGradeBand = academicsApi.deleteGradeBand
