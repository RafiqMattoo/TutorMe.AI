import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, BookOpenCheck, CheckCircle2, GraduationCap, School as SchoolIcon, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import clsx from 'clsx'
import { authApi } from '../services'
import SearchableDropdown from '@/shared/components/ui/SearchableDropdown'
import { Section } from '../components/FormControls'
import SchoolRegisterForm from '../components/registrationComponents/SchoolRegisterForm'
import TeacherRegisterForm from '../components/registrationComponents/TeacherRegisterForm'
import StudentRegisterForm from '../components/registrationComponents/StudentRegisterForm'
import { FormProvider, useForm } from "react-hook-form";
import { registerSchoolSchema } from "../schemas/register-schema/registerSchoolSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RegisterSchoolFormData } from "@/shared/types";
type Tab = 'school' | 'member'
type MemberRole = 'Student' | 'Teacher'

const steps = [
  {
    icon: UserRound,
    title: "Register",
    text: "Create a school, or join one as a teacher or student.",
  },
  {
    icon: ShieldCheck,
    title: "Admin approves",
    text: "A super admin reviews schools; school admins review members.",
  },
  {
    icon: Sparkles,
    title: "Start learning",
    text: "Sign in and unlock the AI study workspace.",
  },
];

export default function RegistrationPage() {
  const [tab, setTab] = useState<Tab>('school')
  const [memberRole, setMemberRole] = useState<MemberRole>('Teacher')
  const [schoolId, setSchoolId] = useState('')
  const [done, setDone] = useState<string | null>(null)
  const [captcha, setCaptcha] = useState<string | undefined>()
  const navigate = useNavigate()
  const { data: schools } = useQuery({ queryKey: ['public-schools'], queryFn: authApi.publicSchools })

 const schoolMethods = useForm<RegisterSchoolFormData>({
  resolver: zodResolver(registerSchoolSchema) as any,

  defaultValues: {
    schoolName: "",
    schoolRegistrationNumber: "",

    city: "",
    state: "",

    phone: "",
    email: "",

    type: undefined,
    board: undefined,

    address: {
      houseNo: "",
      street: "",
      area: "",
      landmark: "",
    },

    principalName: "",
    establishedYear: undefined,
    website: "",

    // ✅ Add this
    supportingDocument: undefined,

    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPassword: "",
    adminPhone: "",
  },
});

  return (
    <div className="h-screen bg-white text-slate-900">
      <div className="grid h-full lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left Panel */}
        <section
          className="relative hidden flex-col overflow-hidden px-10 py-10 text-white lg:flex"
          style={{ background: 'radial-gradient(circle at 20% 15%, rgba(37,99,235,0.45) 0%, transparent 45%), radial-gradient(circle at 90% 90%, rgba(99,102,241,0.35) 0%, transparent 40%), linear-gradient(160deg, #020617 0%, #0c1a3a 55%, #080f1e 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "46px 46px",
            }}
          />

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-xl shadow-blue-600/50">
              <BookOpenCheck size={22} />
            </div>

            <div>
              <div className="text-[16px] font-bold tracking-tight">
                VidyaAI
              </div>
              <div className="text-[11px] font-medium text-white/45">
                Learning Platform
              </div>
            </div>
          </div>
         <div className="relative mt-10 max-w-md">
            <h1 className="text-[40px] font-black leading-[1.08] tracking-tight">Join the <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">smarter</span> way to learn.</h1>
            <p className="mt-4 text-sm leading-7 text-slate-400">Register your school or join an existing one. Every sign-up is reviewed by an admin before access is granted.</p>
            <ul className="mt-9 space-y-5">
              {steps.map(({ icon: Icon, title, text }, index) => (
                <li key={title} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/25 text-blue-300 ring-1 ring-blue-500/30">
                      <Icon size={16} />
                    </span>

                    {index < steps.length - 1 && (
                      <span className="mt-1 h-7 w-px bg-white/10" />
                    )}
                  </div>

                  <div className="pt-1">
                    <div className="text-[13.5px] font-bold text-white">
                      {title}
                    </div>

                    <div className="mt-0.5 text-[12px] leading-5 text-slate-400">
                      {text}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
      <div className="relative mt-auto flex items-center gap-1 text-sm text-white/60">
  <span>Already have an account?</span>

  <Link
    to="/login"
    className="font-semibold text-blue-300 transition-colors hover:text-blue-200"
  >
    Sign In
  </Link>
</div>
        </section>

        <section className="flex items-start justify-center overflow-y-auto px-4 py-6 sm:px-8 lg:px-10">
          <div className="w-full max-w-3xl">
            <Link to="/login" className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-800 lg:hidden"><ArrowLeft size={14} /> Back to sign in</Link>
            {done ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <CheckCircle2
                  className="mx-auto mb-4 text-emerald-500"
                  size={48}
                />

                <h2 className="text-2xl font-black text-slate-900">
                  Registration received
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  {done}
                </p>

                <button
                  onClick={() => navigate("/login")}
                  className="btn-primary mx-auto mt-6"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-[26px] font-black tracking-tight text-slate-900">Create your account</h2>
                <p className="mt-1.5 text-sm text-slate-500">Choose how you'd like to get started.</p>
                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <TabButton active={tab === 'school'} onClick={() => setTab('school')} icon={SchoolIcon} label="Register a school" sub="You'll be the school admin" />
                  <TabButton active={tab === 'member'} onClick={() => setTab('member')} icon={UserRound} label="Join a school" sub="As a teacher or student" />
                </div>
<div className="mt-6">
  {tab === "school" ? (
    <FormProvider {...schoolMethods}>
      <SchoolRegisterForm
        onSuccess={setDone}
        captcha={captcha}
        setCaptcha={setCaptcha}
      />
    </FormProvider>
  ) : (
    <div className="space-y-4">
      <Section title="Your school" />
                      <SearchableDropdown
                        label="School"
                        placeholder="Select your school"
                        searchable
                        value={schoolId}
                        onChange={setSchoolId}
                        options={(schools ?? []).map((school) => ({
                          value: school.id,
                          label: school.city
                            ? `${school.name} — ${school.city}`
                            : school.name,
                        }))}
                      />
                      {!schools?.length && <p className="text-xs text-amber-600">No approved schools yet. Register a school first, or check back once it's approved.</p>}
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {(['Teacher', 'Student'] as MemberRole[]).map((role) => (
                          <button key={role} onClick={() => setMemberRole(role)} className={clsx('rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors', memberRole === role ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50')}>
                            {role === 'Student' ? <GraduationCap size={15} className="mr-1.5 inline" /> : <BookOpenCheck size={15} className="mr-1.5 inline" />}{role}
                          </button>
                        ))}
                      </div>

                      {memberRole === "Teacher" && (
                        <TeacherRegisterForm
                          schoolId={schoolId}
                          onSuccess={setDone}
                        />
                      )}

                      {memberRole === "Student" && (
                        <StudentRegisterForm
                          schoolId={schoolId}
                          onSuccess={setDone}
                        />
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof SchoolIcon;
  label: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "rounded-xl border p-3 text-left transition-all",
        active
          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
          : "border-slate-200 hover:bg-slate-50",
      )}
    >
      <Icon size={18} className={active ? "text-blue-600" : "text-slate-400"} />
      <div
        className={clsx(
          "mt-1.5 text-[13px] font-bold",
          active ? "text-blue-700" : "text-slate-700",
        )}
      >
        {label}
      </div>
      <div className="text-[11px] text-slate-400">{sub}</div>
    </button>
  );
}
