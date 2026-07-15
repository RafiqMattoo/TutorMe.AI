import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, GraduationCap, Loader2, School as SchoolIcon, UserRound, X } from 'lucide-react'
import { approvalsApi } from '../../api'
import { PageHeader } from '../../components/ui'
import { useAuthStore } from '../../store/authStore'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function ApprovalsPage() {
  const qc = useQueryClient()
  const role = useAuthStore(s => s.user?.role)
  const isSuper = role === 'SuperAdmin'

  const schools = useQuery({
    queryKey: ['pending-schools'],
    queryFn: approvalsApi.pendingSchools,
    enabled: isSuper,
  })
  const members = useQuery({
    queryKey: ['pending-members'],
    queryFn: approvalsApi.pendingMembers,
  })

  const onOk = (key: string, msg: string) => ({
    onSuccess: () => { qc.invalidateQueries({ queryKey: [key] }); toast.success(msg) },
    onError: () => toast.error('Action failed'),
  })
  const approveSchool = useMutation({ mutationFn: approvalsApi.approveSchool, ...onOk('pending-schools', 'School approved') })
  const rejectSchool = useMutation({ mutationFn: approvalsApi.rejectSchool, ...onOk('pending-schools', 'School rejected') })
  const approveMember = useMutation({ mutationFn: approvalsApi.approveMember, ...onOk('pending-members', 'Member approved') })
  const rejectMember = useMutation({ mutationFn: approvalsApi.rejectMember, ...onOk('pending-members', 'Member rejected') })

  const totalPending = (schools.data?.length ?? 0) + (members.data?.length ?? 0)

  return (
    <div>
      <PageHeader title="Approvals" subtitle={`${totalPending} request${totalPending === 1 ? '' : 's'} awaiting review`} />

      <div className="space-y-8 p-5 lg:p-8">
        {/* Pending schools — SuperAdmin only */}
        {isSuper && (
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
              <SchoolIcon size={15} className="text-blue-600" /> Schools awaiting approval
            </h3>
            {schools.isLoading ? <Spinner /> : !schools.data?.length ? (
              <Empty label="No schools waiting for review." />
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {schools.data.map(s => (
                  <div key={s.id} className="card flex items-start justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900">{s.name}</div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {[s.city, s.state].filter(Boolean).join(', ') || '—'} · {s.type} · {s.board}
                      </div>
                      <div className="mt-1.5 text-xs text-slate-600">
                        Admin: <span className="font-semibold">{s.adminName ?? '—'}</span>
                        {s.adminEmail && <span className="text-slate-400"> · {s.adminEmail}</span>}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400">{formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}</div>
                    </div>
                    <Actions
                      onApprove={() => approveSchool.mutate(s.id)}
                      onReject={() => { if (confirm(`Reject ${s.name}?`)) rejectSchool.mutate(s.id) }}
                      busy={approveSchool.isPending || rejectSchool.isPending}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Pending members — SuperAdmin (all) or SchoolAdmin (own school) */}
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
            <UserRound size={15} className="text-emerald-600" /> Teachers &amp; students awaiting approval
          </h3>
          {members.isLoading ? <Spinner /> : !members.data?.length ? (
            <Empty label="No teachers or students waiting for review." />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {members.data.map(m => (
                <div key={m.id} className="card flex items-start justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={m.role === 'Student' ? 'badge-gray' : 'badge-green'}>
                        {m.role === 'Student' ? <GraduationCap size={11} className="mr-1 inline" /> : null}{m.role}
                      </span>
                      <span className="truncate text-sm font-bold text-slate-900">{m.firstName} {m.lastName}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{m.email}</div>
                    {isSuper && m.schoolName && <div className="mt-0.5 text-xs text-slate-400">{m.schoolName}</div>}
                    {(m.gradeLevel || m.rollNumber) && (
                      <div className="mt-1 text-xs text-slate-600">
                        {m.gradeLevel && <>Class {m.gradeLevel}</>}{m.gradeLevel && m.rollNumber ? ' · ' : ''}{m.rollNumber && <>Roll {m.rollNumber}</>}
                      </div>
                    )}
                    <div className="mt-1 text-[11px] text-slate-400">{formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}</div>
                  </div>
                  <Actions
                    onApprove={() => approveMember.mutate(m.id)}
                    onReject={() => { if (confirm(`Reject ${m.firstName} ${m.lastName}?`)) rejectMember.mutate(m.id) }}
                    busy={approveMember.isPending || rejectMember.isPending}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function Actions({ onApprove, onReject, busy }: { onApprove: () => void; onReject: () => void; busy: boolean }) {
  return (
    <div className="flex shrink-0 gap-2">
      <button onClick={onApprove} disabled={busy} title="Approve"
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-40">
        <Check size={15} />
      </button>
      <button onClick={onReject} disabled={busy} title="Reject"
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-colors hover:bg-red-100 disabled:opacity-40">
        <X size={15} />
      </button>
    </div>
  )
}

function Spinner() {
  return <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-300" /></div>
}
function Empty({ label }: { label: string }) {
  return <div className="card p-8 text-center text-sm text-slate-400">{label}</div>
}
