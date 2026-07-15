import { useMutation, useQuery } from '@tanstack/react-query'
import { createDelivery, deleteDelivery, getDeliveries, getTodayDeliveries } from '../services'

export const useGetDeliveries = (date?: string) =>
  useQuery({
    queryKey: ['deliveries', date],
    queryFn: () => getDeliveries(date),
  })

export const useGetTodayDeliveries = (date: string) =>
  useQuery({
    queryKey: ['today-deliveries', date],
    queryFn: () => getTodayDeliveries(date),
    enabled: !!date,
  })

export const useCreateDelivery = () => useMutation({ mutationFn: createDelivery })
export const useDeleteDelivery = () => useMutation({ mutationFn: deleteDelivery })
