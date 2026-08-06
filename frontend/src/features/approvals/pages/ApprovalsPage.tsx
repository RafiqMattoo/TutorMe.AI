// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { Check, GraduationCap, Loader2, School as SchoolIcon, UserRound, X } from 'lucide-react'
// import { approvalsApi } from '../services'
// import { PageHeader } from '../../../shared/components/ui/index.tsx'
// import { useAuthStore } from '../../../shared/store/authStore.ts'
// import { formatDistanceToNow } from 'date-fns'
// import toast from 'react-hot-toast'

// export default function ApprovalsPage() {
//   const qc = useQueryClient()
//   const role = useAuthStore(s => s.user?.role)
//   const isSuper = role === 'SuperAdmin'

//   const schools = useQuery({
//     queryKey: ['pending-schools'],
//     queryFn: approvalsApi.pendingSchools,
//     enabled: isSuper,
//   })
//   const members = useQuery({
//     queryKey: ['pending-members'],
//     queryFn: approvalsApi.pendingMembers,
//   })

//   const onOk = (key: string, msg: string) => ({
//     onSuccess: () => { qc.invalidateQueries({ queryKey: [key] }); toast.success(msg) },
//     onError: () => toast.error('Action failed'),
//   })
//   const approveSchool = useMutation({ mutationFn: approvalsApi.approveSchool, ...onOk('pending-schools', 'School approved') })
//   const rejectSchool = useMutation({ mutationFn: approvalsApi.rejectSchool, ...onOk('pending-schools', 'School rejected') })
//   const approveMember = useMutation({ mutationFn: approvalsApi.approveMember, ...onOk('pending-members', 'Member approved') })
//   const rejectMember = useMutation({ mutationFn: approvalsApi.rejectMember, ...onOk('pending-members', 'Member rejected') })

//   const totalPending = (schools.data?.length ?? 0) + (members.data?.length ?? 0)

//   return (
//     <div>
//       <PageHeader title="Approvals" subtitle={`${totalPending} request${totalPending === 1 ? '' : 's'} awaiting review`} />

//       <div className="space-y-8 p-5 lg:p-8">
//         {/* Pending schools — SuperAdmin only */}
//         {isSuper && (
//           <section>
//             <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
//               <SchoolIcon size={15} className="text-blue-600" /> Schools awaiting approval
//             </h3>
//             {schools.isLoading ? <Spinner /> : !schools.data?.length ? (
//               <Empty label="No schools waiting for review." />
//             ) : (
//               <div className="grid gap-3 lg:grid-cols-2">
//                 {schools.data.map(s => (
//                   <div key={s.id} className="card flex items-start justify-between gap-4 p-4">
//                     <div className="min-w-0">
//                       <div className="text-sm font-bold text-slate-900">{s.name}</div>
//                       <div className="mt-0.5 text-xs text-slate-500">
//                         {[s.city, s.state].filter(Boolean).join(', ') || '—'} · {s.type} · {s.board}
//                       </div>
//                       <div className="mt-1.5 text-xs text-slate-600">
//                         Admin: <span className="font-semibold">{s.adminName ?? '—'}</span>
//                         {s.adminEmail && <span className="text-slate-400"> · {s.adminEmail}</span>}
//                       </div>
//                       <div className="mt-1 text-[11px] text-slate-400">{formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}</div>
//                     </div>
//                     <Actions
//                       onApprove={() => approveSchool.mutate(s.id)}
//                       onReject={() => { if (confirm(`Reject ${s.name}?`)) rejectSchool.mutate(s.id) }}
//                       busy={approveSchool.isPending || rejectSchool.isPending}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//         )}

