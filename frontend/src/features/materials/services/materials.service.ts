import { axiosInstance } from '@/api/axiosInstance'
import type { PagedResult, Material, MaterialChunk } from '@/shared/types'

// ── MATERIALS ─────────────────────────────────────────────────────

export const materialsApi = {
  getAll: (params?: object) => axiosInstance.get<PagedResult<Material>>('/materials', { params }).then(r => r.data),
  getById: (id: string) => axiosInstance.get<Material>(`/materials/${id}`).then(r => r.data),
  getChunks: (id: string) =>
    axiosInstance.get<MaterialChunk[]>(`/materials/${id}/chunks`).then(r => r.data),
  upload: (file: File, title?: string, categoryId?: string) => {
    const fd = new FormData()
    fd.append('file', file)
    if (title) fd.append('title', title)
    if (categoryId) fd.append('categoryId', categoryId)
    return axiosInstance.post<Material>('/materials/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 600000,
    }).then(r => r.data)
  },
  delete: (id: string) => axiosInstance.delete(`/materials/${id}`),
}

export const getMaterials = materialsApi.getAll
export const getMaterialById = materialsApi.getById
export const getMaterialChunks = materialsApi.getChunks
export const uploadMaterial = materialsApi.upload
export const deleteMaterial = materialsApi.delete
