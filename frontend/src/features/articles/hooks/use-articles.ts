import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  publishArticle,
  unpublishArticle,
  updateArticle,
} from '../services'

export const useGetArticles = (params?: object) =>
  useQuery({
    queryKey: ['articles', params],
    queryFn: () => getArticles(params),
  })

export const useGetArticleById = (id?: string, enabled = true) =>
  useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id!),
    enabled: enabled && !!id,
  })

export const useCreateArticle = () => useMutation({ mutationFn: createArticle })
export const useUpdateArticle = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => updateArticle(id, data),
  })
export const usePublishArticle = () => useMutation({ mutationFn: publishArticle })
export const useUnpublishArticle = () => useMutation({ mutationFn: unpublishArticle })
export const useDeleteArticle = () => useMutation({ mutationFn: deleteArticle })
