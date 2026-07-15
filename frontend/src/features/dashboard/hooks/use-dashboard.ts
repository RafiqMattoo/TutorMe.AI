import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '../services'

export const useGetDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    refetchInterval: 60_000,
  })
