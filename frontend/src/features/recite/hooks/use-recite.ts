import { useGetMaterialChunks, useGetMaterials } from '../../materials/hooks/index.ts'
import { useGenerateNarration, useGetNarration, useGetNarrationVoices } from '../../narration/hooks/index.ts'

export const useGetReciteMaterials = useGetMaterials
export const useGetReciteMaterialChunks = useGetMaterialChunks
export const useGetReciteNarration = (materialId?: string) => useGetNarration(materialId, 'Verbatim')
export const useGetReciteVoices = useGetNarrationVoices
export const useGenerateReciteNarration = useGenerateNarration
