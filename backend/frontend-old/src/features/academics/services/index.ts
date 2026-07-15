import api from '@/api/client'
import type { Term, AcademicYear, SchoolClass, Section, Subject, House, Stream, TeacherOption, SubjectAllocation, GradingScale } from '../../types'

// ── ACADEMIC STRUCTURE (A1) ───────────────────────────────────────
// schoolId is optional: SchoolAdmins are scoped by their JWT; a SuperAdmin passes one.
export const academicsApi = {
  years: (schoolId?: string) => api.get<AcademicYear[]>('/academics/years', { params: { schoolId } }).then(r => r.data),
  saveYear: (data: object, id?: string) =>
    (id ? api.put<AcademicYear>(`/academics/years/${id}`, data) : api.post<AcademicYear>('/academics/years', data)).then(r => r.data),
  deleteYear: (id: string, schoolId?: string) => api.delete(`/academics/years/${id}`, { params: { schoolId } }),
  saveTerm: (yearId: string, data: object, schoolId?: string) =>
    api.post<Term>(`/academics/years/${yearId}/terms`, data, { params: { schoolId } }).then(r => r.data),
  deleteTerm: (id: string, schoolId?: string) => api.delete(`/academics/terms/${id}`, { params: { schoolId } }),

  classes: (schoolId?: string) => api.get<SchoolClass[]>('/academics/classes', { params: { schoolId } }).then(r => r.data),
  saveClass: (data: object, id?: string) =>
    (id ? api.put<SchoolClass>(`/academics/classes/${id}`, data) : api.post<SchoolClass>('/academics/classes', data)).then(r => r.data),
  deleteClass: (id: string, schoolId?: string) => api.delete(`/academics/classes/${id}`, { params: { schoolId } }),

  sections: (schoolId?: string, classId?: string) =>
    api.get<Section[]>('/academics/sections', { params: { schoolId, classId } }).then(r => r.data),
  saveSection: (data: object, id?: string, schoolId?: string) =>
    (id ? api.put<Section>(`/academics/sections/${id}`, data, { params: { schoolId } })
        : api.post<Section>('/academics/sections', data, { params: { schoolId } })).then(r => r.data),
  deleteSection: (id: string, schoolId?: string) => api.delete(`/academics/sections/${id}`, { params: { schoolId } }),

  subjects: (schoolId?: string) => api.get<Subject[]>('/academics/subjects', { params: { schoolId } }).then(r => r.data),
  saveSubject: (data: object, id?: string) =>
    (id ? api.put<Subject>(`/academics/subjects/${id}`, data) : api.post<Subject>('/academics/subjects', data)).then(r => r.data),
  deleteSubject: (id: string, schoolId?: string) => api.delete(`/academics/subjects/${id}`, { params: { schoolId } }),

  houses: (schoolId?: string) => api.get<House[]>('/academics/houses', { params: { schoolId } }).then(r => r.data),
  saveHouse: (data: object, id?: string) =>
    (id ? api.put<House>(`/academics/houses/${id}`, data) : api.post<House>('/academics/houses', data)).then(r => r.data),
  deleteHouse: (id: string, schoolId?: string) => api.delete(`/academics/houses/${id}`, { params: { schoolId } }),

  teachers: (schoolId?: string) => api.get<TeacherOption[]>('/academics/teachers', { params: { schoolId } }).then(r => r.data),

  streams: (schoolId?: string) => api.get<Stream[]>('/academics/streams', { params: { schoolId } }).then(r => r.data),
  saveStream: (data: object, id?: string) =>
    (id ? api.put<Stream>(`/academics/streams/${id}`, data) : api.post<Stream>('/academics/streams', data)).then(r => r.data),
  deleteStream: (id: string, schoolId?: string) => api.delete(`/academics/streams/${id}`, { params: { schoolId } }),

  allocations: (schoolId?: string, classId?: string) =>
    api.get<SubjectAllocation[]>('/academics/allocations', { params: { schoolId, classId } }).then(r => r.data),
  saveAllocation: (data: object, id?: string) =>
    (id ? api.put<SubjectAllocation>(`/academics/allocations/${id}`, data) : api.post<SubjectAllocation>('/academics/allocations', data)).then(r => r.data),
  deleteAllocation: (id: string, schoolId?: string) => api.delete(`/academics/allocations/${id}`, { params: { schoolId } }),

  gradingScales: (schoolId?: string) => api.get<GradingScale[]>('/academics/grading-scales', { params: { schoolId } }).then(r => r.data),
  saveGradingScale: (data: object, id?: string) =>
    (id ? api.put<GradingScale>(`/academics/grading-scales/${id}`, data) : api.post<GradingScale>('/academics/grading-scales', data)).then(r => r.data),
  deleteGradingScale: (id: string, schoolId?: string) => api.delete(`/academics/grading-scales/${id}`, { params: { schoolId } }),
  saveGradeBand: (scaleId: string, data: object, schoolId?: string) =>
    api.post(`/academics/grading-scales/${scaleId}/bands`, data, { params: { schoolId } }).then(r => r.data),
  deleteGradeBand: (id: string, schoolId?: string) => api.delete(`/academics/bands/${id}`, { params: { schoolId } }),
}
