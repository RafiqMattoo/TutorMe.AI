import { useGetMaterials } from '../../materials/hooks/index.ts'
import { useGenerateNarration, useGetNarration, useGetNarrationVoices } from '../../narration/hooks/index.ts'

export const useGetSceneMaterials = useGetMaterials
export const useGetSceneNarration = (materialId?: string) => useGetNarration(materialId, 'Illustrated')
export const useGetSceneVoices = useGetNarrationVoices
export const useGenerateSceneNarration = useGenerateNarration
