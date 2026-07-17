import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Edit2, CalendarDays, GraduationCap, Boxes, BookMarked, Home, Layers, Network, Award } from 'lucide-react'
import toast from 'react-hot-toast'
import { academicsApi } from '../services'
import { EmptyState, Field, Modal, PageHeader, StatusBadge, Table, Tabs } from '../../../shared/components/ui/index.tsx'
import { useAuthStore } from '../../../shared/store/authStore.ts'
import type { BoardType, SchoolStage } from '../../../shared/types/index.ts'

const STAGES: SchoolStage[] = ['Foundational', 'Preparatory', 'Middle', 'Secondary']
const BOARDS: BoardType[] = ['CBSE', 'ICSE', 'JKBOSE', 'StateBoard', 'IGCSE', 'Other']
const TABS = [
  { key: 'classes', label: 'Classes', icon: GraduationCap },
  { key: 'sections', label: 'Sections', icon: Boxes },
  { key: 'subjects', label: 'Subjects', icon: BookMarked },
  { key: 'allocations', label: 'Subject–Teacher', icon: Network },
  { key: 'streams', label: 'Streams', icon: Layers },
  { key: 'houses', label: 'Houses', icon: Home },
  { key: 'grading', label: 'Grading Scales', icon: Award },
  { key: 'years', label: 'Academic Years', icon: CalendarDays },
] as const
type TabKey = typeof TABS[number]['key']

export default function AcademicStructurePage() {
  const [tab, setTab] = useState<TabKey>('classes')
  return (
    <div>
      <PageHeader title="Academic Structure" subtitle="The NEP-aligned backbone: classes, sections, subjects, houses & academic years" />
      <div className="px-5 pt-5 lg:px-8">
        <Tabs tabs={TABS} active={tab} onChange={setTab} fullWidth />
      </div>
      <div className="p-5 lg:p-8">
        {tab === 'classes' && <ClassesTab />}
        {tab === 'sections' && <SectionsTab />}
        {tab === 'subjects' && <SubjectsTab />}
        {tab === 'allocations' && <AllocationsTab />}
        {tab === 'streams' && <StreamsTab />}
        {tab === 'houses' && <HousesTab />}
        {tab === 'grading' && <GradingTab />}
        {tab === 'years' && <YearsTab />}
      </div>
    </div>
  )
}

