import { useGetMaterials } from '@/features/materials/hooks'
import { useGenerateNarration, useGetNarration, useGetNarrationVoices } from '@/features/narration/hooks'

export const useGetExplainerMaterials = useGetMaterials
export const useGetExplainerNarration = (materialId?: string) => useGetNarration(materialId, 'Explained')
export const useGetExplainerVoices = useGetNarrationVoices
export const useGenerateExplainerNarration = useGenerateNarration
