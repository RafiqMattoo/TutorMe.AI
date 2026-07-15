import api from '@/api/client'
import type { NarrationKind, Narration, NarrationVoice } from '../../types'

// ── NARRATION (audio read-along) ──────────────────────────────────
export const narrationApi = {
  // Current narration of a kind (Verbatim = recite, Explained = animated explainer).
  get: (materialId: string, kind: NarrationKind = 'Verbatim') =>
    api.get<Narration | null>(`/materials/${materialId}/narration`, { params: { kind } }).then(r => r.data),
  // Kicks off (or restarts) background synthesis; returns the Processing record.
  generate: (materialId: string, voice?: string, kind: NarrationKind = 'Verbatim') =>
    api.post<Narration>(`/materials/${materialId}/narration`, { voice, kind }).then(r => r.data),
  voices: () => api.get<NarrationVoice[]>('/narration/voices').then(r => r.data),
}
