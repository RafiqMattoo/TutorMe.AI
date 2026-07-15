import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, Send, Trash2 } from 'lucide-react'
import { deliveriesApi, flashcardsApi, materialsApi, quizzesApi } from '../services'
import { canGenerateStudyContent } from '@/shared/auth/roles'
import { useAuthStore } from '@/shared/store/authStore'
import { Field, Modal, PageHeader } from '@/shared/components/ui'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

type Form = {
  title: string; instructions: string; scheduledDate: string; gradeLevel: string
  materialId: string; quizId: string; flashcardSetId: string
}
const emptyForm = (): Form => ({
  title: '', instructions: '', scheduledDate: localToday(), gradeLevel: '',
  materialId: '', quizId: '', flashcardSetId: '',
})

export default function DeliveriesPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Form>(emptyForm())
  const role = useAuthStore(s => s.user?.role)
  const canManage = canGenerateStudyContent(role)

  const { data: deliveries, isLoading } = useQuery({
    queryKey: ['deliveries'], queryFn: () => deliveriesApi.getAll(),
  })
  const { data: materials } = useQuery({
    queryKey: ['materials-ready'],
    queryFn: () => materialsApi.getAll({ page: 1, pageSize: 100 }),
  })
  const { data: quizzes } = useQuery({ queryKey: ['quizzes'], queryFn: () => quizzesApi.getAll() })
  const { data: flashcards } = useQuery({ queryKey: ['flashcards'], queryFn: () => flashcardsApi.getAll() })
  const readyMaterials = (materials?.items ?? []).filter(m => m.status === 'Ready')

  const create = useMutation({
    mutationFn: deliveriesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries'] })
      qc.invalidateQueries({ queryKey: ['deliveries-today'] })
      toast.success('Delivered to students')
      setOpen(false); setForm(emptyForm())
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? 'Could not create delivery'),
  })

  const del = useMutation({
    mutationFn: deliveriesApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['deliveries'] }); toast.success('Delivery removed') },
  })

  const hasContent = !!(form.materialId || form.quizId || form.flashcardSetId)
  const canSubmit = form.title.trim() && form.scheduledDate && hasContent && !create.isPending

  const submit = () => create.mutate({
    title: form.title.trim(),
    instructions: form.instructions.trim() || undefined,
    scheduledDate: form.scheduledDate,
    gradeLevel: form.gradeLevel.trim() || undefined,
    materialId: form.materialId || undefined,
    quizId: form.quizId || undefined,
    flashcardSetId: form.flashcardSetId || undefined,
  })

  return (
    <div>
      <PageHeader title="Deliveries"
        subtitle={`${deliveries?.length ?? 0} scheduled · assign daily reading & practice to students`}
        action={canManage ? (
          <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={14} /> New delivery
          </button>
        ) : undefined} />

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
        ) : !deliveries?.length ? (
          <div className="card p-10 text-center">
            <Send size={28} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-sm font-semibold text-gray-700">No deliveries yet</h3>
            <p className="text-sm text-gray-500 mt-1">Create one to put a lesson on students' "Today" page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveries.map(d => (
              <div key={d.id} className="card p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-sm font-semibold text-gray-900">{d.title}</div>
                  {canManage && (
                    <button onClick={() => { if (confirm('Remove this delivery?')) del.mutate(d.id) }}
                      className="text-gray-300 hover:text-red-500 flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  {format(new Date(d.scheduledDate), 'd MMM yyyy')}
                  {d.gradeLevel ? ` · ${d.gradeLevel}` : ''}
                </div>
                {d.instructions && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{d.instructions}</p>
                )}
                <div className="mt-auto flex flex-wrap gap-1.5 text-[11px]">
                  {d.materialTitle && <span className="badge-blue">📖 {d.materialTitle}</span>}
                  {d.quizTitle && <span className="badge-green">📝 Quiz</span>}
                  {d.flashcardSetTitle && <span className="badge-yellow">🃏 Cards</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal title="New delivery" open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Title">
            <input className="input" value={form.title} placeholder="e.g. Chapter 3 — Photosynthesis"
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Deliver on">
              <input type="date" className="input" value={form.scheduledDate}
                onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))} />
            </Field>
            <Field label="Grade / class (optional)">
              <input className="input" value={form.gradeLevel} placeholder="e.g. Grade 8"
                onChange={e => setForm(f => ({ ...f, gradeLevel: e.target.value }))} />
            </Field>
          </div>

          <Field label="Reading material (optional)">
            <select className="input" value={form.materialId}
              onChange={e => setForm(f => ({ ...f, materialId: e.target.value }))}>
              <option value="">— none —</option>
              {readyMaterials.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </Field>
          <Field label="Practice quiz (optional)">
            <select className="input" value={form.quizId}
              onChange={e => setForm(f => ({ ...f, quizId: e.target.value }))}>
              <option value="">— none —</option>
              {(quizzes ?? []).map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
            </select>
          </Field>
          <Field label="Flashcards (optional)">
            <select className="input" value={form.flashcardSetId}
              onChange={e => setForm(f => ({ ...f, flashcardSetId: e.target.value }))}>
              <option value="">— none —</option>
              {(flashcards ?? []).map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </Field>
          <Field label="Instructions for students (optional)">
            <textarea className="input" rows={3} value={form.instructions}
              placeholder="e.g. Read pages 20–28, then attempt the quiz."
              onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} />
          </Field>

          {!hasContent && (
            <p className="text-xs text-amber-600">Attach at least one of: material, quiz, or flashcards.</p>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={submit} disabled={!canSubmit}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              {create.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {create.isPending ? 'Delivering…' : 'Deliver'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
