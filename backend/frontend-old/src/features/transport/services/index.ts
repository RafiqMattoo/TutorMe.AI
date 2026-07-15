import api from '@/api/client'
import type { TransportVehicle, TransportRoute, TransportStop, StudentTransport } from '../../types'

// ── TRANSPORT (D4) ────────────────────────────────────────────────
export const transportApi = {
  vehicles: (schoolId?: string) => api.get<TransportVehicle[]>('/transport/vehicles', { params: { schoolId } }).then(r => r.data),
  saveVehicle: (data: object, id?: string) =>
    (id ? api.put<TransportVehicle>(`/transport/vehicles/${id}`, data) : api.post<TransportVehicle>('/transport/vehicles', data)).then(r => r.data),
  deleteVehicle: (id: string, schoolId?: string) => api.delete(`/transport/vehicles/${id}`, { params: { schoolId } }),

  routes: (schoolId?: string) => api.get<TransportRoute[]>('/transport/routes', { params: { schoolId } }).then(r => r.data),
  saveRoute: (data: object, id?: string) =>
    (id ? api.put<TransportRoute>(`/transport/routes/${id}`, data) : api.post<TransportRoute>('/transport/routes', data)).then(r => r.data),
  deleteRoute: (id: string, schoolId?: string) => api.delete(`/transport/routes/${id}`, { params: { schoolId } }),

  stops: (routeId: string, schoolId?: string) =>
    api.get<TransportStop[]>(`/transport/routes/${routeId}/stops`, { params: { schoolId } }).then(r => r.data),
  saveStop: (data: object, id?: string) =>
    (id ? api.put<TransportStop>(`/transport/stops/${id}`, data) : api.post<TransportStop>('/transport/stops', data)).then(r => r.data),
  deleteStop: (id: string, schoolId?: string) => api.delete(`/transport/stops/${id}`, { params: { schoolId } }),

  allocations: (schoolId?: string, routeId?: string) =>
    api.get<StudentTransport[]>('/transport/allocations', { params: { schoolId, routeId } }).then(r => r.data),
  saveAllocation: (data: object, id?: string) =>
    (id ? api.put<StudentTransport>(`/transport/allocations/${id}`, data) : api.post<StudentTransport>('/transport/allocations', data)).then(r => r.data),
  deleteAllocation: (id: string, schoolId?: string) => api.delete(`/transport/allocations/${id}`, { params: { schoolId } }),
}

export { studentsApi } from '@/features/students/services'
