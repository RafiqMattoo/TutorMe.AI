import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { AppNotification } from '../../../shared/types/index.ts'

// ── NOTIFICATIONS ─────────────────────────────────────────────────

export const notificationsApi = {
  getAll: () => axiosInstance.get<AppNotification[]>('/notifications').then(r => r.data),
  markRead: (id: string) => axiosInstance.post(`/notifications/${id}/read`),
  markAllRead: () => axiosInstance.post('/notifications/read-all'),
}

export const getNotifications = notificationsApi.getAll
export const markNotificationRead = notificationsApi.markRead
export const markAllNotificationsRead = notificationsApi.markAllRead
