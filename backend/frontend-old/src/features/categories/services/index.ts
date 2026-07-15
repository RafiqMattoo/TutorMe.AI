import api from '@/api/client'
import type { Category } from '../../types'

// ── CATEGORIES ────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories').then(r => r.data),
  create: (data: object) => api.post<Category>('/categories', data).then(r => r.data),
  update: (id: string, data: object) => api.put<Category>(`/categories/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/categories/${id}`),
}
