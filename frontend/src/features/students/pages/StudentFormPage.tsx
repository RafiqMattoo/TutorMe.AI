import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Save, Check, User, GraduationCap, Phone, ShieldCheck, Users } from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { academicsApi, studentsApi } from '../services'
import { Field, PageHeader } from '../../../shared/components/ui/index.tsx'
import { useAuthStore } from '../../../shared/store/authStore.ts'
import type { Gender, Student, StudentCategory, StudentStatus } from '../../../shared/types/index.ts'

const GENDERS: Gender[] = ['Male', 'Female', 'Other']
const CATEGORIES: StudentCategory[] = ['General', 'OBC', 'SC', 'ST', 'EWS']
const STATUSES: StudentStatus[] = ['Active', 'Inactive', 'TransferredOut', 'Graduated', 'Alumni']

const STEPS = [
  { key: 'identity', label: 'Identity', hint: 'Name & admission', icon: User },
  { key: 'placement', label: 'Placement', hint: 'Class & section', icon: GraduationCap },
  { key: 'contact', label: 'Contact', hint: 'Address & reach', icon: Phone },
  { key: 'demographics', label: 'Demographics', hint: 'Category & IDs', icon: ShieldCheck },
  { key: 'guardians', label: 'Guardians', hint: 'Parents & guardian', icon: Users },
] as const

const today = () => new Date().toISOString().slice(0, 10)
const iso = (d: string) => (d ? new Date(d).toISOString() : null)
const day = (d?: string) => (d ? d.slice(0, 10) : '')

type Form = {
  admissionNumber: string; rollNumber: string; firstName: string; lastName: string
  gender: Gender; dateOfBirth: string; admissionDate: string; status: StudentStatus
  academicYearId: string; schoolClassId: string; sectionId: string; houseId: string
  email: string; phone: string; address: string; city: string; state: string; pincode: string
  category: StudentCategory; bloodGroup: string; nationality: string; motherTongue: string; religion: string
  isCwsn: boolean; cwsnNature: string; isRte: boolean; aadhaarNumber: string; apaarId: string
  fatherName: string; fatherPhone: string; fatherOccupation: string
  motherName: string; motherPhone: string; motherOccupation: string
  guardianName: string; guardianPhone: string; guardianEmail: string; guardianRelation: string
}

const emptyForm = (): Form => ({
  admissionNumber: '', rollNumber: '', firstName: '', lastName: '',
  gender: 'Male', dateOfBirth: '', admissionDate: today(), status: 'Active',
  academicYearId: '', schoolClassId: '', sectionId: '', houseId: '',
  email: '', phone: '', address: '', city: '', state: '', pincode: '',
  category: 'General', bloodGroup: '', nationality: '', motherTongue: '', religion: '',
  isCwsn: false, cwsnNature: '', isRte: false, aadhaarNumber: '', apaarId: '',
  fatherName: '', fatherPhone: '', fatherOccupation: '',
  motherName: '', motherPhone: '', motherOccupation: '',
  guardianName: '', guardianPhone: '', guardianEmail: '', guardianRelation: '',
})

const fromStudent = (s: Student): Form => ({
  admissionNumber: s.admissionNumber, rollNumber: s.rollNumber ?? '', firstName: s.firstName, lastName: s.lastName,
  gender: s.gender, dateOfBirth: day(s.dateOfBirth), admissionDate: day(s.admissionDate), status: s.status,
  academicYearId: s.academicYearId ?? '', schoolClassId: s.schoolClassId ?? '', sectionId: s.sectionId ?? '', houseId: s.houseId ?? '',
  email: s.email ?? '', phone: s.phone ?? '', address: s.address ?? '', city: s.city ?? '', state: s.state ?? '', pincode: s.pincode ?? '',
  category: s.category, bloodGroup: s.bloodGroup ?? '', nationality: s.nationality ?? '', motherTongue: s.motherTongue ?? '', religion: s.religion ?? '',
  isCwsn: s.isCwsn, cwsnNature: s.cwsnNature ?? '', isRte: s.isRte, aadhaarNumber: s.aadhaarNumber ?? '', apaarId: s.apaarId ?? '',
  fatherName: s.fatherName ?? '', fatherPhone: s.fatherPhone ?? '', fatherOccupation: s.fatherOccupation ?? '',
  motherName: s.motherName ?? '', motherPhone: s.motherPhone ?? '', motherOccupation: s.motherOccupation ?? '',
  guardianName: s.guardianName ?? '', guardianPhone: s.guardianPhone ?? '', guardianEmail: s.guardianEmail ?? '', guardianRelation: s.guardianRelation ?? '',
})

