import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Clock, FileText, GraduationCap, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import { lessonPlansApi, materialsApi } from '../../api'
import { canDeleteStudyContent, canGenerateStudyContent } from '../../auth/roles'
import { useAuthStore } from '../../store/authStore'
import { Field, Modal, PageHeader } from '../../components/ui'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function LessonPlansPage() {
  const qc = useQueryClient()
  const role = useAuthStore(s => s.user?.role)
  const canCreate = canGenerateStudyContent(role)
  const canDelete = canDeleteStudyContent(role)

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ materialId: '', title: '', subject: '', gradeLevel: '', durationMinutes: 60 })

  const { data: plans, isLoading } = useQuery({
    queryKey: ['lesson-plans'], queryFn: () => lessonPlansApi.getAll(),
  })
  const { data: materials } = useQuery({
    queryKey: ['materials-ready'],
    queryFn: () => materialsApi.getAll({ page: 1, pageSize: 100 }),
  })
  const ready = (materials?.items ?? []).filter(m => m.status === 'Ready')

  const generate = useMutation({
    mutationFn: lessonPlansApi.generate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lesson-plans'] })
      toast.success('Lesson plan generated')
      setOpen(false)
      setForm({ materialId: '', title: '', subject: '', gradeLevel: '', durationMinutes: 60 })
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? 'Generation failed'),
  })

  const del = useMutation({
    mutationFn: lessonPlansApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lesson-plans'] }); toast.success('Plan deleted') },
  })

  return (
    <div>
      <PageHeader title="Lesson Plans"
        subtitle={canCreate
          ? `${plans?.length ?? 0} plans · structured class plans from your materials`
          : `${plans?.length ?? 0} plans · pick one to read`}
        action={canCreate ? (
          <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={14} /> Generate plan
          </button>
        ) : undefined} />

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
        ) : !plans?.length ? (
          <div className="card p-10 text-center">
            <GraduationCap size={28} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-sm font-semibold text-gray-700">No lesson plans yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              {canCreate ? 'Generate one from a Ready material to begin.' : 'A teacher hasn\'t generated any yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map(p => (
              <div key={p.id} className="card p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{p.title}</div>
                    <div className="text-xs text-gray-400 truncate flex items-center gap-1">
                      <FileText size={10} />{p.materialTitle ?? 'Unattached'}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-4 flex items-center gap-2 flex-wrap">
                  {p.subject && <span className="badge-blue">{p.subject}</span>}
                  {p.gradeLevel && <span className="badge-gray">{p.gradeLevel}</span>}
                  <span className="inline-flex items-center gap-1 text-gray-500">
                    <Clock size={11} /> {p.durationMinutes} min
                  </span>
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  by {p.createdByName} · {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                </div>
                <div className="mt-auto flex gap-2">
                  <Link to={`/lesson-plans/${p.id}`} className="btn-primary flex-1 text-center text-xs py-2">Open</Link>
                  {canDelete && (
                    <button onClick={() => { if (confirm('Delete plan?')) del.mutate(p.id) }}
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

      <Modal title="Generate lesson plan" open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Source material">
            <select className="input" value={form.materialId}
              onChange={e => setForm(f => ({ ...f, materialId: e.target.value }))}>
              <option value="">— pick a material —</option>
              {ready.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </Field>
          <Field label="Title (optional)">
            <input className="input" value={form.title} placeholder="e.g. Intro to RAG systems"
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Subject (optional)">
              <input className="input" value={form.subject} placeholder="e.g. Computer Science"
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
            </Field>
            <Field label="Grade level (optional)">
              <input className="input" value={form.gradeLevel} placeholder="e.g. Grade 11"
                onChange={e => setForm(f => ({ ...f, gradeLevel: e.target.value }))} />
            </Field>
          </div>
          <Field label={`Duration: ${form.durationMinutes} min`}>
            <input type="range" min={15} max={180} step={15} value={form.durationMinutes}
              onChange={e => setForm(f => ({ ...f, durationMinutes: +e.target.value }))} className="w-full" />
          </Field>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={() => generate.mutate({
              materialId: form.materialId,
              title: form.title || undefined,
              subject: form.subject || undefined,
              gradeLevel: form.gradeLevel || undefined,
              durationMinutes: form.durationMinutes,
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
