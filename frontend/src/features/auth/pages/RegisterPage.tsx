import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowLeft, BookOpenCheck, CheckCircle2, GraduationCap, Loader2, School as SchoolIcon, ShieldCheck, Sparkles, UserRound } from 'lucide-react'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData,signupSchema } from '../schemas/register-schema/registerSchema';
  
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { BoardType, SchoolType, UserRole } from '@/shared/types'
import { authApi } from '../services'
import Captcha from '@/shared/components/Captcha'

type Tab = 'school' | 'member'
const boards: BoardType[] = ['CBSE', 'ICSE', 'JKBOSE', 'StateBoard', 'IGCSE', 'Other']
const schoolTypes: SchoolType[] = ['Private', 'Government', 'CoachingCentre', 'College']




const steps = [
  { icon: UserRound,   title: 'Register',        text: 'Create a school, or join one as a teacher or student.' },
  { icon: ShieldCheck, title: 'Admin approves',  text: 'A super admin reviews schools; school admins review members.' },
  { icon: Sparkles,    title: 'Start learning',  text: 'Sign in and unlock the AI study workspace.' },
]

function err(e: unknown) {
  return (e as { response?: { data?: { message?: string } } })?.response?.data?.message
}

export default function 
RegisterPage() {
  const [tab, setTab] = useState<Tab>('school')
  const [done, setDone] = useState<string | null>(null)
  const [captcha, setCaptcha] = useState<string | undefined>()
  const navigate = useNavigate()

  const { data: schools } = useQuery({ queryKey: ['public-schools'], queryFn: authApi.publicSchools })

  // ── School registration ───────────────────────────────────────
  const [school, setSchool] = useState({
    schoolName: '', city: '', state: '', phone: '', email: '',
    type: 'Private' as SchoolType, board: 'CBSE' as BoardType,
    adminFirstName: '', adminLastName: '', adminEmail: '', adminPassword: '', adminPhone: '',
  })
  const registerSchool = useMutation({
    mutationFn: () => authApi.registerSchool({ ...school, captchaToken: captcha }),
    onSuccess: r => setDone(r.message),
    onError: e => toast.error(err(e) ?? 'Could not register school'),
  })

  // ── Member registration (teacher / student) ───────────────────
  const [member, setMember] = useState({
    schoolId: '', role: 'Student' as UserRole,
    firstName: '', lastName: '', email: '', password: '', phone: '',
    gradeLevel: '', rollNumber: '', dateOfBirth: '', guardianName: '', guardianPhone: '',
  })
  const registerMember = useMutation({
    mutationFn: () => authApi.registerMember({
      ...member,
      dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString() : null,
      captchaToken: captcha,
    }),
    onSuccess: r => setDone(r.message),
    onError: e => toast.error(err(e) ?? 'Could not submit registration'),
  })

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[0.85fr_1.15fr]">

        {/* ── Left: hero ─────────────────────────────────────────── */}
        <section className="relative hidden flex-col justify-between overflow-hidden px-10 py-10 text-white lg:flex"
          style={{
            background: 'radial-gradient(circle at 20% 15%, rgba(37,99,235,0.45) 0%, transparent 45%), ' +
                        'radial-gradient(circle at 90% 90%, rgba(99,102,241,0.35) 0%, transparent 40%), ' +
                        'linear-gradient(160deg, #020617 0%, #0c1a3a 55%, #080f1e 100%)',
          }}>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '46px 46px' }} />

          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-xl shadow-blue-600/50">
              <BookOpenCheck size={22} />
            </div>
            <div>
              <div className="text-[16px] font-bold tracking-tight">VidyaAI</div>
              <div className="text-[11px] font-medium text-white/45">Learning Platform</div>
            </div>
          </div>

          <div className="relative max-w-md">
            <h1 className="text-[40px] font-black leading-[1.08] tracking-tight">
              Join the{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">smarter</span>{' '}
              way to learn.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Register your school or join an existing one. Every sign-up is reviewed by an admin before access is granted.
            </p>

            <ul className="mt-9 space-y-5">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/25 text-blue-300 ring-1 ring-blue-500/30">
                      <Icon size={16} />
                    </span>
                    {i < steps.length - 1 && <span className="mt-1 h-7 w-px bg-white/10" />}
                  </div>
                  <div className="pt-1">
                    <div className="text-[13.5px] font-bold text-white">{title}</div>
                    <div className="mt-0.5 text-[12px] leading-5 text-slate-400">{text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative text-[12px] text-white/40">Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-300 hover:text-blue-200">Sign in</Link>
          </div>
        </section>

        {/* ── Right: form ────────────────────────────────────────── */}
        <section className="flex items-start justify-center overflow-y-auto px-5 py-8 sm:px-10">
          <div className="w-full max-w-lg">
            <Link to="/login" className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-800 lg:hidden">
              <ArrowLeft size={14} /> Back to sign in
            </Link>

            {done ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <CheckCircle2 className="mx-auto mb-4 text-emerald-500" size={48} />
                <h2 className="text-2xl font-black text-slate-900">Registration received</h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">{done}</p>
                <button onClick={() => navigate('/login')} className="btn-primary mx-auto mt-6">Back to sign in</button>
              </div>
            ) : (
              <>
                <h2 className="text-[26px] font-black tracking-tight text-slate-900">Create your account</h2>
                <p className="mt-1.5 text-sm text-slate-500">Choose how you'd like to get started.</p>

                {/* Tabs */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <TabButton active={tab === 'school'} onClick={() => setTab('school')} icon={SchoolIcon} label="Register a school" sub="You'll be the school admin" />
                  <TabButton active={tab === 'member'} onClick={() => setTab('member')} icon={UserRound} label="Join a school" sub="As a teacher or student" />
                </div>

                <div className="mt-6">
                  {tab === 'school' ? (
                    <div className="space-y-4">
                      <Section title="School details" />
                      <input className="input" placeholder="School name *" value={school.schoolName} onChange={e => setSchool(s => ({ ...s, schoolName: e.target.value }))} />
                      <div className="grid grid-cols-2 gap-3">
                        <input className="input" placeholder="City" value={school.city} onChange={e => setSchool(s => ({ ...s, city: e.target.value }))} />
                        <input className="input" placeholder="State" value={school.state} onChange={e => setSchool(s => ({ ...s, state: e.target.value }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <select className="input" value={school.type} onChange={e => setSchool(s => ({ ...s, type: e.target.value as SchoolType }))}>
                          {schoolTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <select className="input" value={school.board} onChange={e => setSchool(s => ({ ...s, board: e.target.value as BoardType }))}>
                          {boards.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input className="input" placeholder="School phone" value={school.phone} onChange={e => setSchool(s => ({ ...s, phone: e.target.value }))} />
                        <input className="input" placeholder="School email" value={school.email} onChange={e => setSchool(s => ({ ...s, email: e.target.value }))} />
                      </div>

                      <Section title="Admin account" />
                      <div className="grid grid-cols-2 gap-3">
                        <input className="input" placeholder="First name *" value={school.adminFirstName} onChange={e => setSchool(s => ({ ...s, adminFirstName: e.target.value }))} />
                        <input className="input" placeholder="Last name *" value={school.adminLastName} onChange={e => setSchool(s => ({ ...s, adminLastName: e.target.value }))} />
                      </div>
                      <input type="email" className="input" placeholder="Admin email *" value={school.adminEmail} onChange={e => setSchool(s => ({ ...s, adminEmail: e.target.value }))} />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="password" className="input" placeholder="Password *" value={school.adminPassword} onChange={e => setSchool(s => ({ ...s, adminPassword: e.target.value }))} />
                        <input className="input" placeholder="Phone" value={school.adminPhone} onChange={e => setSchool(s => ({ ...s, adminPhone: e.target.value }))} />
                      </div>
                      <Captcha onChange={setCaptcha} />
                      <button onClick={() => registerSchool.mutate()} disabled={registerSchool.isPending} className="btn-primary mt-2 w-full py-3">
                        {registerSchool.isPending ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : 'Register school'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Section title="Your school" />
                      <select className="input" value={member.schoolId} onChange={e => setMember(m => ({ ...m, schoolId: e.target.value }))}>
                        <option value="">Select your school…</option>
                        {(schools ?? []).map(s => <option key={s.id} value={s.id}>{s.name}{s.city ? ` — ${s.city}` : ''}</option>)}
                      </select>
                      {!schools?.length && <p className="text-xs text-amber-600">No approved schools yet. Register a school first, or check back once it's approved.</p>}

                      <div className="grid grid-cols-2 gap-2">
                        {(['Student', 'Teacher'] as UserRole[]).map(r => (
                          <button key={r} onClick={() => setMember(m => ({ ...m, role: r }))}
                            className={clsx('rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors',
                              member.role === r ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50')}>
                            {r === 'Student' ? <GraduationCap size={15} className="mr-1.5 inline" /> : <BookOpenCheck size={15} className="mr-1.5 inline" />}
                            {r}
                          </button>
                        ))}
                      </div>

                      <Section title="Your details" />
                      <div className="grid grid-cols-2 gap-3">
                        <input className="input" placeholder="First name *" value={member.firstName} onChange={e => setMember(m => ({ ...m, firstName: e.target.value }))} />
                        <input className="input" placeholder="Last name *" value={member.lastName} onChange={e => setMember(m => ({ ...m, lastName: e.target.value }))} />
                      </div>
                      <input type="email" className="input" placeholder="Email *" value={member.email} onChange={e => setMember(m => ({ ...m, email: e.target.value }))} />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="password" className="input" placeholder="Password *" value={member.password} onChange={e => setMember(m => ({ ...m, password: e.target.value }))} />
                        <input className="input" placeholder="Phone" value={member.phone} onChange={e => setMember(m => ({ ...m, phone: e.target.value }))} />
                      </div>

                      {member.role === 'Student' && (
                        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <Section title="Student profile" />
                          <div className="grid grid-cols-2 gap-3">
                            <input className="input" placeholder="Class / grade" value={member.gradeLevel} onChange={e => setMember(m => ({ ...m, gradeLevel: e.target.value }))} />
                            <input className="input" placeholder="Roll number" value={member.rollNumber} onChange={e => setMember(m => ({ ...m, rollNumber: e.target.value }))} />
                          </div>
                          <input type="date" className="input" value={member.dateOfBirth} onChange={e => setMember(m => ({ ...m, dateOfBirth: e.target.value }))} />
                          <div className="grid grid-cols-2 gap-3">
                            <input className="input" placeholder="Guardian name" value={member.guardianName} onChange={e => setMember(m => ({ ...m, guardianName: e.target.value }))} />
                            <input className="input" placeholder="Guardian phone" value={member.guardianPhone} onChange={e => setMember(m => ({ ...m, guardianPhone: e.target.value }))} />
                          </div>
                        </div>
                      )}

                      <Captcha onChange={setCaptcha} />
                      <button onClick={() => registerMember.mutate()} disabled={registerMember.isPending || !member.schoolId} className="btn-primary mt-2 w-full py-3">
                        {registerMember.isPending ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : `Register as ${member.role.toLowerCase()}`}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label, sub }: {
  active: boolean; onClick: () => void; icon: typeof SchoolIcon; label: string; sub: string
}) {
  return (
    <button onClick={onClick}
      className={clsx('rounded-xl border p-3 text-left transition-all',
        active ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' : 'border-slate-200 hover:bg-slate-50')}>
      <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-400'} />
      <div className={clsx('mt-1.5 text-[13px] font-bold', active ? 'text-blue-700' : 'text-slate-700')}>{label}</div>
      <div className="text-[11px] text-slate-400">{sub}</div>
    </button>
  )
}

function Section({ title }: { title: string }) {
  return <div className="border-b border-slate-100 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{title}</div>
}
