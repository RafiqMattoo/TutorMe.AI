import { axiosInstance } from '@/api/axiosInstance'
import type { PendingSchool, PendingMember } from '@/shared/types'

// ── APPROVALS (self-registration review) ──────────────────────────

export const approvalsApi = {
  pendingSchools: () => axiosInstance.get<PendingSchool[]>('/approvals/schools').then(r => r.data),
  approveSchool: (id: string) => axiosInstance.post(`/approvals/schools/${id}/approve`),
  rejectSchool: (id: string) => axiosInstance.post(`/approvals/schools/${id}/reject`),
  pendingMembers: () => axiosInstance.get<PendingMember[]>('/approvals/members').then(r => r.data),
  approveMember: (id: string) => axiosInstance.post(`/approvals/members/${id}/approve`),
  rejectMember: (id: string) => axiosInstance.post(`/approvals/members/${id}/reject`),
}

export const getPendingSchools = approvalsApi.pendingSchools
export const approveSchool = approvalsApi.approveSchool
export const rejectSchool = approvalsApi.rejectSchool
export const getPendingMembers = approvalsApi.pendingMembers
export const approveMember = approvalsApi.approveMember
export const rejectMember = approvalsApi.rejectMember
