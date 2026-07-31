import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Captcha from '@/shared/components/Captcha'
import { authApi } from '../../services'
import { Section } from '../FormControls'

function errorMessage(error: unknown) {
  return (error as { response?: { data?: { message?: string } } })?.response?.data?.message
}

export default function TeacherRegisterForm({ schoolId, onSuccess }: { schoolId: string; onSuccess: (message: string) => void }) {
  const [captcha, setCaptcha] = useState<string | undefined>()
  const [teacher, setTeacher] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' })
  const registerTeacher = useMutation({
    mutationFn: () => authApi.registerMember({ ...teacher, schoolId, role: 'Teacher', captchaToken: captcha }),
    onSuccess: (response) => onSuccess(response.message),
    onError: (error) => toast.error(errorMessage(error) ?? 'Could not submit registration'),
  })

  return (
    <div className="space-y-4">
      <Section title="Your details" />
      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="First name *" value={teacher.firstName} onChange={(event) => setTeacher((current) => ({ ...current, firstName: event.target.value }))} />
        <input className="input" placeholder="Last name *" value={teacher.lastName} onChange={(event) => setTeacher((current) => ({ ...current, lastName: event.target.value }))} />
      </div>
      <input type="email" className="input" placeholder="Email *" value={teacher.email} onChange={(event) => setTeacher((current) => ({ ...current, email: event.target.value }))} />
      <div className="grid grid-cols-2 gap-3">
        <input type="password" className="input" placeholder="Password *" value={teacher.password} onChange={(event) => setTeacher((current) => ({ ...current, password: event.target.value }))} />
        <input className="input" placeholder="Phone" value={teacher.phone} onChange={(event) => setTeacher((current) => ({ ...current, phone: event.target.value }))} />
      </div>
      <Captcha onChange={setCaptcha} />
      <button onClick={() => registerTeacher.mutate()} disabled={registerTeacher.isPending || !schoolId} className="btn-primary mt-2 w-full py-3">
        {registerTeacher.isPending ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : 'Register as teacher'}
      </button>
    </div>
  )
}
