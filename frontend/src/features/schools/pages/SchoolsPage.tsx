// ── SCHOOLS PAGE ──────────────────────────────────────────────────
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { schoolsApi } from '../services'
import { PageHeader, SearchBar, Table, EmptyState, Pagination, StatusBadge, Modal, Field } from '@/shared/components/ui'
import toast from 'react-hot-toast'
import type { School } from '@/shared/types'

export function SchoolsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<School | null>(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['schools', page, search],
    queryFn: () => schoolsApi.getAll({ page, pageSize: 20, search }),
  })

  const deleteMutation = useMutation({
    mutationFn: schoolsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['schools'] }); toast.success('School deleted') },
    onError: () => toast.error('Failed to delete'),
  })

  const createMutation = useMutation({
    mutationFn: (d: object) => editing ? schoolsApi.update(editing.id, d) : schoolsApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schools'] })
      toast.success(editing ? 'School updated' : 'School created')
      setModalOpen(false); setEditing(null)
    },
    onError: () => toast.error('Operation failed'),
  })

  const [form, setForm] = useState({ name: '', city: '', state: '', email: '', phone: '', board: 'CBSE', type: 'Private', plan: 'Free' })

  const openCreate = () => { setEditing(null); setForm({ name: '', city: '', state: '', email: '', phone: '', board: 'CBSE', type: 'Private', plan: 'Free' }); setModalOpen(true) }
  const openEdit = (s: School) => { setEditing(s); setForm({ name: s.name, city: s.city ?? '', state: s.state ?? '', email: s.email ?? '', phone: s.phone ?? '', board: s.board, type: s.type, plan: s.plan }); setModalOpen(true) }

  return (
    <div>
      <PageHeader title="Schools" subtitle={`${data?.totalCount ?? 0} total schools`}
        action={<button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={14} />Add School</button>} />
      <div className="p-6">
        <div className="card">
          <div className="px-4 py-3 border-b border-gray-100">
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Search schools..." />
          </div>
          <Table headers={['Name', 'City', 'Board', 'Plan', 'Users', 'Articles', 'Status', 'Actions']} loading={isLoading}>
            {!data?.items?.length ? <EmptyState message="No schools found." /> :
              data.items.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3"><div className="font-medium text-gray-900 text-sm">{s.name}</div><div className="text-xs text-gray-400">{s.email}</div></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.city}, {s.state}</td>
                  <td className="px-4 py-3"><span className="badge-blue">{s.board}</span></td>
                  <td className="px-4 py-3"><span className="badge-gray">{s.plan}</span></td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{s.totalUsers}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{s.totalArticles}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.isActive ? 'Active' : 'Inactive'} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="text-gray-400 hover:text-primary transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => { if (confirm('Delete school?')) deleteMutation.mutate(s.id) }} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
          </Table>
          <Pagination page={page} totalPages={data?.totalPages ?? 1} onPage={setPage} />
        </div>
      </div>

      <Modal title={editing ? 'Edit School' : 'Add School'} open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <Field label="School Name"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. DPS Srinagar" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City"><input className="input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></Field>
            <Field label="State"><input className="input" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} /></Field>
          </div>
          <Field label="Email"><input type="email" className="input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Board"><select className="input" value={form.board} onChange={e => setForm(f => ({ ...f, board: e.target.value }))}>
              {['CBSE', 'ICSE', 'JKBOSE', 'StateBoard', 'IGCSE', 'Other'].map(b => <option key={b}>{b}</option>)}</select></Field>
            <Field label="Type"><select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {['Private', 'Government', 'CoachingCentre', 'College'].map(t => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Plan"><select className="input" value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}>
              {['Free', 'Starter', 'Growth', 'Pro', 'Enterprise'].map(p => <option key={p}>{p}</option>)}</select></Field>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending} className="btn-primary flex-1">
              {createMutation.isPending ? 'Saving...' : (editing ? 'Update' : 'Create')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SchoolsPage
