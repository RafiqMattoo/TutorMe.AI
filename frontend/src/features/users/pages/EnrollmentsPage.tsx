import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link2, Plus, Trash2 } from 'lucide-react'
import { enrollmentsApi, schoolsApi, usersApi } from '../services'
import { EmptyState, Field, Modal, PageHeader, StatusBadge, Table } from '../../../shared/components/ui/index.tsx'
import { roleProfiles } from '../../../shared/auth/roles.ts'
import type { EnrollmentStatus, UserRole } from '../../../shared/types/index.ts'
import toast from 'react-hot-toast'

const roles: UserRole[] = ['SchoolAdmin', 'Teacher', 'Student', 'Parent']
const statuses: EnrollmentStatus[] = ['Active', 'Pending', 'Suspended', 'Alumni']

export default function EnrollmentsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ userId: '', schoolId: '', role: 'Student' as UserRole, status: 'Active' as EnrollmentStatus, isPrimary: false })
  const qc = useQueryClient()

  const { data: enrollments = [], isLoading } = useQuery({ queryKey: ['enrollments'], queryFn: () => enrollmentsApi.getAll() })
  const { data: users } = useQuery({ queryKey: ['users', 'enrollment-picker'], queryFn: () => usersApi.getAll({ page: 1, pageSize: 200 }) })
  const { data: schools } = useQuery({ queryKey: ['schools', 'enrollment-picker'], queryFn: () => schoolsApi.getAll({ page: 1, pageSize: 200 }) })

  const userOptions = useMemo(() => users?.items ?? [], [users])
  const schoolOptions = useMemo(() => schools?.items ?? [], [schools])

  const createMutation = useMutation({
    mutationFn: enrollmentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Enrollment created')
      setModalOpen(false)
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Failed to create enrollment')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: enrollmentsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['enrollments'] }); toast.success('Enrollment removed') },
  })

  const openCreate = () => {
    setForm({
      userId: userOptions[0]?.id ?? '',
      schoolId: schoolOptions[0]?.id ?? '',
      role: 'Student',
      status: 'Active',
      isPrimary: false,
    })
    setModalOpen(true)
  }

  return (
    <div>
      <PageHeader title="School Enrollments" subtitle={`${enrollments.length} active membership records`}
        action={<button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={14} />Enroll User</button>} />

      <div className="space-y-5 p-5 lg:p-8">
        <div className="card p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-teal-50 p-3 text-teal-700"><Link2 size={19} /></div>
            <div>
              <h2 className="text-sm font-black text-slate-900">How multiple schools are handled</h2>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
                Each school relationship is an enrollment record. This lets the same person belong to multiple schools with different roles and statuses, while one primary enrollment drives their default login context.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <Table headers={['User', 'School', 'Role', 'Status', 'Primary', 'Actions']} loading={isLoading}>
            {!enrollments.length ? <EmptyState message="No enrollments found." /> :
              enrollments.map(e => (
                <tr key={e.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">{e.userName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{e.schoolName}</td>
                  <td className="px-4 py-3"><span className="badge-blue">{roleProfiles[e.role]?.label ?? e.role}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-4 py-3 text-sm text-slate-500">{e.isPrimary ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { if (confirm('Remove enrollment?')) deleteMutation.mutate(e.id) }}
                      className="text-slate-400 transition-colors hover:text-red-500"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
          </Table>
        </div>
      </div>

      <Modal title="Enroll User" open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <Field label="User">
            <select className="input" value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}>
              {userOptions.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} - {u.email}</option>)}
            </select>
          </Field>
          <Field label="School">
            <select className="input" value={form.schoolId} onChange={e => setForm(f => ({ ...f, schoolId: e.target.value }))}>
              {schoolOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Role"><select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}>{roles.map(r => <option key={r}>{r}</option>)}</select></Field>
            <Field label="Status"><select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as EnrollmentStatus }))}>{statuses.map(s => <option key={s}>{s}</option>)}</select></Field>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <input type="checkbox" checked={form.isPrimary} onChange={e => setForm(f => ({ ...f, isPrimary: e.target.checked }))} />
            Make primary school context
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !form.userId || !form.schoolId} className="btn-primary flex-1">
              {createMutation.isPending ? 'Enrolling...' : 'Create Enrollment'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
