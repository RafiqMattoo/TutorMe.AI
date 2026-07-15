import { useMutation, useQuery } from '@tanstack/react-query'
import {
  deleteTransportAllocation,
  deleteTransportRoute,
  deleteTransportStop,
  deleteTransportVehicle,
  getTransportAllocations,
  getTransportRoutes,
  getTransportStops,
  getTransportVehicles,
  saveTransportAllocation,
  saveTransportRoute,
  saveTransportStop,
  saveTransportVehicle,
} from '../services'

export const useGetTransportVehicles = (schoolId?: string) =>
  useQuery({ queryKey: ['vehicles', schoolId], queryFn: () => getTransportVehicles(schoolId) })

export const useGetTransportRoutes = (schoolId?: string) =>
  useQuery({ queryKey: ['routes', schoolId], queryFn: () => getTransportRoutes(schoolId) })

export const useGetTransportStops = (routeId?: string, schoolId?: string) =>
  useQuery({ queryKey: ['stops', routeId, schoolId], queryFn: () => getTransportStops(routeId!, schoolId), enabled: !!routeId })

export const useGetTransportAllocations = (schoolId?: string, routeId?: string) =>
  useQuery({ queryKey: ['allocations', schoolId, routeId], queryFn: () => getTransportAllocations(schoolId, routeId) })

export const useSaveTransportVehicle = () =>
  useMutation({ mutationFn: ({ data, id }: { data: object; id?: string }) => saveTransportVehicle(data, id) })
export const useDeleteTransportVehicle = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteTransportVehicle(id, schoolId) })
export const useSaveTransportRoute = () =>
  useMutation({ mutationFn: ({ data, id }: { data: object; id?: string }) => saveTransportRoute(data, id) })
export const useDeleteTransportRoute = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteTransportRoute(id, schoolId) })
export const useSaveTransportStop = () =>
  useMutation({ mutationFn: ({ data, id }: { data: object; id?: string }) => saveTransportStop(data, id) })
export const useDeleteTransportStop = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteTransportStop(id, schoolId) })
export const useSaveTransportAllocation = () =>
  useMutation({ mutationFn: ({ data, id }: { data: object; id?: string }) => saveTransportAllocation(data, id) })
export const useDeleteTransportAllocation = () =>
  useMutation({ mutationFn: ({ id, schoolId }: { id: string; schoolId?: string }) => deleteTransportAllocation(id, schoolId) })
