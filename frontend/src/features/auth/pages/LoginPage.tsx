import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../services'
import type { UserRole } from '../../../shared/types/index.ts'
import toast from 'react-hot-toast'
import { ArrowRight, BookOpenCheck, Loader2, LockKeyhole, Mail, Sparkles, Zap, Eye, EyeOff } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '../../../shared/store/authStore'
import { roleOrder, roleProfiles } from '../../../shared/auth/roles'
import GoogleLoginButton from '../components/GoogleLoginButton.tsx'
import AppleLoginButton from '../components/AppleLoginButton.tsx'
import Logo from "../components/Logo.tsx"
import Divider from '../components/Divider.tsx'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../schemas/login-schema/loginSchema.ts'

const demoPassword = 'Admin@123'

const featureList = [
  { icon: Zap, text: 'AI-powered study tools' },
  { icon: BookOpenCheck, text: 'Role-aware content workspace' },
  { icon: Sparkles, text: 'Real-time analytics & insights' },
]

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('SuperAdmin')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

const {
  register,
  handleSubmit,
  setValue,
  formState: {
    errors,
    isSubmitting,
  },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  mode: "onSubmit",
  reValidateMode: "onChange",
  defaultValues: {
    email: "",
    password: "",
  },
})
  const selectRole = (role: UserRole) => {
    setSelectedRole(role)
    setValue('email', roleProfiles[role].email)
    setValue('password', demoPassword)
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await authApi.login(data.email, data.password)
      login(res)
      toast.success(`Welcome back, ${res.user.firstName}!`)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (
        err as {
          response?: {
            data?: {
              message?: string
            }
          }
        }
      )?.response?.data?.message

      toast.error(msg ?? 'Invalid credentials')
    }
  }

  const currentProfile = roleProfiles[selectedRole]

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-slate-100/80 lg:bg-[var(--color-sidebar)] lg:text-[var(--color-surface)]">
      <div className="grid min-h-screen lg:h-full lg:grid-cols-[1.1fr_0.9fr]">

        {/* ── Left: Hero panel (UNTOUCHED DESKTOP VIEW) ──────────────── */}
        <section className="relative hidden lg:flex lg:flex-col lg:justify-between lg:overflow-hidden lg:px-12 lg:py-8">
          {/* Background layers */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 15% 20%, rgba(37,99,235,0.4) 0%, transparent 42%), ' +
                'radial-gradient(circle at 85% 10%, rgba(99,102,241,0.3) 0%, transparent 35%), ' +
                'radial-gradient(circle at 50% 80%, rgba(14,165,233,0.15) 0%, transparent 40%), ' +
                'linear-gradient(150deg, #020617 0%, #0c1a3a 50%, #080f1e 100%)',
            }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950/80 to-transparent" />

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            {/* <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-600)] shadow-xl shadow-[var(--color-primary-600)]/50">
              <BookOpenCheck size={22} />
            </div>

            <div>
              <div className="text-[16px] font-bold tracking-tight">VidyaAI</div>
              <div className="text-[11px] font-medium text-[var(--color-surface)]/45">
                Learning Platform
              </div>
            </div> */}
            <Logo/>
          </div>

          {/* Hero copy */}
          <div className="relative max-w-2xl py-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/15 px-3.5 py-1.5 text-[12px] font-semibold text-[var(--color-primary-300)]">
              <Sparkles size={13} />
              Role-aware intelligent learning platform
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-[var(--color-surface)] md:text-5xl xl:text-[56px]">
              One platform.<br />
              <span className="bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-primary-700)] bg-clip-text text-transparent">
                Five unique
              </span>
              <br />
              experiences.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-[var(--color-text-muted)]">
              Sign in as any role and the platform reshapes to serve that person — global admin,
              school operator, teacher, student, or parent guardian.
            </p>

            {/* Feature list */}
            <ul className="mt-6 space-y-2">
              {featureList.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-600)]/30 text-[var(--color-primary-400)]">
                    <Icon size={13} />
                  </span>
                  <span className="text-[13px] font-medium text-[var(--color-surface)]">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Role selector cards */}
          <div className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
            {roleOrder.map((role) => {
              const p = roleProfiles[role]
              const active = selectedRole === role
              return (
                <button
                  key={role}
                  onClick={() => selectRole(role)}
                  className={clsx(
                    'group rounded-xl border p-3.5 text-left transition-all duration-200',
                    active
                      ? 'border-blue-400/50 bg-[var(--color-primary-600)]/20 shadow-lg shadow-blue-900/40 ring-1 ring-blue-500/30'
                      : 'border-white/[0.07] bg-[var(--color-surface)]/[0.04] hover:border-white/15 hover:bg-[var(--color-surface)]/[0.07]'
                  )}
                >
                  <div className={clsx('mb-2.5 h-1 w-8 rounded-full bg-gradient-to-r', p.accent)} />
                  <div
                    className={clsx(
                      'text-[13px] font-bold',
                      active ? 'text-blue-200' : 'text-white/90'
                    )}
                  >
                    {p.label}
                  </div>
                  <div
                    className={clsx(
                      'mt-1 text-[11px] leading-4',
                      active ? 'text-blue-300/70' : 'text-white/40'
                    )}
                  >
                    {p.scope}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Right: Login form (REFACTORED FOR MOBILE, UNTOUCHED ON DESKTOP) ──────────────── */}
        <section className="flex min-h-screen overflow-hidden items-center justify-center p-4 lg:min-h-0 lg:bg-[var(--color-surface)] lg:p-8 lg:text-[var(--color-text)]">
          
          {/* Card container on mobile / Flat panel on desktop */}
          <div className="w-full max-w-[440px] rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/60 border border-slate-100 lg:max-w-[400px] lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:border-none">

            {/* Header Logo (Mobile Design Header) */}
            <div className="mb-6 flex items-center gap-2.5 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <BookOpenCheck size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">VidyaAI</span>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <div className="flex items-center gap-2 lg:block">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 lg:mt-4 lg:text-[30px] lg:font-black lg:text-[var(--color-text)]">
                  Welcome back
                </h2>

                {/* Desktop Role Badge */}
                <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-600)] px-3 py-1 text-[11.5px] font-bold text-[var(--color-surface)] ring-1 ring-[var(--color-surface-muted)]">
                  <span
                    className={clsx(
                      'h-1.5 w-1.5 rounded-full bg-gradient-to-r',
                      currentProfile.accent
                    )}
                  />
                  {currentProfile.label}
                </span>
              </div>

              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 lg:mt-2 lg:text-sm lg:leading-6 lg:text-[var(--color-text-muted)]">
                {currentProfile.description}
              </p>
            </div>

            {/* Mobile Segmented Role Switcher Tabs (UI Design) */}
            <div className="mb-6 flex items-center justify-between rounded-full bg-slate-100/90 p-1 lg:hidden">
              {roleOrder.map((role) => {
                const p = roleProfiles[role]
                const active = selectedRole === role
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => selectRole(role)}
                    className={clsx(
                      'flex-1 rounded-full py-1.5 text-center text-[11px] font-medium transition-all duration-150',
                      active
                        ? 'bg-blue-600 font-semibold text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    {p.label.split(' ')[0]}
                  </button>
                )
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Social Login Buttons */}
              {/* <div className="mb-6 flex gap-3">
                <GoogleLoginButton
                  onClick={() => toast.error('Google login not implemented yet')}
                />
                <AppleLoginButton
                  onClick={() => toast.error('Apple login not implemented yet')}
                />
              </div> */}

              {/* <Divider /> */}

              {/* Email address */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 lg:text-[11px] lg:text-[var(--color-text-muted)]">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 lg:hidden"
                    size={16}
                  />
                  <input
                    type="email"
                    className="input pl-10 lg:pl-3"
                    placeholder="your@email.com"
                    {...register('email')}
                  />
                </div>

                <p className="mt-1 min-h-[16px] text-xs text-red-500">
                  {errors.email?.message}
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 lg:text-[11px] lg:text-[var(--color-text-muted)]">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 lg:text-[var(--color-text-muted)]"
                    size={15}
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    {...register('password')}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 lg:text-[var(--color-text-muted)] transition-colors hover:text-slate-600 lg:hover:text-[var(--color-text)]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <p className="mt-1 min-h-[16px] text-xs text-red-500">
                  {errors.password?.message}
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary mt-2 w-full py-3 text-[14px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" /> Signing in…
                  </>
                ) : (
                  <>
                    Sign in <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-6 text-center text-xs text-slate-500 space-y-2 lg:text-[13px] lg:text-[var(--color-text-muted)]">
              <p>
                Forgot your password?{' '}
                <Link
                  to="/reset-password"
                  className="font-bold text-[var(--color-primary-600)] lg:text-[var(--color-primary-600)] transition-colors hover:text-[var(--color-primary-700)] lg:hover:text-[var(--color-primary-700)]"
                >
                  Reset Password
                </Link>
              </p>
              <p>
                New here?{' '}
                <Link
                  to="/register"
                  className="font-bold text-[var(--color-primary-600)] lg:text-[var(--color-primary-600)] transition-colorshover:text-[var(--color-primary-700)]lg:hover:text-[var(--color-primary-700)]"
                >
                  Register a school or join one
                </Link>
              </p>
            </div>

            {/* Desktop Role quick-switch strip (UNTOUCHED DESKTOP VIEW) */}
            <div className="mt-4 hidden items-center gap-1.5 lg:flex">
              {roleOrder.map((role) => {
                const p = roleProfiles[role]
                const active = selectedRole === role
                return (
                  <button
                    key={role}
                    onClick={() => selectRole(role)}
                    title={p.label}
                    className={clsx(
                      'flex-1 rounded-lg py-2 text-[10.5px] font-semibold transition-all',
                      active
                        ? 'bg-[var(--color-primary-600)] text-[var(--color-surface)] shadow-sm'
                        : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text)]'
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