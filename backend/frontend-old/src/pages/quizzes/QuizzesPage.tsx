import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ClipboardList, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import { materialsApi, quizzesApi } from '../../api'
import { canDeleteStudyContent, canGenerateStudyContent } from '../../auth/roles'
import { useAuthStore } from '../../store/authStore'
import { Field, Modal, PageHeader } from '../../components/ui'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import type { QuizDifficulty } from '../../types'

const difficulties: QuizDifficulty[] = ['Easy', 'Medium', 'Hard']
const diffBadge: Record<QuizDifficulty, string> = { Easy: 'badge-green', Medium: 'badge-yellow', Hard: 'badge-red' }

export default function QuizzesPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{ materialId: string; title: string; count: number; difficulty: QuizDifficulty }>(
    { materialId: '', title: '', count: 10, difficulty: 'Medium' })
  const role = useAuthStore(s => s.user?.role)
  const canCreate = canGenerateStudyContent(role)
  const canDelete = canDeleteStudyContent(role)

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'], queryFn: () => quizzesApi.getAll(),
  })
  const { data: materials } = useQuery({
    queryKey: ['materials-ready'],
    queryFn: () => materialsApi.getAll({ page: 1, pageSize: 100 }),
  })
  const ready = (materials?.items ?? []).filter(m => m.status === 'Ready')

  const generate = useMutation({
    mutationFn: quizzesApi.generate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quizzes'] })
      toast.success('Quiz generated')
      setOpen(false); setForm({ materialId: '', title: '', count: 10, difficulty: 'Medium' })
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? 'Generation failed'),
  })

  const del = useMutation({
    mutationFn: quizzesApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quizzes'] }); toast.success('Quiz deleted') },
  })

  return (
    <div>
      <PageHeader title="Quizzes"
        subtitle={canCreate
          ? `${quizzes?.length ?? 0} quizzes · auto-generated multiple choice`
          : `${quizzes?.length ?? 0} quizzes · pick one to test yourself`}
        action={canCreate ? (
          <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={14} /> Generate quiz
          </button>
        ) : undefined} />

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
        ) : !quizzes?.length ? (
          <div className="card p-10 text-center">
            <ClipboardList size={28} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-sm font-semibold text-gray-700">No quizzes yet</h3>
            <p className="text-sm text-gray-500 mt-1">Generate one from a Ready material to begin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map(q => (
              <div key={q.id} className="card p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <ClipboardList size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{q.title}</div>
                    <div className="text-xs text-gray-400 truncate">{q.materialTitle ?? 'Unattached'}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-4 flex items-center gap-2 flex-wrap">
                  <span className={diffBadge[q.difficulty]}>{q.difficulty}</span>
                  <span>·</span>
                  <span>{q.questionCount} questions</span>
                  <span>·</span>
                  <span>{q.attemptCount} attempt{q.attemptCount === 1 ? '' : 's'}</span>
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                </div>
                <div className="mt-auto flex gap-2">
                  <Link to={`/quizzes/${q.id}/take`} className="btn-primary flex-1 text-center text-xs py-2">Take quiz</Link>
                  {canDelete && (
                    <button onClick={() => { if (confirm('Delete quiz?')) del.mutate(q.id) }}
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

      <Modal title="Generate quiz" open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Source material">
            <select className="input" value={form.materialId}
              onChange={e => setForm(f => ({ ...f, materialId: e.target.value }))}>
              <option value="">— pick a material —</option>
              {ready.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </Field>
          <Field label="Title (optional)">
            <input className="input" value={form.title} placeholder="e.g. Mid-term practice"
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Difficulty">
              <select className="input" value={form.difficulty}
                onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as QuizDifficulty }))}>
                {difficulties.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label={`Questions: ${form.count}`}>
              <input type="range" min={3} max={25} value={form.count}
                onChange={e => setForm(f => ({ ...f, count: +e.target.value }))} className="w-full" />
            </Field>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={() => generate.mutate({
              materialId: form.materialId, title: form.title || undefined,
              count: form.count, difficulty: form.difficulty
            })} disabled={!form.materialId || generate.isPending}
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
