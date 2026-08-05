import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { Category } from '../../../shared/types/index.ts'

// ── CATEGORIES ────────────────────────────────────────────────────

export const categoriesApi = {
  getAll: () => axiosInstance.get<Category[]>('/categories').then(r => r.data),
  create: (data: object) => axiosInstance.post<Category>('/categories', data).then(r => r.data),
  update: (id: string, data: object) => axiosInstance.put<Category>(`/categories/${id}`, data).then(r => r.data),
  delete: (id: string) => axiosInstance.delete(`/categories/${id}`),
}

export const getCategories = categoriesApi.getAll
export const createCategory = categoriesApi.create
export const updateCategory = categoriesApi.update
export const deleteCategory = categoriesApi.delete
