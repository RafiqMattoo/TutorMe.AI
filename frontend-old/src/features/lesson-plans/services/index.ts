import api from '@/api/client'
import type { LessonPlanSummary, LessonPlan } from '../../types'

// ── LESSON PLANS ──────────────────────────────────────────────────
export const lessonPlansApi = {
  getAll: (materialId?: string) =>
    api.get<LessonPlanSummary[]>('/lesson-plans', { params: { materialId } }).then(r => r.data),
  getById: (id: string) => api.get<LessonPlan>(`/lesson-plans/${id}`).then(r => r.data),
  generate: (data: { materialId: string; title?: string; subject?: string; gradeLevel?: string; durationMinutes: number }) =>
    api.post<LessonPlan>('/lesson-plans/generate', data, { timeout: 180000 }).then(r => r.data),
  delete: (id: string) => api.delete(`/lesson-plans/${id}`),
}

export { materialsApi } from '@/features/materials/services'
