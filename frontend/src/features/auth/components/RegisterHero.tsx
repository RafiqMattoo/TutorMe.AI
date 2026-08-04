import { Link } from 'react-router-dom'
import {
  BookOpenCheck,
  ShieldCheck,
  Sparkles,
  UserRound
} from 'lucide-react'

const steps = [
  {
    icon: UserRound,
    title: 'Register',
    text: 'Create a school, or join one as a teacher or student.'
  },
  {
    icon: ShieldCheck,
    title: 'Admin approves',
    text: 'A super admin reviews schools; school admins review members.'
  },
  {
    icon: Sparkles,
    title: 'Start learning',
    text: 'Sign in and unlock the AI study workspace.'
  },
]


export default function RegisterHero() {

  return (

    <section
      className="relative hidden flex-col justify-between overflow-hidden px-10 py-10 text-white lg:flex"
      style={{
        background:
          'radial-gradient(circle at 20% 15%, rgba(37,99,235,0.45) 0%, transparent 45%),' +
          'radial-gradient(circle at 90% 90%, rgba(99,102,241,0.35) 0%, transparent 40%),' +
          'linear-gradient(160deg,#020617 0%,#0c1a3a 55%,#080f1e 100%)'
      }}
    >

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),' +
            'linear-gradient(to right,rgba(255,255,255,1) 1px,transparent 1px)',
          backgroundSize: '46px 46px'
        }}
      />


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


      <div className="relative max-w-md">

        <h1 className="text-[40px] font-black leading-[1.08] tracking-tight">
          Join the{' '}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            smarter
          </span>
          {' '}way to learn.
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          Register your school or join an existing one.
          Every sign-up is reviewed by an admin before access is granted.
        </p>


        <ul className="mt-9 space-y-5">

          {steps.map(({ icon: Icon, title, text }, i) => (

            <li key={title} className="flex gap-3.5">

              <div className="flex flex-col items-center">

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/25 text-blue-300 ring-1 ring-blue-500/30">
                  <Icon size={16} />
                </span>

                {
                  i < steps.length - 1 &&
                  <span className="mt-1 h-7 w-px bg-white/10" />
                }

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


      <div className="relative text-[12px] text-white/40">
        Already have an account?
        {' '}
        <Link
          to="/login"
          className="font-semibold text-blue-300 hover:text-blue-200"
        >
          Sign in
        </Link>
      </div>

    </section>

  )

}