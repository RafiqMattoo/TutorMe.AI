import api from '@/api/client'
import type { PendingSchool, PendingMember } from '../../types'

// ── APPROVALS (self-registration review) ──────────────────────────
export const approvalsApi = {
  pendingSchools: () => api.get<PendingSchool[]>('/approvals/schools').then(r => r.data),
  approveSchool: (id: string) => api.post(`/approvals/schools/${id}/approve`),
  rejectSchool: (id: string) => api.post(`/approvals/schools/${id}/reject`),
  pendingMembers: () => api.get<PendingMember[]>('/approvals/members').then(r => r.data),
  approveMember: (id: string) => api.post(`/approvals/members/${id}/approve`),
  rejectMember: (id: string) => api.post(`/approvals/members/${id}/reject`),
}
