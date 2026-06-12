import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Edit2, CalendarDays, GraduationCap, Boxes, BookMarked, Home } from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { academicsApi } from '../../api'
import { EmptyState, Field, Modal, PageHeader, StatusBadge, Table } from '../../components/ui'
import { useAuthStore } from '../../store/authStore'
import type { SchoolStage } from '../../types'

const STAGES: SchoolStage[] = ['Foundational', 'Preparatory', 'Middle', 'Secondary']
const TABS = [
  { key: 'classes', label: 'Classes', icon: GraduationCap },
  { key: 'sections', label: 'Sections', icon: Boxes },
  { key: 'subjects', label: 'Subjects', icon: BookMarked },
  { key: 'houses', label: 'Houses', icon: Home },
  { key: 'years', label: 'Academic Years', icon: CalendarDays },
] as const
type TabKey = typeof TABS[number]['key']

export default function AcademicStructurePage() {
  const [tab, setTab] = useState<TabKey>('classes')
  return (
    <div>
      <PageHeader title="Academic Structure" subtitle="The NEP-aligned backbone: classes, sections, subjects, houses & academic years" />
      <div className="px-6 pt-4">
        <div className="flex flex-wrap gap-1 border-b border-gray-100">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={clsx('flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
                tab === t.key ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-800')}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {tab === 'classes' && <ClassesTab />}
        {tab === 'sections' && <SectionsTab />}
        {tab === 'subjects' && <SubjectsTab />}
        {tab === 'houses' && <HousesTab />}
        {tab === 'years' && <YearsTab />}
      </div>
    </div>
  )
}

function useSchoolId() { return useAuthStore(s => s.user?.schoolId) }

// ── Classes ────────────────────────────────────────────────────────
function ClassesTab() {
  const sid = useSchoolId(); const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', stage: 'Foundational' as SchoolStage, level: 0 })

  const { data, isLoading } = useQuery({ queryKey: ['classes', sid], queryFn: () => academicsApi.classes(sid) })
  const save = useMutation({
    mutationFn: () => academicsApi.saveClass({ ...form, schoolId: sid }, editId ?? undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['classes'] }); toast.success('Saved'); setOpen(false) },
    onError: () => toast.error('Failed to save class'),
  })
  const del = useMutation({
    mutationFn: (id: string) => academicsApi.deleteClass(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['classes'] }); toast.success('Deleted') },
  })

  const create = () => { setEditId(null); setForm({ name: '', stage: 'Foundational', level: 0 }); setOpen(true) }
  return (
    <>
      <div className="mb-3 flex justify-end">
        <button onClick={create} className="btn-primary flex items-center gap-2"><Plus size={14} />Add Class</button>
      </div>
      <div className="card">
        <Table headers={['Level', 'Name', 'NEP Stage', 'Sections', 'Actions']} loading={isLoading}>
          {!data?.length ? <EmptyState message="No classes yet. Add your first grade." /> :
            data.map(c => (
              <tr key={c.id} className="transition-colors hover:bg-gray-50/50">
                <td className="w-16 px-4 py-3 text-center text-sm text-gray-500">{c.level}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3"><StatusBadge status={c.stage} /></td>
                <td className="px-4 py-3 text-center text-sm text-gray-500">{c.sectionCount}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditId(c.id); setForm({ name: c.name, stage: c.stage, level: c.level }); setOpen(true) }}
                      className="text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete class?')) del.mutate(c.id) }}
                      className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
        </Table>
      </div>
      <Modal title={editId ? 'Edit Class' : 'Add Class'} open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Name"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Grade 5 / Balvatika" /></Field>
          <Field label="NEP Stage">
            <select className="input" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value as SchoolStage }))}>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Level (ordering / promotion, e.g. 0 = Balvatika … 12 = Grade 12)">
            <input type="number" className="input" value={form.level} onChange={e => setForm(f => ({ ...f, level: +e.target.value }))} />
          </Field>
          <FormActions editing={!!editId} pending={save.isPending} onCancel={() => setOpen(false)} onSave={() => save.mutate()} />
        </div>
      </Modal>
    </>
  )
}

