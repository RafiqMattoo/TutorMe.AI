import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { AskSimpleBotRequest, SimpleBotResponse } from '../../../shared/types/index.ts'

// ── SIMPLE BOT ───────────────────────────────────────────────────

export const simpleBotApi = {
  ask: (data: AskSimpleBotRequest) =>
    axiosInstance.post<SimpleBotResponse>('/simple-bot/ask', data, { timeout: 120000 }).then(r => r.data),
}

export const askSimpleBot = simpleBotApi.ask
