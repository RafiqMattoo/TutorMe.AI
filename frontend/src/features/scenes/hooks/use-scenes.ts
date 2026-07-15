import { useGetMaterials } from '@/features/materials/hooks'
import { useGenerateNarration, useGetNarration, useGetNarrationVoices } from '@/features/narration/hooks'

export const useGetSceneMaterials = useGetMaterials
export const useGetSceneNarration = (materialId?: string) => useGetNarration(materialId, 'Illustrated')
export const useGetSceneVoices = useGetNarrationVoices
export const useGenerateSceneNarration = useGenerateNarration
