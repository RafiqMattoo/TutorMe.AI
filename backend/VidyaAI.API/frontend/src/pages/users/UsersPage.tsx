import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { usersApi } from '../../api'
import { EmptyState, Field, Modal, PageHeader, Pagination, SearchBar, StatusBadge, Table } from '../../components/ui'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import { manageableRoles, roleProfiles } from '../../auth/roles'
import { useAuthStore } from '../../store/authStore'
import type { UserRole } from '../../types'

const roleColors: Record<string, string> = {
  SuperAdmin: 'badge-red',
  SchoolAdmin: 'badge-blue',
  Teacher: 'badge-green',
  Student: 'badge-gray',
  Parent: 'badge-yellow',
}

export default function UsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const qc = useQueryClient()
  const currentUser = useAuthStore(s => s.user)
  const roles = useMemo(() => manageableRoles(currentUser?.role), [currentUser?.role])
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', role: roles[0] ?? 'Teacher' })

  useEffect(() => {
    if (!roles.includes(form.role as UserRole) && roles[0]) setForm(f => ({ ...f, role: roles[0] }))
  }, [form.role, roles])

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => usersApi.getAll({ page, pageSize: 20, search }),
  })

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created')
      setModalOpen(false)
      setForm({ firstName: '', lastName: '', email: '', password: '', phone: '', role: roles[0] ?? 'Teacher' })
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Failed to create user')
    },
  })

  const toggleMutation = useMutation({
    mutationFn: usersApi.toggleActive,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('User status updated') },
  })

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('User deleted') },
  })

  return (
    <div>
      <PageHeader title="Users" subtitle={`${data?.totalCount ?? 0} people in this workspace`}
        action={<button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2"><Plus size={14} />Add User</button>} />

      <div className="space-y-5 p-5 lg:p-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card p-5 lg:col-span-2">
            <div className="text-xs font-bold uppercase text-slate-400">Current access</div>
            <div className="mt-2 text-xl font-black text-slate-950">{currentUser?.role ? roleProfiles[currentUser.role].label : 'Unknown role'}</div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {currentUser?.role === 'SuperAdmin'
                ? 'You can create and manage users across the entire platform.'
                : 'You can create teachers, students, and parents inside your assigned school.'}
            </p>
          </div>
          <div className="card p-5">
            <div className="text-xs font-bold uppercase text-slate-400">Assignable roles</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {roles.map(role => <span key={role} className={roleColors[role] ?? 'badge-gray'}>{roleProfiles[role].label}</span>)}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="border-b border-slate-100 px-4 py-3">
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Search by name or email..." />
          </div>
          <Table headers={['User', 'Role', 'School', 'Last Login', 'Status', 'Actions']} loading={isLoading}>
            {!data?.items?.length ? <EmptyState message="No users found." /> :
              data.items.map(u => (
                <tr key={u.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{u.firstName} {u.lastName}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={roleColors[u.role] ?? 'badge-gray'}>{roleProfiles[u.role]?.label ?? u.role}</span></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{u.schoolName ?? '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {u.lastLoginAt ? formatDistanceToNow(new Date(u.lastLoginAt), { addSuffix: true }) : 'Never'}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={u.isActive ? 'Active' : 'Inactive'} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleMutation.mutate(u.id)} title={u.isActive ? 'Deactivate' : 'Activate'}
                        className="text-slate-400 transition-colors hover:text-teal-700">
                        {u.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                      <button onClick={() => { if (confirm('Delete user?')) deleteMutation.mutate(u.id) }}
                        className="text-slate-400 transition-colors hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
          </Table>
          <Pagination page={page} totalPages={data?.totalPages ?? 1} onPage={setPage} />
        </div>
      </div>

      <Modal title="Add User" open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name"><input className="input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} /></Field>
            <Field label="Last Name"><input className="input" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} /></Field>
          </div>
          <Field label="Email"><input type="email" className="input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></Field>
          <Field label="Password"><input type="password" className="input" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></Field>
          <Field label="Role"><select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}>
            {roles.map(r => <option key={r} value={r}>{roleProfiles[r].label}</option>)}
          </select></Field>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || roles.length === 0} className="btn-primary flex-1">
              {createMutation.isPending ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