export default function StudentFormPage() {
  const { id } = useParams()
  const editing = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const sid = useAuthStore(s => s.user?.schoolId)
  const [form, setForm] = useState<Form>(emptyForm())
  const [step, setStep] = useState(0)
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm(f => ({ ...f, [k]: v }))
  const last = STEPS.length - 1

  const { data: classes } = useQuery({ queryKey: ['classes', sid], queryFn: () => academicsApi.classes(sid) })
  const { data: years } = useQuery({ queryKey: ['years', sid], queryFn: () => academicsApi.years(sid) })
  const { data: houses } = useQuery({ queryKey: ['houses', sid], queryFn: () => academicsApi.houses(sid) })
  const { data: allSections } = useQuery({ queryKey: ['sections', sid], queryFn: () => academicsApi.sections(sid) })
  const sectionsForClass = useMemo(
    () => allSections?.filter(s => s.schoolClassId === form.schoolClassId), [allSections, form.schoolClassId])

  const { data: student, isLoading } = useQuery({
    queryKey: ['student', id, sid], queryFn: () => studentsApi.getById(id!, sid), enabled: editing,
  })
  useEffect(() => { if (student) setForm(fromStudent(student)) }, [student])
  useEffect(() => {
    if (editing) return
    let cancelled = false
    studentsApi.nextAdmissionNumber(sid).then(n => { if (!cancelled) setForm(f => (f.admissionNumber ? f : { ...f, admissionNumber: n })) }).catch(() => {})
    return () => { cancelled = true }
  }, [editing, sid])

  const save = useMutation({
    mutationFn: () => {
      const payload = { ...form, dateOfBirth: iso(form.dateOfBirth), admissionDate: iso(form.admissionDate), schoolId: sid }
      return editing ? studentsApi.update(id!, payload) : studentsApi.create(payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      toast.success(editing ? 'Student updated' : 'Student created')
      navigate('/students')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Failed to save student')
    },
  })

  const next = () => {
    if (step === 0 && (!form.firstName.trim() || !form.admissionNumber.trim())) {
      toast.error('First name and admission number are required'); return
    }
    setStep(s => Math.min(s + 1, last))
  }

  if (editing && isLoading) return <div className="p-8 text-sm text-slate-400">Loading student…</div>

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={editing ? 'Edit Student' : 'Add Student'}
        subtitle={editing ? `${form.firstName} ${form.lastName} · ${form.admissionNumber}` : 'Complete the steps to enrol a student'}
        action={<button onClick={() => navigate('/students')} className="btn-secondary flex items-center gap-2"><ArrowLeft size={14} />Back to list</button>}
      />

      {/* Stepper */}
      <div className="border-b border-slate-100 bg-white px-5 py-4 lg:px-8">
        <div className="flex items-center">
          {STEPS.map((s, i) => {
            const done = i < step
            const current = i === step
            return (
              <div key={s.key} className="flex flex-1 items-center last:flex-none">
                <button onClick={() => setStep(i)} className="group flex items-center gap-3 text-left">
                  <span className={clsx(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all',
                    current ? 'bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/40'
                      : done ? 'bg-blue-100 text-blue-600'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200',
                  )}>
                    {done ? <Check size={18} /> : <s.icon size={18} />}
                  </span>
                  <div className="hidden sm:block">
                    <div className={clsx('text-[13px] font-bold', current ? 'text-slate-900' : done ? 'text-slate-700' : 'text-slate-400')}>{s.label}</div>
                    <div className="text-[11px] text-slate-400">{s.hint}</div>
                  </div>
                </button>
                {i < last && <div className={clsx('mx-3 h-0.5 flex-1 rounded-full transition-colors', done ? 'bg-blue-300' : 'bg-slate-200')} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Content area — full width, fills remaining height */}
      <div className="flex-1 overflow-y-auto bg-slate-50/40 p-5 lg:p-8">
        <div className="card min-h-full p-6 lg:p-8">
          {step === 0 && (
            <StepShell title="Identity" subtitle="Name, admission details and status">
              <Grid>
                <Field label="Admission Number"><input className="input" value={form.admissionNumber} onChange={e => set('admissionNumber', e.target.value)} /></Field>
                <Field label="Roll Number"><input className="input" value={form.rollNumber} onChange={e => set('rollNumber', e.target.value)} /></Field>
                <Field label="Status"><select className="input" value={form.status} onChange={e => set('status', e.target.value as StudentStatus)}>{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></Field>
                <Field label="First Name"><input className="input" value={form.firstName} onChange={e => set('firstName', e.target.value)} /></Field>
                <Field label="Last Name"><input className="input" value={form.lastName} onChange={e => set('lastName', e.target.value)} /></Field>
                <Field label="Gender"><select className="input" value={form.gender} onChange={e => set('gender', e.target.value as Gender)}>{GENDERS.map(g => <option key={g} value={g}>{g}</option>)}</select></Field>
                <Field label="Date of Birth"><input type="date" className="input" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} /></Field>
                <Field label="Admission Date"><input type="date" className="input" value={form.admissionDate} onChange={e => set('admissionDate', e.target.value)} /></Field>
              </Grid>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell title="Academic placement" subtitle="Where the student sits in the academic structure">
              <Grid>
                <Field label="Academic Year"><select className="input" value={form.academicYearId} onChange={e => set('academicYearId', e.target.value)}>
                  <option value="">—</option>{years?.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}</select></Field>
                <Field label="Class"><select className="input" value={form.schoolClassId} onChange={e => setForm(f => ({ ...f, schoolClassId: e.target.value, sectionId: '' }))}>
                  <option value="">—</option>{classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
                <Field label="Section"><select className="input" value={form.sectionId} onChange={e => set('sectionId', e.target.value)} disabled={!form.schoolClassId}>
                  <option value="">—</option>{sectionsForClass?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
                <Field label="House"><select className="input" value={form.houseId} onChange={e => set('houseId', e.target.value)}>
                  <option value="">—</option>{houses?.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}</select></Field>
              </Grid>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell title="Contact" subtitle="Address and reach details">
              <Grid>
                <Field label="Email"><input className="input" value={form.email} onChange={e => set('email', e.target.value)} /></Field>
                <Field label="Phone"><input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} /></Field>
              </Grid>
              <Field label="Address"><input className="input" value={form.address} onChange={e => set('address', e.target.value)} /></Field>
              <Grid>
                <Field label="City"><input className="input" value={form.city} onChange={e => set('city', e.target.value)} /></Field>
                <Field label="State"><input className="input" value={form.state} onChange={e => set('state', e.target.value)} /></Field>
                <Field label="Pincode"><input className="input" value={form.pincode} onChange={e => set('pincode', e.target.value)} /></Field>
              </Grid>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell title="Demographics & compliance" subtitle="Category, identifiers and inclusion flags (UDISE / RTE)">
              <Grid>
                <Field label="Category"><select className="input" value={form.category} onChange={e => set('category', e.target.value as StudentCategory)}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
                <Field label="Blood Group"><input className="input" value={form.bloodGroup} onChange={e => set('bloodGroup', e.target.value)} /></Field>
                <Field label="Mother Tongue"><input className="input" value={form.motherTongue} onChange={e => set('motherTongue', e.target.value)} /></Field>
                <Field label="Religion"><input className="input" value={form.religion} onChange={e => set('religion', e.target.value)} /></Field>
                <Field label="Nationality"><input className="input" value={form.nationality} onChange={e => set('nationality', e.target.value)} /></Field>
                <Field label="APAAR ID"><input className="input" value={form.apaarId} onChange={e => set('apaarId', e.target.value)} /></Field>
                <Field label="Aadhaar Number"><input className="input" value={form.aadhaarNumber} onChange={e => set('aadhaarNumber', e.target.value)} /></Field>
              </Grid>
              <div className="flex flex-wrap gap-6 pt-1">
                <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" className="rounded" checked={form.isRte} onChange={e => set('isRte', e.target.checked)} /> RTE / EWS quota</label>
                <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" className="rounded" checked={form.isCwsn} onChange={e => set('isCwsn', e.target.checked)} /> CWSN (divyang)</label>
              </div>
              {form.isCwsn && <Field label="Nature of special need"><input className="input" value={form.cwsnNature} onChange={e => set('cwsnNature', e.target.value)} /></Field>}
            </StepShell>
          )}

          {step === 4 && (
            <StepShell title="Guardians" subtitle="Parents / guardian contacts">
              <Grid>
                <Field label="Father's Name"><input className="input" value={form.fatherName} onChange={e => set('fatherName', e.target.value)} /></Field>
                <Field label="Father's Phone"><input className="input" value={form.fatherPhone} onChange={e => set('fatherPhone', e.target.value)} /></Field>
                <Field label="Father's Occupation"><input className="input" value={form.fatherOccupation} onChange={e => set('fatherOccupation', e.target.value)} /></Field>
                <Field label="Mother's Name"><input className="input" value={form.motherName} onChange={e => set('motherName', e.target.value)} /></Field>
                <Field label="Mother's Phone"><input className="input" value={form.motherPhone} onChange={e => set('motherPhone', e.target.value)} /></Field>
                <Field label="Mother's Occupation"><input className="input" value={form.motherOccupation} onChange={e => set('motherOccupation', e.target.value)} /></Field>
                <Field label="Guardian Name"><input className="input" value={form.guardianName} onChange={e => set('guardianName', e.target.value)} /></Field>
                <Field label="Guardian Relation"><input className="input" value={form.guardianRelation} onChange={e => set('guardianRelation', e.target.value)} /></Field>
                <Field label="Guardian Phone"><input className="input" value={form.guardianPhone} onChange={e => set('guardianPhone', e.target.value)} /></Field>
                <Field label="Guardian Email"><input className="input" value={form.guardianEmail} onChange={e => set('guardianEmail', e.target.value)} /></Field>
              </Grid>
            </StepShell>
          )}
        </div>
      </div>

      {/* Sticky footer nav */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-4 lg:px-8">
        <button onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0}
          className="btn-secondary flex items-center gap-2 disabled:opacity-40"><ArrowLeft size={14} />Back</button>
        <div className="text-[12px] font-medium text-slate-400">Step {step + 1} of {STEPS.length}</div>
        {step < last
          ? <button onClick={next} className="btn-primary flex items-center gap-2">Next<ArrowRight size={14} /></button>
          : <button onClick={() => save.mutate()} disabled={save.isPending} className="btn-primary flex items-center gap-2">
              <Save size={14} />{save.isPending ? 'Saving…' : editing ? 'Update Student' : 'Create Student'}
            </button>}
      </div>
    </div>
  )
}

function StepShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-[17px] font-black text-slate-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[13px] text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>
}
