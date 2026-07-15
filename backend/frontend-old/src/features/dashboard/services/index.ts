import api from '@/api/client'
import type { DashboardStats } from '../../types'

// ── DASHBOARD ─────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats').then(r => r.data),
}
