import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Layers, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import { flashcardsApi, materialsApi } from '../services'
import { canDeleteStudyContent, canGenerateStudyContent } from '@/shared/auth/roles'
import { useAuthStore } from '@/shared/store/authStore'
import { Field, Modal, PageHeader } from '@/shared/components/ui'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function FlashcardsPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ materialId: '', title: '', count: 10 })
  const role = useAuthStore(s => s.user?.role)
  const canCreate = canGenerateStudyContent(role)
  const canDelete = canDeleteStudyContent(role)

  const { data: sets, isLoading } = useQuery({
    queryKey: ['flashcard-sets'], queryFn: () => flashcardsApi.getAll(),
  })
  const { data: materials } = useQuery({
    queryKey: ['materials-ready'],
    queryFn: () => materialsApi.getAll({ page: 1, pageSize: 100 }),
  })
  const ready = (materials?.items ?? []).filter(m => m.status === 'Ready')

  const generate = useMutation({
    mutationFn: flashcardsApi.generate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['flashcard-sets'] })
      toast.success('Flashcards generated')
      setOpen(false); setForm({ materialId: '', title: '', count: 10 })
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? 'Generation failed'),
  })

  const del = useMutation({
    mutationFn: flashcardsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['flashcard-sets'] }); toast.success('Set deleted') },
  })

  return (
    <div>
      <PageHeader title="Flashcards"
        subtitle={canCreate
          ? `${sets?.length ?? 0} sets · generated from your materials`
          : `${sets?.length ?? 0} sets · pick one to study`}
        action={canCreate ? (
          <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={14} /> Generate set
          </button>
        ) : undefined} />

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
        ) : !sets?.length ? (
          <div className="card p-10 text-center">
            <Layers size={28} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-sm font-semibold text-gray-700">No flashcard sets yet</h3>
            <p className="text-sm text-gray-500 mt-1">Generate one from a Ready material to begin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sets.map(s => (
              <div key={s.id} className="card p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Layers size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{s.title}</div>
                    <div className="text-xs text-gray-400 truncate">{s.materialTitle ?? 'Unattached'}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-4 flex items-center gap-3">
                  <span>{s.cardCount} cards</span>
                  <span>·</span>
                  <span>{formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="mt-auto flex gap-2">
                  <Link to={`/flashcards/${s.id}/study`} className="btn-primary flex-1 text-center text-xs py-2">Study</Link>
                  {canDelete && (
                    <button onClick={() => { if (confirm('Delete set?')) del.mutate(s.id) }}
                      className="btn-secondary px-3 py-2 text-gray-400 hover:text-red-500">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal title="Generate flashcards" open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Source material">
            <select className="input" value={form.materialId}
              onChange={e => setForm(f => ({ ...f, materialId: e.target.value }))}>
              <option value="">— pick a material —</option>
              {ready.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </Field>
          <Field label="Title (optional)">
            <input className="input" value={form.title} placeholder="e.g. Photosynthesis basics"
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </Field>
          <Field label={`Number of cards: ${form.count}`}>
            <input type="range" min={3} max={30} value={form.count}
              onChange={e => setForm(f => ({ ...f, count: +e.target.value }))} className="w-full" />
          </Field>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={() => generate.mutate({ materialId: form.materialId, title: form.title || undefined, count: form.count })}
              disabled={!form.materialId || generate.isPending}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              {generate.isPending ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {generate.isPending ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
