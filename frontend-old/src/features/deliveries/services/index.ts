import api from '@/api/client'
import type { Student, Delivery, CreateDeliveryRequest } from '../../types'

// ── DELIVERIES (Delivered Today) ──────────────────────────────────
export const deliveriesApi = {
  // Teacher / admin: manage deliveries (optionally one day).
  getAll: (date?: string) =>
    api.get<Delivery[]>('/deliveries', { params: { date } }).then(r => r.data),
  // Student: what's delivered for a day (pass the browser's local date).
  getToday: (date: string) =>
    api.get<Delivery[]>('/deliveries/today', { params: { date } }).then(r => r.data),
  create: (data: CreateDeliveryRequest) =>
    api.post<Delivery>('/deliveries', data).then(r => r.data),
  delete: (id: string) => api.delete(`/deliveries/${id}`),
}

export { flashcardsApi } from '@/features/flashcards/services'
export { materialsApi } from '@/features/materials/services'
export { quizzesApi } from '@/features/quizzes/services'
