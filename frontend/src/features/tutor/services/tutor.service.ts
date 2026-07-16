import { API_BASE_URL, axiosInstance, getStoredAccessToken } from '../../../api/axiosInstance.ts'
import type { ChatMessage, ChatSession, AskTutorResponse, TutorStreamEvent } from '../../../shared/types/index.ts'

// ── TUTOR ─────────────────────────────────────────────────────────

export const tutorApi = {
  getSessions: () => axiosInstance.get<ChatSession[]>('/tutor/sessions').then(r => r.data),
  getMessages: (sessionId: string) =>
    axiosInstance.get<ChatMessage[]>(`/tutor/sessions/${sessionId}/messages`).then(r => r.data),
  ask: (data: { sessionId?: string; materialId?: string; question: string }) =>
    axiosInstance.post<AskTutorResponse>('/tutor/ask', data, { timeout: 120000 }).then(r => r.data),
  // Streams the answer token-by-token over SSE. Invokes onEvent for each frame
  // (meta → tokens → done, or error). Returns when the stream ends.
  askStream: async (
    data: { sessionId?: string; materialId?: string; question: string },
    onEvent: (ev: TutorStreamEvent) => void,
    signal?: AbortSignal,
  ) => {
    const token = getStoredAccessToken()
    const res = await fetch(`${API_BASE_URL}/tutor/ask/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(data),
      signal,
    })
    if (!res.ok || !res.body) throw new Error(`Tutor stream failed (${res.status})`)

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      // SSE frames are separated by a blank line; each carries a `data:` field.
      let sep
      while ((sep = buffer.indexOf('\n\n')) >= 0) {
        const frame = buffer.slice(0, sep)
        buffer = buffer.slice(sep + 2)
        const dataLine = frame.split('\n').find(l => l.startsWith('data:'))
        if (!dataLine) continue
        const json = dataLine.slice(5).trim()
        if (!json) continue
        try { onEvent(JSON.parse(json) as TutorStreamEvent) } catch { /* skip malformed frame */ }
      }
    }
  },
  deleteSession: (sessionId: string) => axiosInstance.delete(`/tutor/sessions/${sessionId}`),
}

export const getTutorSessions = tutorApi.getSessions
export const getTutorMessages = tutorApi.getMessages
export const askTutor = tutorApi.ask
export const askTutorStream = tutorApi.askStream
export const deleteTutorSession = tutorApi.deleteSession
