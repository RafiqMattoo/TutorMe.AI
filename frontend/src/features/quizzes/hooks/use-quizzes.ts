import { useMutation, useQuery } from '@tanstack/react-query'
import { deleteQuiz, generateQuiz, getQuizById, getQuizzes, submitQuiz } from '../services'

export const useGetQuizzes = (materialId?: string) =>
  useQuery({ queryKey: ['quizzes', materialId], queryFn: () => getQuizzes(materialId) })

export const useGetQuizById = (id?: string) =>
  useQuery({ queryKey: ['quiz', id], queryFn: () => getQuizById(id!), enabled: !!id })

export const useGenerateQuiz = () => useMutation({ mutationFn: generateQuiz })
export const useSubmitQuiz = () =>
  useMutation({ mutationFn: ({ id, answers }: { id: string; answers: Record<string, number> }) => submitQuiz(id, answers) })
export const useDeleteQuiz = () => useMutation({ mutationFn: deleteQuiz })
