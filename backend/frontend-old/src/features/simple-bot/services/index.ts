import api from '@/api/client'
import type { AskSimpleBotRequest, SimpleBotResponse } from '../../types'

// ── SIMPLE BOT ───────────────────────────────────────────────────
export const simpleBotApi = {
  ask: (data: AskSimpleBotRequest) =>
    api.post<SimpleBotResponse>('/simple-bot/ask', data, { timeout: 120000 }).then(r => r.data),
}
