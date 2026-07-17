import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { DashboardStats } from '../../../shared/types/index.ts'

// ── DASHBOARD ─────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () => axiosInstance.get<DashboardStats>('/dashboard/stats').then(r => r.data),
}

export const getDashboardStats = dashboardApi.getStats
