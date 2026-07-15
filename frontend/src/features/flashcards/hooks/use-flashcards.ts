import { useMutation, useQuery } from '@tanstack/react-query'
import { deleteFlashcardSet, generateFlashcards, getFlashcardSetById, getFlashcardSets } from '../services'

export const useGetFlashcardSets = (materialId?: string) =>
  useQuery({ queryKey: ['flashcard-sets', materialId], queryFn: () => getFlashcardSets(materialId) })

export const useGetFlashcardSetById = (id?: string) =>
  useQuery({ queryKey: ['flashcard-set', id], queryFn: () => getFlashcardSetById(id!), enabled: !!id })

export const useGenerateFlashcards = () => useMutation({ mutationFn: generateFlashcards })
export const useDeleteFlashcardSet = () => useMutation({ mutationFn: deleteFlashcardSet })
