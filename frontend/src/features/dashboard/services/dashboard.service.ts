import { axiosInstance } from '@/api/axiosInstance'
import type { DashboardStats } from '@/shared/types'

// ── DASHBOARD ─────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () => axiosInstance.get<DashboardStats>('/dashboard/stats').then(r => r.data),
}

export const getDashboardStats = dashboardApi.getStats
