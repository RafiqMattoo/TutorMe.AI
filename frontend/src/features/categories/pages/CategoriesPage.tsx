import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { categoriesApi } from '../services'
import { EmptyState, Field, Modal, PageHeader, StatusBadge, Table } from '../../../shared/components/ui/index.tsx'
import toast from 'react-hot-toast'
import type { Category } from '../../../shared/types/index.ts'
import { useAuthStore } from '../../../shared/store/authStore.ts'

export default function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', description: '', iconUrl: '', sortOrder: 0, isActive: true })
  const qc = useQueryClient()
  const role = useAuthStore(s => s.user?.role)
  const canManage = role === 'SuperAdmin' || role === 'SchoolAdmin'
  const canDelete = role === 'SuperAdmin'

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'], queryFn: categoriesApi.getAll
  })

  const saveMutation = useMutation({
    mutationFn: (d: object) => editing ? categoriesApi.update(editing.id, d) : categoriesApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success(editing ? 'Category updated' : 'Category created')
      setModalOpen(false); setEditing(null)
    },
    onError: () => toast.error('Failed to save category'),
  })

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast.success('Category deleted') },
  })

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '', iconUrl: '', sortOrder: 0, isActive: true }); setModalOpen(true) }
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description ?? '', iconUrl: c.iconUrl ?? '', sortOrder: c.sortOrder, isActive: c.isActive }); setModalOpen(true) }

  return (
    <div>
      <PageHeader title="Categories" subtitle={`${categories?.length ?? 0} categories`}
        action={canManage ? <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={14} />Add Category</button> : undefined} />

      <div className="p-6">
        <div className="card">
          <Table headers={canManage ? ['Order', 'Name', 'Description', 'Articles', 'Status', 'Actions'] : ['Order', 'Name', 'Description', 'Articles', 'Status']} loading={isLoading}>
            {!categories?.length ? <EmptyState message="No categories found." /> :
              categories.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-500 text-center w-16">{c.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {c.iconUrl && <img src={c.iconUrl} alt="" className="w-5 h-5 object-contain" />}
                      <span className="text-sm font-medium text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{c.description ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-center">{c.articleCount}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.isActive ? 'Active' : 'Inactive'} /></td>
                  {canManage && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-primary transition-colors"><Edit2 size={14} /></button>
                        {canDelete && <button onClick={() => { if (confirm('Delete category?')) deleteMutation.mutate(c.id) }}
                          className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </Table>
        </div>
      </div>

      <Modal title={editing ? 'Edit Category' : 'Add Category'} open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <Field label="Name"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Technology" /></Field>
          <Field label="Description"><input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." /></Field>
          <Field label="Icon URL (optional)"><input className="input" value={form.iconUrl} onChange={e => setForm(f => ({ ...f, iconUrl: e.target.value }))} placeholder="https://..." /></Field>
          <Field label="Sort Order"><input type="number" className="input" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: +e.target.value }))} /></Field>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
            <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="btn-primary flex-1">
              {saveMutation.isPending ? 'Saving...' : (editing ? 'Update' : 'Create')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
