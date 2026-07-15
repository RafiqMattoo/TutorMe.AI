import api from '@/api/client'
import type { QuizDifficulty, QuizSummary, Quiz, QuizAttemptResult } from '../../types'

// ── QUIZZES ───────────────────────────────────────────────────────
export const quizzesApi = {
  getAll: (materialId?: string) =>
    api.get<QuizSummary[]>('/quizzes', { params: { materialId } }).then(r => r.data),
  getById: (id: string) => api.get<Quiz>(`/quizzes/${id}`).then(r => r.data),
  generate: (data: { materialId: string; title?: string; count: number; difficulty: QuizDifficulty }) =>
    api.post<QuizSummary>('/quizzes/generate', data, { timeout: 180000 }).then(r => r.data),
  submit: (id: string, answers: Record<string, number>) =>
    api.post<QuizAttemptResult>(`/quizzes/${id}/submit`, { answers }).then(r => r.data),
  delete: (id: string) => api.delete(`/quizzes/${id}`),
}

export { materialsApi } from '@/features/materials/services'
