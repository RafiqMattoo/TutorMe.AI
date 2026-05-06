import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api'
import { roleOrder, roleProfiles } from '../../auth/roles'
import type { UserRole } from '../../types'
import toast from 'react-hot-toast'
import { ArrowRight, BookOpenCheck, Loader2, LockKeyhole, Sparkles, Zap } from 'lucide-react'
import clsx from 'clsx'

const demoPassword = 'Admin@123'

const featureList = [
  { icon: Zap,           text: 'AI-powered study tools'       },
  { icon: BookOpenCheck, text: 'Role-aware content workspace'  },
  { icon: Sparkles,      text: 'Real-time analytics & insights'},
]

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('SuperAdmin')
  const [email,    setEmail]    = useState(roleProfiles.SuperAdmin.email)
  const [password, setPassword] = useState(demoPassword)
  const [loading,  setLoading]  = useState(false)
  const { login } = useAuthStore()
  const navigate  = useNavigate()

  const selectRole = (role: UserRole) => {
    setSelectedRole(role)
    setEmail(roleProfiles[role].email)
    setPassword(demoPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login(email, password)
      login(res)
      toast.success(`Welcome back, ${res.user.firstName}!`)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const currentProfile = roleProfiles[selectedRole]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">

        {/* ── Left: Hero panel ─────────────────────────────────── */}
        <section className="relative flex min-h-[48rem] flex-col justify-between overflow-hidden px-6 py-8 lg:px-12">

          {/* Background layers */}
          <div className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 15% 20%, rgba(37,99,235,0.4) 0%, transparent 42%), ' +
                          'radial-gradient(circle at 85% 10%, rgba(99,102,241,0.3) 0%, transparent 35%), ' +
                          'radial-gradient(circle at 50% 80%, rgba(14,165,233,0.15) 0%, transparent 40%), ' +
                          'linear-gradient(150deg, #020617 0%, #0c1a3a 50%, #080f1e 100%)',
            }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
          />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950/80 to-transparent" />

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-xl shadow-blue-600/50">
              <BookOpenCheck size={22} />
            </div>
            <div>
              <div className="text-[16px] font-bold tracking-tight">VidyaAI</div>
              <div className="text-[11px] text-white/45 font-medium">Learning Platform</div>
            </div>
          </div>

          {/* Hero copy */}
          <div className="relative max-w-2xl py-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/15 px-3.5 py-1.5 text-[12px] font-semibold text-blue-300">
              <Sparkles size={13} />
              Role-aware intelligent learning platform
            </div>

            <h1 className="text-5xl font-black leading-[1.04] tracking-tight text-white md:text-[62px]">
              One platform.<br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Five unique
              </span>
              <br />experiences.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
              Sign in as any role and the platform reshapes to serve that person — global admin,
              school operator, teacher, student, or parent guardian.
            </p>

            {/* Feature list */}
            <ul className="mt-8 space-y-2.5">
              {featureList.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/30 text-blue-400">
                    <Icon size={13} />
                  </span>
                  <span className="text-[13px] font-medium text-slate-300">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Role selector cards */}
          <div className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
            {roleOrder.map(role => {
              const p      = roleProfiles[role]
              const active = selectedRole === role
              return (
                <button
                  key={role}
                  onClick={() => selectRole(role)}
                  className={clsx(
                    'group rounded-xl border p-3.5 text-left transition-all duration-200',
                    active
                      ? 'border-blue-400/50 bg-blue-600/20 shadow-lg shadow-blue-900/40 ring-1 ring-blue-500/30'
                      : 'border-white/[0.07] bg-white/[0.04] hover:border-white/15 hover:bg-white/[0.07]',
                  )}
                >
                  <div className={clsx('mb-2.5 h-1 w-8 rounded-full bg-gradient-to-r', p.accent)} />
                  <div className={clsx('text-[13px] font-bold', active ? 'text-blue-200' : 'text-white/90')}>
                    {p.label}
                  </div>
                  <div className={clsx('mt-1 text-[11px] leading-4', active ? 'text-blue-300/70' : 'text-white/40')}>
                    {p.scope}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Right: Login form ─────────────────────────────────── */}
        <section className="flex items-center justify-center bg-white px-6 py-12 text-slate-900">
          <div className="w-full max-w-[400px]">

            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11.5px] font-bold text-blue-700 ring-1 ring-blue-200/60">
                <span
                  className={clsx('h-1.5 w-1.5 rounded-full bg-gradient-to-r', currentProfile.accent)}
                />
                {currentProfile.label}
              </span>
              <h2 className="mt-4 text-[30px] font-black tracking-tight text-slate-900">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {currentProfile.description}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Email address
                </label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  required className="input"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />
                  <input
                    type="password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    required className="input pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-2 w-full py-3 text-[14px]"
              >
                {loading
                  ? <><Loader2 size={17} className="animate-spin" /> Signing in…</>
                  : <>Sign in <ArrowRight size={16} /></>
                }
              </button>
            </form>

            {/* Demo hint */}
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Demo credentials
              </div>
              <div className="mt-1 text-[12.5px] text-slate-600">
                Password for all roles:{' '}
                <span className="font-bold text-slate-900">{demoPassword}</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Select any role card above to prefill email automatically.
              </div>
            </div>

            {/* Role quick-switch strip */}
            <div className="mt-4 flex items-center gap-1.5">
              {roleOrder.map(role => {
                const p      = roleProfiles[role]
                const active = selectedRole === role
                return (
                  <button
                    key={role}
                    onClick={() => selectRole(role)}
                    title={p.label}
                    className={clsx(
                      'flex-1 rounded-lg py-2 text-[10.5px] font-semibold transition-all',
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
                    )}
                  >
                    {p.label.split(' ')[0]}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
