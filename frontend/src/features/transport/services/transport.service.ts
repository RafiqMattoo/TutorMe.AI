import { axiosInstance } from '../../../api/axiosInstance.ts'
import type { TransportVehicle, TransportRoute, TransportStop, StudentTransport } from '../../../shared/types/index.ts'

// ── TRANSPORT (D4) ────────────────────────────────────────────────

export const transportApi = {
  vehicles: (schoolId?: string) => axiosInstance.get<TransportVehicle[]>('/transport/vehicles', { params: { schoolId } }).then(r => r.data),
  saveVehicle: (data: object, id?: string) =>
    (id ? axiosInstance.put<TransportVehicle>(`/transport/vehicles/${id}`, data) : axiosInstance.post<TransportVehicle>('/transport/vehicles', data)).then(r => r.data),
  deleteVehicle: (id: string, schoolId?: string) => axiosInstance.delete(`/transport/vehicles/${id}`, { params: { schoolId } }),

  routes: (schoolId?: string) => axiosInstance.get<TransportRoute[]>('/transport/routes', { params: { schoolId } }).then(r => r.data),
  saveRoute: (data: object, id?: string) =>
    (id ? axiosInstance.put<TransportRoute>(`/transport/routes/${id}`, data) : axiosInstance.post<TransportRoute>('/transport/routes', data)).then(r => r.data),
  deleteRoute: (id: string, schoolId?: string) => axiosInstance.delete(`/transport/routes/${id}`, { params: { schoolId } }),

  stops: (routeId: string, schoolId?: string) =>
    axiosInstance.get<TransportStop[]>(`/transport/routes/${routeId}/stops`, { params: { schoolId } }).then(r => r.data),
  saveStop: (data: object, id?: string) =>
    (id ? axiosInstance.put<TransportStop>(`/transport/stops/${id}`, data) : axiosInstance.post<TransportStop>('/transport/stops', data)).then(r => r.data),
  deleteStop: (id: string, schoolId?: string) => axiosInstance.delete(`/transport/stops/${id}`, { params: { schoolId } }),

  allocations: (schoolId?: string, routeId?: string) =>
    axiosInstance.get<StudentTransport[]>('/transport/allocations', { params: { schoolId, routeId } }).then(r => r.data),
  saveAllocation: (data: object, id?: string) =>
    (id ? axiosInstance.put<StudentTransport>(`/transport/allocations/${id}`, data) : axiosInstance.post<StudentTransport>('/transport/allocations', data)).then(r => r.data),
  deleteAllocation: (id: string, schoolId?: string) => axiosInstance.delete(`/transport/allocations/${id}`, { params: { schoolId } }),
}

export const getTransportVehicles = transportApi.vehicles
export const saveTransportVehicle = transportApi.saveVehicle
export const deleteTransportVehicle = transportApi.deleteVehicle
export const getTransportRoutes = transportApi.routes
export const saveTransportRoute = transportApi.saveRoute
export const deleteTransportRoute = transportApi.deleteRoute
export const getTransportStops = transportApi.stops
export const saveTransportStop = transportApi.saveStop
export const deleteTransportStop = transportApi.deleteStop
export const getTransportAllocations = transportApi.allocations
export const saveTransportAllocation = transportApi.saveAllocation
export const deleteTransportAllocation = transportApi.deleteAllocation
