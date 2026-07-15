import { axiosInstance } from '@/api/axiosInstance'
import type { LessonPlanSummary, LessonPlan } from '@/shared/types'

// ── LESSON PLANS ──────────────────────────────────────────────────

export const lessonPlansApi = {
  getAll: (materialId?: string) =>
    axiosInstance.get<LessonPlanSummary[]>('/lesson-plans', { params: { materialId } }).then(r => r.data),
  getById: (id: string) => axiosInstance.get<LessonPlan>(`/lesson-plans/${id}`).then(r => r.data),
  generate: (data: { materialId: string; title?: string; subject?: string; gradeLevel?: string; durationMinutes: number }) =>
    axiosInstance.post<LessonPlan>('/lesson-plans/generate', data, { timeout: 180000 }).then(r => r.data),
  delete: (id: string) => axiosInstance.delete(`/lesson-plans/${id}`),
}

export const getLessonPlans = lessonPlansApi.getAll
export const getLessonPlanById = lessonPlansApi.getById
export const generateLessonPlan = lessonPlansApi.generate
export const deleteLessonPlan = lessonPlansApi.delete
