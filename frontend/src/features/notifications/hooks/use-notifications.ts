import { useMutation, useQuery } from '@tanstack/react-query'
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../services'

export const useGetNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchInterval: 30_000,
  })

export const useMarkNotificationRead = () => useMutation({ mutationFn: markNotificationRead })
export const useMarkAllNotificationsRead = () => useMutation({ mutationFn: markAllNotificationsRead })