//         {/* Pending members — SuperAdmin (all) or SchoolAdmin (own school) */}
//         <section>
//           <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
//             <UserRound size={15} className="text-emerald-600" /> Teachers &amp; students awaiting approval
//           </h3>
//           {members.isLoading ? <Spinner /> : !members.data?.length ? (
//             <Empty label="No teachers or students waiting for review." />
//           ) : (
//             <div className="grid gap-3 lg:grid-cols-2">
//               {members.data.map(m => (
//                 <div key={m.id} className="card flex items-start justify-between gap-4 p-4">
//                   <div className="min-w-0">
//                     <div className="flex items-center gap-2">
//                       <span className={m.role === 'Student' ? 'badge-gray' : 'badge-green'}>
//                         {m.role === 'Student' ? <GraduationCap size={11} className="mr-1 inline" /> : null}{m.role}
//                       </span>
//                       <span className="truncate text-sm font-bold text-slate-900">{m.firstName} {m.lastName}</span>
//                     </div>
//                     <div className="mt-1 text-xs text-slate-500">{m.email}</div>
//                     {isSuper && m.schoolName && <div className="mt-0.5 text-xs text-slate-400">{m.schoolName}</div>}
//                     {(m.gradeLevel || m.rollNumber) && (
//                       <div className="mt-1 text-xs text-slate-600">
//                         {m.gradeLevel && <>Class {m.gradeLevel}</>}{m.gradeLevel && m.rollNumber ? ' · ' : ''}{m.rollNumber && <>Roll {m.rollNumber}</>}
//                       </div>
//                     )}
//                     <div className="mt-1 text-[11px] text-slate-400">{formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}</div>
//                   </div>
//                   <Actions
//                     onApprove={() => approveMember.mutate(m.id)}
//                     onReject={() => { if (confirm(`Reject ${m.firstName} ${m.lastName}?`)) rejectMember.mutate(m.id) }}
//                     busy={approveMember.isPending || rejectMember.isPending}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   )
// }

// function Actions({ onApprove, onReject, busy }: { onApprove: () => void; onReject: () => void; busy: boolean }) {
//   return (
//     <div className="flex shrink-0 gap-2">
//       <button onClick={onApprove} disabled={busy} title="Approve"
//         className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-40">
//         <Check size={15} />
//       </button>
//       <button onClick={onReject} disabled={busy} title="Reject"
//         className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-colors hover:bg-red-100 disabled:opacity-40">
//         <X size={15} />
//       </button>
//     </div>
//   )
// }

// function Spinner() {
//   return <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-300" /></div>
// }
// function Empty({ label }: { label: string }) {
//   return <div className="card p-8 text-center text-sm text-slate-400">{label}</div>
// }


import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, Check, Clock, GraduationCap, Loader2, Mail, School as SchoolIcon, ShieldCheck, UserRound, X } from 'lucide-react'
import { approvalsApi } from '../services'
import { Modal, PageHeader } from '../../../shared/components/ui/index.tsx'
import { useAuthStore } from '../../../shared/store/authStore.ts'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

type PendingSchool = NonNullable<ReturnType<typeof useQuery<Awaited<ReturnType<typeof approvalsApi.pendingSchools>>>>['data']>[number]
type PendingMember = NonNullable<ReturnType<typeof useQuery<Awaited<ReturnType<typeof approvalsApi.pendingMembers>>>>['data']>[number]

type RejectTarget =
  | { kind: 'school'; id: string; label: string }
  | { kind: 'member'; id: string; label: string }

