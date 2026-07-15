import { useMutation, useQuery } from '@tanstack/react-query'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../services'

export const useGetCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

export const useCreateCategory = () => useMutation({ mutationFn: createCategory })
export const useUpdateCategory = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => updateCategory(id, data),
  })
export const useDeleteCategory = () => useMutation({ mutationFn: deleteCategory })
