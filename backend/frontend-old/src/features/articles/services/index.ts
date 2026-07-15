import api from '@/api/client'
import type { Article, ArticleListItem, PagedResult } from '../../types'

// ── ARTICLES ──────────────────────────────────────────────────────
export const articlesApi = {
  getAll: (params?: object) => api.get<PagedResult<ArticleListItem>>('/articles', { params }).then(r => r.data),
  getById: (id: string) => api.get<Article>(`/articles/${id}`).then(r => r.data),
  create: (data: object) => api.post<Article>('/articles', data).then(r => r.data),
  update: (id: string, data: object) => api.put<Article>(`/articles/${id}`, data).then(r => r.data),
  publish: (id: string) => api.post(`/articles/${id}/publish`),
  unpublish: (id: string) => api.post(`/articles/${id}/unpublish`),
  delete: (id: string) => api.delete(`/articles/${id}`),
}

export { categoriesApi } from '@/features/categories/services'
