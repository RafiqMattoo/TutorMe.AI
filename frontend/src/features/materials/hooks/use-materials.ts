import { useMutation, useQuery } from '@tanstack/react-query'
import { deleteMaterial, getMaterialById, getMaterialChunks, getMaterials, uploadMaterial } from '../services'

export const useGetMaterials = (params?: object) =>
  useQuery({
    queryKey: ['materials', params],
    queryFn: () => getMaterials(params),
  })

export const useGetMaterialById = (id?: string) =>
  useQuery({
    queryKey: ['material', id],
    queryFn: () => getMaterialById(id!),
    enabled: !!id,
  })

export const useGetMaterialChunks = (id?: string) =>
  useQuery({
    queryKey: ['material-chunks', id],
    queryFn: () => getMaterialChunks(id!),
    enabled: !!id,
  })

export const useUploadMaterial = () =>
  useMutation({
    mutationFn: ({ file, title, categoryId }: { file: File; title?: string; categoryId?: string }) =>
      uploadMaterial(file, title, categoryId),
  })

export const useDeleteMaterial = () => useMutation({ mutationFn: deleteMaterial })
