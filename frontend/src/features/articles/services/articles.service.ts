import { axiosInstance } from '@/api/axiosInstance'
import type { Article, ArticleListItem, PagedResult } from '@/shared/types'

// ── ARTICLES ──────────────────────────────────────────────────────

export const articlesApi = {
  getAll: (params?: object) => axiosInstance.get<PagedResult<ArticleListItem>>('/articles', { params }).then(r => r.data),
  getById: (id: string) => axiosInstance.get<Article>(`/articles/${id}`).then(r => r.data),
  create: (data: object) => axiosInstance.post<Article>('/articles', data).then(r => r.data),
  update: (id: string, data: object) => axiosInstance.put<Article>(`/articles/${id}`, data).then(r => r.data),
  publish: (id: string) => axiosInstance.post(`/articles/${id}/publish`),
  unpublish: (id: string) => axiosInstance.post(`/articles/${id}/unpublish`),
  delete: (id: string) => axiosInstance.delete(`/articles/${id}`),
}

export const getArticles = articlesApi.getAll
export const getArticleById = articlesApi.getById
export const createArticle = articlesApi.create
export const updateArticle = articlesApi.update
export const publishArticle = articlesApi.publish
export const unpublishArticle = articlesApi.unpublish
export const deleteArticle = articlesApi.delete
