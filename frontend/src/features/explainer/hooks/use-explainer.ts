import { useGetMaterials } from '../../materials/hooks/index.ts'
import { useGenerateNarration, useGetNarration, useGetNarrationVoices } from '../../narration/hooks/index.ts'

export const useGetExplainerMaterials = useGetMaterials
export const useGetExplainerNarration = (materialId?: string) => useGetNarration(materialId, 'Explained')
export const useGetExplainerVoices = useGetNarrationVoices
export const useGenerateExplainerNarration = useGenerateNarration
