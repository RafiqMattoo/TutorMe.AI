import { useMutation, useQuery } from '@tanstack/react-query'
import {
  approveMember,
  approveSchool,
  getPendingMembers,
  getPendingSchools,
  rejectMember,
  rejectSchool,
} from '../services'

export const useGetPendingSchools = (enabled = true) =>
  useQuery({
    queryKey: ['pending-schools'],
    queryFn: getPendingSchools,
    enabled,
  })

export const useGetPendingMembers = () =>
  useQuery({
    queryKey: ['pending-members'],
    queryFn: getPendingMembers,
  })

export const useApproveSchool = () => useMutation({ mutationFn: approveSchool })
export const useRejectSchool = () => useMutation({ mutationFn: rejectSchool })
export const useApproveMember = () => useMutation({ mutationFn: approveMember })
export const useRejectMember = () => useMutation({ mutationFn: rejectMember })