function useSchoolId() { return useAuthStore(s => s.user?.schoolId) }
function useTeachers(sid?: string) {
  return useQuery({ queryKey: ['teachers', sid], queryFn: () => academicsApi.teachers(sid) })
}

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
  const [form, setForm] = useState({ schoolClassId: '', name: '', capacity: 40, classTeacherId: '', streamId: '' })

  const { data: classes } = useQuery({ queryKey: ['classes', sid], queryFn: () => academicsApi.classes(sid) })
  const { data: streams } = useQuery({ queryKey: ['streams', sid], queryFn: () => academicsApi.streams(sid) })
  const { data: teachers } = useTeachers(sid)
  const { data, isLoading } = useQuery({ queryKey: ['sections', sid], queryFn: () => academicsApi.sections(sid) })
  const save = useMutation({
    mutationFn: () => academicsApi.saveSection(
      { ...form, classTeacherId: form.classTeacherId || undefined, streamId: form.streamId || undefined }, editId ?? undefined, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sections'] }); toast.success('Saved'); setOpen(false) },
    onError: () => toast.error('Failed to save section'),
  })
  const del = useMutation({
    mutationFn: (id: string) => academicsApi.deleteSection(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sections'] }); toast.success('Deleted') },
  })
  const create = () => { setEditId(null); setForm({ schoolClassId: classes?.[0]?.id ?? '', name: '', capacity: 40, classTeacherId: '', streamId: '' }); setOpen(true) }
  return (
    <>
      <div className="mb-3 flex justify-end">
        <button onClick={create} disabled={!classes?.length} className="btn-primary flex items-center gap-2 disabled:opacity-50"><Plus size={14} />Add Section</button>
      </div>
      {!classes?.length && <p className="mb-3 text-sm text-amber-600">Add a class first — sections belong to a class.</p>}
      <div className="card">
        <Table headers={['Class', 'Section', 'Stream', 'Capacity', 'Class Teacher', 'Actions']} loading={isLoading}>
          {!data?.length ? <EmptyState message="No sections yet." /> :
            data.map(s => (
              <tr key={s.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.schoolClassName}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{s.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{s.streamName ?? '—'}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-500">{s.capacity}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{s.classTeacherName ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditId(s.id); setForm({ schoolClassId: s.schoolClassId, name: s.name, capacity: s.capacity, classTeacherId: s.classTeacherId ?? '', streamId: s.streamId ?? '' }); setOpen(true) }}
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
          <div className="grid grid-cols-2 gap-3">
            <Field label="Capacity"><input type="number" className="input" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: +e.target.value }))} /></Field>
            <Field label="Stream (optional)">
              <select className="input" value={form.streamId} onChange={e => setForm(f => ({ ...f, streamId: e.target.value }))}>
                <option value="">— None —</option>
                {streams?.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Class Teacher (optional)">
            <select className="input" value={form.classTeacherId} onChange={e => setForm(f => ({ ...f, classTeacherId: e.target.value }))}>
              <option value="">— Unassigned —</option>
              {teachers?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
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
  const [form, setForm] = useState({ name: '', colorHex: '#2563eb', houseMasterId: '' })

  const { data: teachers } = useTeachers(sid)
  const { data, isLoading } = useQuery({ queryKey: ['houses', sid], queryFn: () => academicsApi.houses(sid) })
  const save = useMutation({
    mutationFn: () => academicsApi.saveHouse({ ...form, houseMasterId: form.houseMasterId || undefined, schoolId: sid }, editId ?? undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['houses'] }); toast.success('Saved'); setOpen(false) },
    onError: () => toast.error('Failed to save house'),
  })
  const del = useMutation({
    mutationFn: (id: string) => academicsApi.deleteHouse(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['houses'] }); toast.success('Deleted') },
  })
  const create = () => { setEditId(null); setForm({ name: '', colorHex: '#2563eb', houseMasterId: '' }); setOpen(true) }
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
                    <button onClick={() => { setEditId(h.id); setForm({ name: h.name, colorHex: h.colorHex ?? '#2563eb', houseMasterId: h.houseMasterId ?? '' }); setOpen(true) }}
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
          <Field label="House Master (optional)">
            <select className="input" value={form.houseMasterId} onChange={e => setForm(f => ({ ...f, houseMasterId: e.target.value }))}>
              <option value="">— Unassigned —</option>
              {teachers?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
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

// ── Streams ────────────────────────────────────────────────────────
function StreamsTab() {
  const sid = useSchoolId(); const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', code: '' })

  const { data, isLoading } = useQuery({ queryKey: ['streams', sid], queryFn: () => academicsApi.streams(sid) })
  const save = useMutation({
    mutationFn: () => academicsApi.saveStream({ ...form, schoolId: sid }, editId ?? undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['streams'] }); toast.success('Saved'); setOpen(false) },
    onError: () => toast.error('Failed to save stream'),
  })
  const del = useMutation({
    mutationFn: (id: string) => academicsApi.deleteStream(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['streams'] }); toast.success('Deleted') },
  })
  const create = () => { setEditId(null); setForm({ name: '', code: '' }); setOpen(true) }
  return (
    <>
      <div className="mb-3 flex justify-end">
        <button onClick={create} className="btn-primary flex items-center gap-2"><Plus size={14} />Add Stream</button>
      </div>
      <div className="card">
        <Table headers={['Name', 'Code', 'Actions']} loading={isLoading}>
          {!data?.length ? <EmptyState message="No streams yet. Add Science, Commerce, Humanities…" /> :
            data.map(s => (
              <tr key={s.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{s.code ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditId(s.id); setForm({ name: s.name, code: s.code ?? '' }); setOpen(true) }}
                      className="text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete stream?')) del.mutate(s.id) }}
                      className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
        </Table>
      </div>
      <Modal title={editId ? 'Edit Stream' : 'Add Stream'} open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Name"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Science" /></Field>
          <Field label="Code (optional)"><input className="input" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. SCI" /></Field>
          <FormActions editing={!!editId} pending={save.isPending} onCancel={() => setOpen(false)} onSave={() => save.mutate()} />
        </div>
      </Modal>
    </>
  )
}

// ── Subject–Teacher allocations ────────────────────────────────────
function AllocationsTab() {
  const sid = useSchoolId(); const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ subjectId: '', schoolClassId: '', sectionId: '', teacherId: '' })

  const { data: subjects } = useQuery({ queryKey: ['subjects', sid], queryFn: () => academicsApi.subjects(sid) })
  const { data: classes } = useQuery({ queryKey: ['classes', sid], queryFn: () => academicsApi.classes(sid) })
  const { data: sections } = useQuery({ queryKey: ['sections', sid], queryFn: () => academicsApi.sections(sid) })
  const { data: teachers } = useTeachers(sid)
  const { data, isLoading } = useQuery({ queryKey: ['allocations', sid], queryFn: () => academicsApi.allocations(sid) })
  const ready = !!subjects?.length && !!classes?.length && !!teachers?.length

  const save = useMutation({
    mutationFn: () => academicsApi.saveAllocation(
      { ...form, sectionId: form.sectionId || undefined, schoolId: sid }, editId ?? undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['allocations'] }); toast.success('Saved'); setOpen(false) },
    onError: () => toast.error('Failed to save allocation'),
  })
  const del = useMutation({
    mutationFn: (id: string) => academicsApi.deleteAllocation(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['allocations'] }); toast.success('Deleted') },
  })
  const create = () => { setEditId(null); setForm({ subjectId: subjects?.[0]?.id ?? '', schoolClassId: classes?.[0]?.id ?? '', sectionId: '', teacherId: teachers?.[0]?.id ?? '' }); setOpen(true) }
  const sectionsForClass = sections?.filter(s => s.schoolClassId === form.schoolClassId)
  return (
    <>
      <div className="mb-3 flex justify-end">
        <button onClick={create} disabled={!ready} className="btn-primary flex items-center gap-2 disabled:opacity-50"><Plus size={14} />Assign Subject</button>
      </div>
      {!ready && <p className="mb-3 text-sm text-amber-600">Add at least one subject, class and teacher first.</p>}
      <div className="card">
        <Table headers={['Class', 'Section', 'Subject', 'Teacher', 'Actions']} loading={isLoading}>
          {!data?.length ? <EmptyState message="No subject allocations yet." /> :
            data.map(a => (
              <tr key={a.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.schoolClassName}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{a.sectionName ?? 'All sections'}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{a.subjectName}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{a.teacherName}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditId(a.id); setForm({ subjectId: a.subjectId, schoolClassId: a.schoolClassId, sectionId: a.sectionId ?? '', teacherId: a.teacherId }); setOpen(true) }}
                      className="text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete allocation?')) del.mutate(a.id) }}
                      className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
        </Table>
      </div>
      <Modal title={editId ? 'Edit Allocation' : 'Assign Subject to Teacher'} open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Class">
            <select className="input" value={form.schoolClassId} onChange={e => setForm(f => ({ ...f, schoolClassId: e.target.value, sectionId: '' }))}>
              {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Section (optional — leave blank for the whole class)">
            <select className="input" value={form.sectionId} onChange={e => setForm(f => ({ ...f, sectionId: e.target.value }))}>
              <option value="">All sections</option>
              {sectionsForClass?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Subject">
            <select className="input" value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}>
              {subjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Teacher">
            <select className="input" value={form.teacherId} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))}>
              {teachers?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
          <FormActions editing={!!editId} pending={save.isPending} onCancel={() => setOpen(false)} onSave={() => save.mutate()} />
        </div>
      </Modal>
    </>
  )
}