export default function ApprovalsPage() {
  const qc = useQueryClient()
  const role = useAuthStore(s => s.user?.role)
  const isSuper = role === 'SuperAdmin'
  const [rejectTarget, setRejectTarget] = useState<RejectTarget | null>(null)

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
    onError: () => toast.error('Something went wrong — please try again'),
  })
  const approveSchool = useMutation({ mutationFn: approvalsApi.approveSchool, ...onOk('pending-schools', 'School approved') })
  const rejectSchool = useMutation({
    mutationFn: approvalsApi.rejectSchool,
    ...onOk('pending-schools', 'School rejected'),
    onSettled: () => setRejectTarget(null),
  })
  const approveMember = useMutation({ mutationFn: approvalsApi.approveMember, ...onOk('pending-members', 'Member approved') })
  const rejectMember = useMutation({
    mutationFn: approvalsApi.rejectMember,
    ...onOk('pending-members', 'Member rejected'),
    onSettled: () => setRejectTarget(null),
  })

  const schoolCount = schools.data?.length ?? 0
  const memberCount = members.data?.length ?? 0
  const totalPending = schoolCount + memberCount
  const isRejecting = rejectSchool.isPending || rejectMember.isPending

  const confirmReject = () => {
    if (!rejectTarget) return
    if (rejectTarget.kind === 'school') rejectSchool.mutate(rejectTarget.id)
    else rejectMember.mutate(rejectTarget.id)
  }

  return (
    <div>
      <PageHeader
        title="Approvals"
        subtitle={
          totalPending === 0
            ? 'All caught up — nothing awaiting review.'
            : `${totalPending} request${totalPending === 1 ? '' : 's'} awaiting your review`
        }
      />

      <div className="space-y-8 p-5 lg:p-8">
        {/* Summary strip */}
        <div className={`grid gap-4 ${isSuper ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          <SummaryCard
            icon={<ShieldCheck size={18} />}
            tone="slate"
            label="Total pending"
            value={totalPending}
            hint={totalPending === 0 ? 'Nothing needs your attention' : 'Across all categories'}
          />
          {isSuper && (
            <SummaryCard
              icon={<SchoolIcon size={18} />}
              tone="blue"
              label="Schools"
              value={schoolCount}
              hint={schoolCount === 0 ? 'No schools waiting' : 'Awaiting registration review'}
            />
          )}
          <SummaryCard
            icon={<UserRound size={18} />}
            tone="emerald"
            label="Teachers & students"
            value={memberCount}
            hint={memberCount === 0 ? 'No members waiting' : 'Awaiting account review'}
          />
        </div>

        {/* Pending schools — SuperAdmin only */}
        {isSuper && (
          <Section
            icon={<SchoolIcon size={16} className="text-blue-600" />}
            title="Schools awaiting approval"
            count={schoolCount}
          >
            {schools.isLoading ? (
              <Spinner label="Loading school requests..." />
            ) : !schools.data?.length ? (
              <Empty icon={<SchoolIcon size={22} />} label="No schools waiting for review." />
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {schools.data.map((s: PendingSchool) => (
                  <RequestCard
                    key={s.id}
                    avatarLabel={s.name.slice(0, 2).toUpperCase()}
                    avatarTone="blue"
                    title={s.name}
                    badges={[s.type, s.board].filter(Boolean)}
                    meta={[
                      { icon: <Building2 size={12} />, text: [s.city, s.state].filter(Boolean).join(', ') || 'Location not provided' },
                      { icon: <UserRound size={12} />, text: s.adminName ? `Admin: ${s.adminName}` : 'No admin name on file' },
                      ...(s.adminEmail ? [{ icon: <Mail size={12} />, text: s.adminEmail }] : []),
                    ]}
                    submittedAt={s.createdAt}
                    busy={approveSchool.isPending}
                    onApprove={() => approveSchool.mutate(s.id)}
                    onReject={() => setRejectTarget({ kind: 'school', id: s.id, label: s.name })}
                  />
                ))}
              </div>
            )}
          </Section>
        )}

        {/* Pending members */}
        <Section
          icon={<UserRound size={16} className="text-emerald-600" />}
          title="Teachers & students awaiting approval"
          count={memberCount}
        >
          {members.isLoading ? (
            <Spinner label="Loading membership requests..." />
          ) : !members.data?.length ? (
            <Empty icon={<UserRound size={22} />} label="No teachers or students waiting for review." />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {members.data.map((m: PendingMember) => (
                <RequestCard
                  key={m.id}
                  avatarLabel={`${m.firstName[0] ?? ''}${m.lastName[0] ?? ''}`.toUpperCase()}
                  avatarTone={m.role === 'Student' ? 'slate' : 'emerald'}
                  title={`${m.firstName} ${m.lastName}`}
                  badges={[m.role]}
                  badgeIcon={m.role === 'Student' ? <GraduationCap size={11} /> : undefined}
                  meta={[
                    { icon: <Mail size={12} />, text: m.email },
                    ...(isSuper && m.schoolName ? [{ icon: <SchoolIcon size={12} />, text: m.schoolName }] : []),
                    ...(m.gradeLevel || m.rollNumber
                      ? [{
                          icon: <GraduationCap size={12} />,
                          text: [m.gradeLevel ? `Class ${m.gradeLevel}` : null, m.rollNumber ? `Roll ${m.rollNumber}` : null]
                            .filter(Boolean).join(' · '),
                        }]
                      : []),
                  ]}
                  submittedAt={m.createdAt}
                  busy={approveMember.isPending}
                  onApprove={() => approveMember.mutate(m.id)}
                  onReject={() => setRejectTarget({ kind: 'member', id: m.id, label: `${m.firstName} ${m.lastName}` })}
                />
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* Reject confirmation */}
      <Modal title="Reject request" open={!!rejectTarget} onClose={() => setRejectTarget(null)}>
        <div className="space-y-5">
          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to reject <span className="font-semibold text-slate-900">{rejectTarget?.label}</span>?
            This action can't be undone and the applicant will need to re-apply.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setRejectTarget(null)} className="btn-secondary flex-1">Cancel</button>
            <button
              onClick={confirmReject}
              disabled={isRejecting}
              className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
            >
              {isRejecting ? 'Rejecting...' : 'Reject request'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── Building blocks ─────────────────────────────────────────────

const toneClasses: Record<string, { bg: string; text: string }> = {
  slate: { bg: 'bg-slate-100', text: 'text-slate-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
}

function SummaryCard({ icon, tone, label, value, hint }: { icon: React.ReactNode; tone: string; label: string; value: number; hint: string }) {
  const t = toneClasses[tone] ?? toneClasses.slate
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${t.bg} ${t.text}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-2xl font-black leading-none text-slate-950">{value}</div>
        <div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</div>
        <div className="mt-0.5 truncate text-xs text-slate-500">{hint}</div>
      </div>
    </div>
  )
}

function Section({ icon, title, count, children }: { icon: React.ReactNode; title: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">{icon} {title}</h3>
        {count > 0 && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">{count}</span>
        )}
      </div>
      {children}
    </section>
  )
}

function RequestCard({
  avatarLabel, avatarTone, title, badges, badgeIcon, meta, submittedAt, busy, onApprove, onReject,
}: {
  avatarLabel: string
  avatarTone: string
  title: string
  badges: string[]
  badgeIcon?: React.ReactNode
  meta: { icon: React.ReactNode; text: string }[]
  submittedAt: string
  busy: boolean
  onApprove: () => void
  onReject: () => void
}) {
  const t = toneClasses[avatarTone] ?? toneClasses.slate
  return (
    <div className="card flex items-start gap-4 p-4 transition-shadow hover:shadow-sm">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xs font-black ${t.bg} ${t.text}`}>
        {avatarLabel}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-bold text-slate-900">{title}</span>
          {badges.map(b => (
            <span key={b} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
              {badgeIcon}{b}
            </span>
          ))}
        </div>

        <div className="mt-2 space-y-1">
          {meta.map((row, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-slate-400">{row.icon}</span>
              <span className="truncate">{row.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
          <Clock size={11} />
          Submitted {formatDistanceToNow(new Date(submittedAt), { addSuffix: true })}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-2">
        <button
          onClick={onApprove}
          disabled={busy}
          title="Approve"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-40"
        >
          <Check size={16} />
        </button>
        <button
          onClick={onReject}
          disabled={busy}
          title="Reject"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-colors hover:bg-red-100 disabled:opacity-40"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
      <Loader2 className="animate-spin" size={22} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  )
}

function Empty({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-300">{icon}</div>
      <div className="text-sm font-medium text-slate-400">{label}</div>
    </div>
  )
}