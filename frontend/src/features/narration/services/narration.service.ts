import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { NarrationKind, Narration, NarrationVoice } from '../../../shared/types/index.ts'

// ── NARRATION (audio read-along) ──────────────────────────────────

export const narrationApi = {
  // Current narration of a kind (Verbatim = recite, Explained = animated explainer).
  get: (materialId: string, kind: NarrationKind = 'Verbatim') =>
    axiosInstance.get<Narration | null>(`/materials/${materialId}/narration`, { params: { kind } }).then(r => r.data),
  // Kicks off (or restarts) background synthesis; returns the Processing record.
  generate: (materialId: string, voice?: string, kind: NarrationKind = 'Verbatim') =>
    axiosInstance.post<Narration>(`/materials/${materialId}/narration`, { voice, kind }).then(r => r.data),
  voices: () => axiosInstance.get<NarrationVoice[]>('/narration/voices').then(r => r.data),
}

export const getNarration = narrationApi.get
export const generateNarration = narrationApi.generate
export const getNarrationVoices = narrationApi.voices
