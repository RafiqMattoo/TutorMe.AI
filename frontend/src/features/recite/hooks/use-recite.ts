import { useGetMaterialChunks, useGetMaterials } from '@/features/materials/hooks'
import { useGenerateNarration, useGetNarration, useGetNarrationVoices } from '@/features/narration/hooks'

export const useGetReciteMaterials = useGetMaterials
export const useGetReciteMaterialChunks = useGetMaterialChunks
export const useGetReciteNarration = (materialId?: string) => useGetNarration(materialId, 'Verbatim')
export const useGetReciteVoices = useGetNarrationVoices
export const useGenerateReciteNarration = useGenerateNarration
