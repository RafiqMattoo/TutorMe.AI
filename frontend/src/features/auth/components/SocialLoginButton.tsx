import toast from 'react-hot-toast'

type Provider = 'Google' | 'Apple' | ''

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.28-1.93-6.15-4.53H2.18v2.85A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.05H2.18a11 11 0 0 0 0 9.9z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.05l3.67 2.85C6.72 7.3 9.14 5.38 12 5.38z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#000000">
      <path d="M16.365 1.43c0 1.14-.468 2.146-1.196 2.912-.83.87-2.132 1.518-3.24 1.43-.14-1.09.43-2.24 1.16-2.99.8-.83 2.19-1.47 3.276-1.352zm4.507 16.646c-.484 1.116-.71 1.618-1.325 2.6-.86 1.36-2.073 3.05-3.573 3.06-1.334.02-1.678-.87-3.49-.86-1.812.01-2.19.88-3.526.86-1.5-.01-2.65-1.55-3.51-2.91C2.06 17.5.72 12.5 2.52 9.14c.9-1.67 2.5-2.73 4.24-2.75 1.44-.02 2.8.97 3.68.97.88 0 2.53-1.2 4.27-1.03.73.03 2.77.3 4.08 2.22-.1.06-2.44 1.42-2.42 4.25.03 3.38 2.96 4.5 3 4.52z"/>
    </svg>
  )
}



const providers: { name: Provider; icon: () => JSX.Element }[] = [
  { name: 'Google', icon: GoogleIcon },
  { name: 'Apple', icon: AppleIcon },
 
]


export default function SocialLoginButtons() {

  return (

    <div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">

        {providers.map(({ name, icon: Icon }) => (

          <button
            key={name}
            type="button"
            onClick={() => toast('Social sign-up is coming soon')}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            <Icon />
            {name}
          </button>

        ))}

      </div>


      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-100" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Or continue with email
        </span>
        <span className="h-px flex-1 bg-slate-100" />
      </div>

    </div>

  )

}