// ── Sections ───────────────────────────────────────────────────────
function SectionsTab() {
  const sid = useSchoolId(); const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ schoolClassId: '', name: '', capacity: 40, classTeacherId: '' })

  const { data: classes } = useQuery({ queryKey: ['classes', sid], queryFn: () => academicsApi.classes(sid) })
  const { data, isLoading } = useQuery({ queryKey: ['sections', sid], queryFn: () => academicsApi.sections(sid) })
  const save = useMutation({
    mutationFn: () => academicsApi.saveSection({ ...form, classTeacherId: form.classTeacherId || undefined }, editId ?? undefined, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sections'] }); toast.success('Saved'); setOpen(false) },
    onError: () => toast.error('Failed to save section'),
  })
  const del = useMutation({
    mutationFn: (id: string) => academicsApi.deleteSection(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sections'] }); toast.success('Deleted') },
  })
  const create = () => { setEditId(null); setForm({ schoolClassId: classes?.[0]?.id ?? '', name: '', capacity: 40, classTeacherId: '' }); setOpen(true) }
  return (
    <>
      <div className="mb-3 flex justify-end">
        <button onClick={create} disabled={!classes?.length} className="btn-primary flex items-center gap-2 disabled:opacity-50"><Plus size={14} />Add Section</button>
      </div>
      {!classes?.length && <p className="mb-3 text-sm text-amber-600">Add a class first — sections belong to a class.</p>}
      <div className="card">
        <Table headers={['Class', 'Section', 'Capacity', 'Class Teacher', 'Actions']} loading={isLoading}>
          {!data?.length ? <EmptyState message="No sections yet." /> :
            data.map(s => (
              <tr key={s.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.schoolClassName}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{s.name}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-500">{s.capacity}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{s.classTeacherName ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditId(s.id); setForm({ schoolClassId: s.schoolClassId, name: s.name, capacity: s.capacity, classTeacherId: s.classTeacherId ?? '' }); setOpen(true) }}
                      className="text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete section?')) del.mutate(s.id) }}
                      className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
        </Table>
      </div>
      <Modal title={editId ? 'Edit Section' : 'Add Section'} open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Class">
            <select className="input" value={form.schoolClassId} onChange={e => setForm(f => ({ ...f, schoolClassId: e.target.value }))}>
              {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Section Name"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. A" /></Field>
          <Field label="Capacity"><input type="number" className="input" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: +e.target.value }))} /></Field>
          <FormActions editing={!!editId} pending={save.isPending} onCancel={() => setOpen(false)} onSave={() => save.mutate()} />
        </div>
      </Modal>
    </>
  )
}

// ── Subjects ───────────────────────────────────────────────────────
function SubjectsTab() {
  const sid = useSchoolId(); const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', code: '', mediumOfInstruction: '', isLanguage: false, isCoScholastic: false })

  const { data, isLoading } = useQuery({ queryKey: ['subjects', sid], queryFn: () => academicsApi.subjects(sid) })
  const save = useMutation({
    mutationFn: () => academicsApi.saveSubject({ ...form, schoolId: sid }, editId ?? undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subjects'] }); toast.success('Saved'); setOpen(false) },
    onError: () => toast.error('Failed to save subject'),
  })
  const del = useMutation({
    mutationFn: (id: string) => academicsApi.deleteSubject(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subjects'] }); toast.success('Deleted') },
  })
  const create = () => { setEditId(null); setForm({ name: '', code: '', mediumOfInstruction: '', isLanguage: false, isCoScholastic: false }); setOpen(true) }
  return (
    <>
      <div className="mb-3 flex justify-end">
        <button onClick={create} className="btn-primary flex items-center gap-2"><Plus size={14} />Add Subject</button>
      </div>
      <div className="card">
        <Table headers={['Name', 'Code', 'Medium', 'Type', 'Actions']} loading={isLoading}>
          {!data?.length ? <EmptyState message="No subjects yet." /> :
            data.map(s => (
              <tr key={s.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{s.code ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{s.mediumOfInstruction ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {s.isLanguage && <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-600">Language</span>}
                    {s.isCoScholastic && <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-600">Co-scholastic</span>}
                    {!s.isLanguage && !s.isCoScholastic && <span className="text-sm text-gray-400">Scholastic</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditId(s.id); setForm({ name: s.name, code: s.code ?? '', mediumOfInstruction: s.mediumOfInstruction ?? '', isLanguage: s.isLanguage, isCoScholastic: s.isCoScholastic }); setOpen(true) }}
                      className="text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete subject?')) del.mutate(s.id) }}
                      className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
        </Table>
      </div>
      <Modal title={editId ? 'Edit Subject' : 'Add Subject'} open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Name"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Mathematics" /></Field>
          <Field label="Code (optional)"><input className="input" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. MAT" /></Field>
          <Field label="Medium of Instruction (optional)"><input className="input" value={form.mediumOfInstruction} onChange={e => setForm(f => ({ ...f, mediumOfInstruction: e.target.value }))} placeholder="e.g. Hindi / English" /></Field>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded" checked={form.isLanguage} onChange={e => setForm(f => ({ ...f, isLanguage: e.target.checked }))} /> Language (3-language formula)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="rounded" checked={form.isCoScholastic} onChange={e => setForm(f => ({ ...f, isCoScholastic: e.target.checked }))} /> Co-scholastic
            </label>
          </div>
          <FormActions editing={!!editId} pending={save.isPending} onCancel={() => setOpen(false)} onSave={() => save.mutate()} />
        </div>
      </Modal>
    </>
  )
}

// ── Houses ─────────────────────────────────────────────────────────
function HousesTab() {
  const sid = useSchoolId(); const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', colorHex: '#2563eb' })

  const { data, isLoading } = useQuery({ queryKey: ['houses', sid], queryFn: () => academicsApi.houses(sid) })
  const save = useMutation({
    mutationFn: () => academicsApi.saveHouse({ ...form, schoolId: sid }, editId ?? undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['houses'] }); toast.success('Saved'); setOpen(false) },
    onError: () => toast.error('Failed to save house'),
  })
  const del = useMutation({
    mutationFn: (id: string) => academicsApi.deleteHouse(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['houses'] }); toast.success('Deleted') },
  })
  const create = () => { setEditId(null); setForm({ name: '', colorHex: '#2563eb' }); setOpen(true) }
  return (
    <>
      <div className="mb-3 flex justify-end">
        <button onClick={create} className="btn-primary flex items-center gap-2"><Plus size={14} />Add House</button>
      </div>
      <div className="card">
        <Table headers={['Colour', 'Name', 'House Master', 'Actions']} loading={isLoading}>
          {!data?.length ? <EmptyState message="No houses yet." /> :
            data.map(h => (
              <tr key={h.id} className="transition-colors hover:bg-gray-50/50">
                <td className="w-16 px-4 py-3"><span className="inline-block h-5 w-5 rounded-full border border-gray-200" style={{ background: h.colorHex ?? '#ccc' }} /></td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{h.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{h.houseMasterName ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditId(h.id); setForm({ name: h.name, colorHex: h.colorHex ?? '#2563eb' }); setOpen(true) }}
                      className="text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete house?')) del.mutate(h.id) }}
                      className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
        </Table>
      </div>
      <Modal title={editId ? 'Edit House' : 'Add House'} open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Name"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Red House" /></Field>
          <Field label="Colour">
            <input type="color" className="h-10 w-20 cursor-pointer rounded border border-gray-200" value={form.colorHex} onChange={e => setForm(f => ({ ...f, colorHex: e.target.value }))} />
          </Field>
          <FormActions editing={!!editId} pending={save.isPending} onCancel={() => setOpen(false)} onSave={() => save.mutate()} />
        </div>
      </Modal>
    </>
  )
}

// ── Academic Years ─────────────────────────────────────────────────
function YearsTab() {
  const sid = useSchoolId(); const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', isCurrent: false })

  const { data, isLoading } = useQuery({ queryKey: ['years', sid], queryFn: () => academicsApi.years(sid) })
  const save = useMutation({
    mutationFn: () => academicsApi.saveYear({ ...form, schoolId: sid }, editId ?? undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['years'] }); toast.success('Saved'); setOpen(false) },
    onError: () => toast.error('Failed to save academic year'),
  })
  const del = useMutation({
    mutationFn: (id: string) => academicsApi.deleteYear(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['years'] }); toast.success('Deleted') },
  })
  const create = () => { setEditId(null); setForm({ name: '', startDate: '', endDate: '', isCurrent: false }); setOpen(true) }
  return (
    <>
      <div className="mb-3 flex justify-end">
        <button onClick={create} className="btn-primary flex items-center gap-2"><Plus size={14} />Add Academic Year</button>
      </div>
      <div className="card">
        <Table headers={['Name', 'Start', 'End', 'Terms', 'Current', 'Actions']} loading={isLoading}>
          {!data?.length ? <EmptyState message="No academic years yet." /> :
            data.map(y => (
              <tr key={y.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{y.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{y.startDate?.slice(0, 10)}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{y.endDate?.slice(0, 10)}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-500">{y.terms.length}</td>
                <td className="px-4 py-3">{y.isCurrent ? <StatusBadge status="Active" /> : <span className="text-sm text-gray-400">—</span>}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditId(y.id); setForm({ name: y.name, startDate: y.startDate?.slice(0, 10) ?? '', endDate: y.endDate?.slice(0, 10) ?? '', isCurrent: y.isCurrent }); setOpen(true) }}
                      className="text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete academic year?')) del.mutate(y.id) }}
                      className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
        </Table>
      </div>
      <Modal title={editId ? 'Edit Academic Year' : 'Add Academic Year'} open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Name"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. 2025-26" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date"><input type="date" className="input" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></Field>
            <Field label="End Date"><input type="date" className="input" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" className="rounded" checked={form.isCurrent} onChange={e => setForm(f => ({ ...f, isCurrent: e.target.checked }))} /> Set as current academic year
          </label>
          <FormActions editing={!!editId} pending={save.isPending} onCancel={() => setOpen(false)} onSave={() => save.mutate()} />
        </div>
      </Modal>
    </>
  )
}

function FormActions({ editing, pending, onCancel, onSave }: { editing: boolean; pending: boolean; onCancel: () => void; onSave: () => void }) {
  return (
    <div className="flex gap-3 pt-2">
      <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
      <button onClick={onSave} disabled={pending} className="btn-primary flex-1">{pending ? 'Saving…' : editing ? 'Update' : 'Create'}</button>
    </div>
  )
}
