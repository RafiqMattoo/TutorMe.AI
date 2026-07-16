import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { Student, Delivery, CreateDeliveryRequest } from '../../../shared/types/index.ts'

// ── DELIVERIES (Delivered Today) ──────────────────────────────────

export const deliveriesApi = {
  // Teacher / admin: manage deliveries (optionally one day).
  getAll: (date?: string) =>
    axiosInstance.get<Delivery[]>('/deliveries', { params: { date } }).then(r => r.data),
  // Student: what's delivered for a day (pass the browser's local date).
  getToday: (date: string) =>
    axiosInstance.get<Delivery[]>('/deliveries/today', { params: { date } }).then(r => r.data),
  create: (data: CreateDeliveryRequest) =>
    axiosInstance.post<Delivery>('/deliveries', data).then(r => r.data),
  delete: (id: string) => axiosInstance.delete(`/deliveries/${id}`),
}

export const getDeliveries = deliveriesApi.getAll
export const getTodayDeliveries = deliveriesApi.getToday
export const createDelivery = deliveriesApi.create
export const deleteDelivery = deliveriesApi.delete
