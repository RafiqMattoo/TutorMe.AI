import api from '@/api/client'
import type { School, PagedResult } from '../../types'

// ── SCHOOLS ───────────────────────────────────────────────────────
export const schoolsApi = {
  getAll: (params?: object) => api.get<PagedResult<School>>('/schools', { params }).then(r => r.data),
  getById: (id: string) => api.get<School>(`/schools/${id}`).then(r => r.data),
  create: (data: object) => api.post<School>('/schools', data).then(r => r.data),
  update: (id: string, data: object) => api.put<School>(`/schools/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/schools/${id}`),
}