// ── Grading Scales (+ bands) ───────────────────────────────────────
function GradingTab() {
  const sid = useSchoolId(); const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', board: '' as '' | BoardType, isDefault: false })
  const [bandFor, setBandFor] = useState<string | null>(null)
  const [band, setBand] = useState({ grade: '', minPercent: 0, maxPercent: 0, gradePoint: '' as string, description: '' })

  const { data, isLoading } = useQuery({ queryKey: ['grading', sid], queryFn: () => academicsApi.gradingScales(sid) })
  const save = useMutation({
    mutationFn: () => academicsApi.saveGradingScale({ name: form.name, board: form.board || undefined, isDefault: form.isDefault, schoolId: sid }, editId ?? undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['grading'] }); toast.success('Saved'); setOpen(false) },
    onError: () => toast.error('Failed to save grading scale'),
  })
  const del = useMutation({
    mutationFn: (id: string) => academicsApi.deleteGradingScale(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['grading'] }); toast.success('Deleted') },
  })
  const saveBand = useMutation({
    mutationFn: () => academicsApi.saveGradeBand(bandFor!, { ...band, gradePoint: band.gradePoint === '' ? undefined : +band.gradePoint, description: band.description || undefined }, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['grading'] }); toast.success('Band added'); setBandFor(null) },
    onError: () => toast.error('Failed to add band (check the percentage range)'),
  })
  const delBand = useMutation({
    mutationFn: (id: string) => academicsApi.deleteGradeBand(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['grading'] }); toast.success('Band removed') },
  })
  const create = () => { setEditId(null); setForm({ name: '', board: '', isDefault: false }); setOpen(true) }
  const addBand = (scaleId: string) => { setBand({ grade: '', minPercent: 0, maxPercent: 0, gradePoint: '', description: '' }); setBandFor(scaleId) }
  return (
    <>
      <div className="mb-3 flex justify-end">
        <button onClick={create} className="btn-primary flex items-center gap-2"><Plus size={14} />Add Grading Scale</button>
      </div>
      {isLoading ? <div className="card p-6 text-sm text-gray-400">Loading…</div> :
        !data?.length ? <div className="card"><EmptyState message="No grading scales yet. Add a CBSE / ICSE / JKBOSE scale." /></div> :
          <div className="space-y-4">
            {data.map(s => (
              <div key={s.id} className="card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                    {s.board && <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-600">{s.board}</span>}
                    {s.isDefault && <StatusBadge status="Active" />}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addBand(s.id)} className="btn-secondary flex items-center gap-1 !px-2 !py-1 text-xs"><Plus size={12} />Band</button>
                    <button onClick={() => { setEditId(s.id); setForm({ name: s.name, board: s.board ?? '', isDefault: s.isDefault }); setOpen(true) }}
                      className="text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete scale and all its bands?')) del.mutate(s.id) }}
                      className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
                {!s.bands.length ? <p className="text-sm text-gray-400">No bands yet — add grade bands like A1 (91–100).</p> :
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-[11px] uppercase tracking-wide text-gray-400">
                      <th className="py-1">Grade</th><th>Range %</th><th>Points</th><th>Description</th><th></th></tr></thead>
                    <tbody>
                      {s.bands.map(b => (
                        <tr key={b.id} className="border-t border-gray-50">
                          <td className="py-1.5 font-medium text-gray-800">{b.grade}</td>
                          <td className="text-gray-600">{b.minPercent}–{b.maxPercent}</td>
                          <td className="text-gray-600">{b.gradePoint ?? '—'}</td>
                          <td className="text-gray-500">{b.description ?? '—'}</td>
                          <td className="text-right">
                            <button onClick={() => { if (confirm('Remove band?')) delBand.mutate(b.id) }} className="text-gray-300 hover:text-red-500"><Trash2 size={13} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>}
              </div>
            ))}
          </div>}

      <Modal title={editId ? 'Edit Grading Scale' : 'Add Grading Scale'} open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Name"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. CBSE 9-Point Scale" /></Field>
          <Field label="Board (optional)">
            <select className="input" value={form.board} onChange={e => setForm(f => ({ ...f, board: e.target.value as '' | BoardType }))}>
              <option value="">— None —</option>
              {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" className="rounded" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} /> Set as the school default scale
          </label>
          <FormActions editing={!!editId} pending={save.isPending} onCancel={() => setOpen(false)} onSave={() => save.mutate()} />
        </div>
      </Modal>

      <Modal title="Add Grade Band" open={!!bandFor} onClose={() => setBandFor(null)}>
        <div className="space-y-4">
          <Field label="Grade"><input className="input" value={band.grade} onChange={e => setBand(b => ({ ...b, grade: e.target.value }))} placeholder="e.g. A1" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Min %"><input type="number" className="input" value={band.minPercent} onChange={e => setBand(b => ({ ...b, minPercent: +e.target.value }))} /></Field>
            <Field label="Max %"><input type="number" className="input" value={band.maxPercent} onChange={e => setBand(b => ({ ...b, maxPercent: +e.target.value }))} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Grade Point (optional)"><input type="number" step="0.1" className="input" value={band.gradePoint} onChange={e => setBand(b => ({ ...b, gradePoint: e.target.value }))} placeholder="e.g. 10" /></Field>
            <Field label="Description (optional)"><input className="input" value={band.description} onChange={e => setBand(b => ({ ...b, description: e.target.value }))} placeholder="e.g. Outstanding" /></Field>
          </div>
          <FormActions editing={false} pending={saveBand.isPending} onCancel={() => setBandFor(null)} onSave={() => saveBand.mutate()} />
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
