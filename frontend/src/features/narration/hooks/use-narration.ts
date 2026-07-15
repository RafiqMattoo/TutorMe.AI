import { useMutation, useQuery } from '@tanstack/react-query'
import { generateNarration, getNarration, getNarrationVoices } from '../services'
import type { NarrationKind } from '@/shared/types'

export const useGetNarration = (materialId?: string, kind: NarrationKind = 'Verbatim') =>
  useQuery({
    queryKey: ['narration', materialId, kind],
    queryFn: () => getNarration(materialId!, kind),
    enabled: !!materialId,
  })

export const useGetNarrationVoices = () =>
  useQuery({
    queryKey: ['narration-voices'],
    queryFn: getNarrationVoices,
    staleTime: Infinity,
  })

export const useGenerateNarration = () =>
  useMutation({
    mutationFn: ({ materialId, voice, kind }: { materialId: string; voice?: string; kind?: NarrationKind }) =>
      generateNarration(materialId, voice, kind),
  })
