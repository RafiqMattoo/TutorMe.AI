import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { QuizDifficulty, QuizSummary, Quiz, QuizAttemptResult } from '../../../shared/types/index.ts'

// ── QUIZZES ───────────────────────────────────────────────────────

export const quizzesApi = {
  getAll: (materialId?: string) =>
    axiosInstance.get<QuizSummary[]>('/quizzes', { params: { materialId } }).then(r => r.data),
  getById: (id: string) => axiosInstance.get<Quiz>(`/quizzes/${id}`).then(r => r.data),
  generate: (data: { materialId: string; title?: string; count: number; difficulty: QuizDifficulty }) =>
    axiosInstance.post<QuizSummary>('/quizzes/generate', data, { timeout: 180000 }).then(r => r.data),
  submit: (id: string, answers: Record<string, number>) =>
    axiosInstance.post<QuizAttemptResult>(`/quizzes/${id}/submit`, { answers }).then(r => r.data),
  delete: (id: string) => axiosInstance.delete(`/quizzes/${id}`),
}

export const getQuizzes = quizzesApi.getAll
export const getQuizById = quizzesApi.getById
export const generateQuiz = quizzesApi.generate
export const submitQuiz = quizzesApi.submit
export const deleteQuiz = quizzesApi.delete
