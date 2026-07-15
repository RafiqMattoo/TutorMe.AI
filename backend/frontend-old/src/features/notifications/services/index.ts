import api from '@/api/client'
import type { AppNotification } from '../../types'

// ── NOTIFICATIONS ─────────────────────────────────────────────────
export const notificationsApi = {
  getAll: () => api.get<AppNotification[]>('/notifications').then(r => r.data),
  markRead: (id: string) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
}
