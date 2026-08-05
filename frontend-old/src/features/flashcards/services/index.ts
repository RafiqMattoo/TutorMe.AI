import api from '@/api/client'
import type { FlashcardSetSummary, FlashcardSet } from '../../types'

// ── FLASHCARDS ────────────────────────────────────────────────────
export const flashcardsApi = {
  getAll: (materialId?: string) =>
    api.get<FlashcardSetSummary[]>('/flashcards', { params: { materialId } }).then(r => r.data),
  getById: (id: string) => api.get<FlashcardSet>(`/flashcards/${id}`).then(r => r.data),
  generate: (data: { materialId: string; title?: string; count: number }) =>
    api.post<FlashcardSet>('/flashcards/generate', data, { timeout: 180000 }).then(r => r.data),
  delete: (id: string) => api.delete(`/flashcards/${id}`),
}

export { materialsApi } from '@/features/materials/services'
