import { useMutation, useQuery } from '@tanstack/react-query'
import { createSchool, deleteSchool, getSchoolById, getSchools, updateSchool } from '../services'

export const useGetSchools = (params?: object) =>
  useQuery({ queryKey: ['schools', params], queryFn: () => getSchools(params) })

export const useGetSchoolById = (id?: string) =>
  useQuery({ queryKey: ['school', id], queryFn: () => getSchoolById(id!), enabled: !!id })

export const useCreateSchool = () => useMutation({ mutationFn: createSchool })
export const useUpdateSchool = () =>
  useMutation({ mutationFn: ({ id, data }: { id: string; data: object }) => updateSchool(id, data) })
export const useDeleteSchool = () => useMutation({ mutationFn: deleteSchool })
