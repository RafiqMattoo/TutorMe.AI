import api from '@/api/client'
import type { PagedResult, Material, MaterialChunk } from '../../types'

// ── MATERIALS ─────────────────────────────────────────────────────
export const materialsApi = {
  getAll: (params?: object) => api.get<PagedResult<Material>>('/materials', { params }).then(r => r.data),
  getById: (id: string) => api.get<Material>(`/materials/${id}`).then(r => r.data),
  getChunks: (id: string) =>
    api.get<MaterialChunk[]>(`/materials/${id}/chunks`).then(r => r.data),
  upload: (file: File, title?: string, categoryId?: string) => {
    const fd = new FormData()
    fd.append('file', file)
    if (title) fd.append('title', title)
    if (categoryId) fd.append('categoryId', categoryId)
    return api.post<Material>('/materials/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 600000,
    }).then(r => r.data)
  },
  delete: (id: string) => api.delete(`/materials/${id}`),
}
