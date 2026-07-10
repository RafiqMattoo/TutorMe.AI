import { useEffect, useRef } from 'react'

// reCAPTCHA v2 checkbox, gated on VITE_CAPTCHA_SITEKEY. When the env var is unset
// (the default), this renders nothing and no token is produced — the backend also
// skips verification unless Captcha:SecretKey is configured, so dev just works.
// To enable: set VITE_CAPTCHA_SITEKEY (frontend) + Captcha:SecretKey (backend).
const SITEKEY = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_CAPTCHA_SITEKEY

declare global {
  interface Window { grecaptcha?: { render: (el: HTMLElement, opts: object) => number } }
}

export default function Captcha({ onChange }: { onChange: (token?: string) => void }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const rendered = useRef(false)

  useEffect(() => {
    if (!SITEKEY) return
    const render = () => {
      if (ref.current && window.grecaptcha?.render && !rendered.current) {
        rendered.current = true
        window.grecaptcha.render(ref.current, {
          sitekey: SITEKEY,
          callback: (t: string) => onChange(t),
          'expired-callback': () => onChange(undefined),
          'error-callback': () => onChange(undefined),
        })
      }
    }
    if (window.grecaptcha?.render) { render(); return }

    const id = 'recaptcha-script'
    if (!document.getElementById(id)) {
      const s = document.createElement('script')
      s.id = id
      s.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
      s.async = true; s.defer = true
      document.head.appendChild(s)
    }
    const t = setInterval(() => { if (window.grecaptcha?.render) { clearInterval(t); render() } }, 300)
    return () => clearInterval(t)
  }, [onChange])

  if (!SITEKEY) return null
  return <div ref={ref} className="mt-1" />
}
