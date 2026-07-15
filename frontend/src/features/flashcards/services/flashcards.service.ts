import { axiosInstance } from '@/api/axiosInstance'
import type { FlashcardSetSummary, FlashcardSet } from '@/shared/types'

// ── FLASHCARDS ────────────────────────────────────────────────────

export const flashcardsApi = {
  getAll: (materialId?: string) =>
    axiosInstance.get<FlashcardSetSummary[]>('/flashcards', { params: { materialId } }).then(r => r.data),
  getById: (id: string) => axiosInstance.get<FlashcardSet>(`/flashcards/${id}`).then(r => r.data),
  generate: (data: { materialId: string; title?: string; count: number }) =>
    axiosInstance.post<FlashcardSet>('/flashcards/generate', data, { timeout: 180000 }).then(r => r.data),
  delete: (id: string) => axiosInstance.delete(`/flashcards/${id}`),
}

export const getFlashcardSets = flashcardsApi.getAll
export const getFlashcardSetById = flashcardsApi.getById
export const generateFlashcards = flashcardsApi.generate
export const deleteFlashcardSet = flashcardsApi.delete
