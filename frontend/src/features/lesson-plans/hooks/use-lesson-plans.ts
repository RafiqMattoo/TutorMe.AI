import { useMutation, useQuery } from '@tanstack/react-query'
import { deleteLessonPlan, generateLessonPlan, getLessonPlanById, getLessonPlans } from '../services'

export const useGetLessonPlans = (materialId?: string) =>
  useQuery({ queryKey: ['lesson-plans', materialId], queryFn: () => getLessonPlans(materialId) })

export const useGetLessonPlanById = (id?: string) =>
  useQuery({ queryKey: ['lesson-plan', id], queryFn: () => getLessonPlanById(id!), enabled: !!id })

export const useGenerateLessonPlan = () => useMutation({ mutationFn: generateLessonPlan })
export const useDeleteLessonPlan = () => useMutation({ mutationFn: deleteLessonPlan })
