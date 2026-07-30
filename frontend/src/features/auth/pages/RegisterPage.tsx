import { useState } from 'react'
import {
  CheckCircle2,
  School as SchoolIcon,
  UserRound,
  ArrowLeft,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import {SocialLoginButtons} from '../components/SocialLoginButton';
import { SignupFormData,signupSchema } from '../schemas/register-schema/registerSchema';
  





import RegisterHero from '../components/RegisterHero'
import SchoolRegisterForm from '../components/SchoolRegisterForm'
import MemberRegisterForm from '../components/MemberRegisterForm'
import { TabButton } from '../components/FormControls'
import SocialLoginButtons from '../components/SocialLoginButton';

type Tab = 'school' | 'member'

export default function 
RegisterPage() {
  const [tab, setTab] = useState<Tab>('school')
  const [done, setDone] = useState<string | null>(null)

  const navigate = useNavigate()

  const {
  register,
  handleSubmit,
  watch,
  formState: { errors, isValid },
} = useForm<SignupFormData>({
  resolver: zodResolver(signupSchema),
  mode: "onChange",
});


  return (
    <div className="min-h-screen bg-white text-slate-900 lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-screen lg:min-h-0 lg:grid-cols-[0.85fr_1.15fr]">
        {/* ================= LEFT HERO ================= */}
        <RegisterHero />

        {/* ================= RIGHT FORM ================= */}
        <section className="flex items-center justify-center px-5 py-8 sm:px-10 lg:h-screen lg:overflow-y-auto lg:py-6">
          <div className="w-full max-w-lg">
            {/* Mobile Back */}
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-blue-600"
              >
                <ArrowLeft size={14} />
                Back to sign in
              </Link>
            </div>

            {done ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <CheckCircle2
                  className="mx-auto mb-4 text-green-500"
                  size={48}
                />

                <h2 className="text-2xl font-black text-slate-900">
                  Registration received
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  {done}
                </p>

                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary mx-auto mt-6"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <>
                {/* Heading */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[24px] font-black tracking-tight text-slate-900">
                      Create your account
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Choose how you'd like to get started.
                    </p>
                  </div>

                  {/* Desktop Login */}
                  <Link
                    to="/login"
                    className="hidden shrink-0 whitespace-nowrap text-[13px] font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] lg:block"
                  >
                    Login
                  </Link>
                </div>

                {/* Tabs */}
                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <TabButton
                    active={tab === 'school'}
                    onClick={() => setTab('school')}
                    icon={SchoolIcon}
                    label="Register a school"
                    sub="You'll be the school admin"
                  />

                  <TabButton
                    active={tab === 'member'}
                    onClick={() => setTab('member')}
                    icon={UserRound}
                    label="Join a school"
                    sub="As a teacher or student"
                  />
                </div>

                {/* Forms */}
                <div className="mt-4">
                  {tab === 'school' ? (
                    <SchoolRegisterForm onSuccess={setDone} />
                  ) : (
                    <MemberRegisterForm onSuccess={setDone} />
                  )}
                </div>

                {/* Social Login (Bottom) */}
                <div className="mt-8">
                 <SocialLoginButtons/>
                </div>

                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
                  >
                    Login
                  </Link>
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}