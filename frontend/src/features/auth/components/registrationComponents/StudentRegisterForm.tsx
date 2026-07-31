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

export default function StudentRegisterForm({ schoolId, onSuccess }: { schoolId: string; onSuccess: (message: string) => void }) {
  const [captcha, setCaptcha] = useState<string | undefined>()
  const [student, setStudent] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '',
    gradeLevel: '', rollNumber: '', dateOfBirth: '', guardianName: '', guardianPhone: '',
  })
  const registerStudent = useMutation({
    mutationFn: () => authApi.registerMember({
      ...student, schoolId, role: 'Student',
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString() : null,
      captchaToken: captcha,
    }),
    onSuccess: (response) => onSuccess(response.message),
    onError: (error) => toast.error(errorMessage(error) ?? 'Could not submit registration'),
  })

  return (
    <div className="space-y-4">
      <Section title="Your details" />
      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="First name *" value={student.firstName} onChange={(event) => setStudent((current) => ({ ...current, firstName: event.target.value }))} />
        <input className="input" placeholder="Last name *" value={student.lastName} onChange={(event) => setStudent((current) => ({ ...current, lastName: event.target.value }))} />
      </div>
      <input type="email" className="input" placeholder="Email *" value={student.email} onChange={(event) => setStudent((current) => ({ ...current, email: event.target.value }))} />
      <div className="grid grid-cols-2 gap-3">
        <input type="password" className="input" placeholder="Password *" value={student.password} onChange={(event) => setStudent((current) => ({ ...current, password: event.target.value }))} />
        <input className="input" placeholder="Phone" value={student.phone} onChange={(event) => setStudent((current) => ({ ...current, phone: event.target.value }))} />
      </div>
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <Section title="Student profile" />
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="Class / grade" value={student.gradeLevel} onChange={(event) => setStudent((current) => ({ ...current, gradeLevel: event.target.value }))} />
          <input className="input" placeholder="Roll number" value={student.rollNumber} onChange={(event) => setStudent((current) => ({ ...current, rollNumber: event.target.value }))} />
        </div>
        <input type="date" className="input" value={student.dateOfBirth} onChange={(event) => setStudent((current) => ({ ...current, dateOfBirth: event.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="Guardian name" value={student.guardianName} onChange={(event) => setStudent((current) => ({ ...current, guardianName: event.target.value }))} />
          <input className="input" placeholder="Guardian phone" value={student.guardianPhone} onChange={(event) => setStudent((current) => ({ ...current, guardianPhone: event.target.value }))} />
        </div>
      </div>
      <Captcha onChange={setCaptcha} />
      <button onClick={() => registerStudent.mutate()} disabled={registerStudent.isPending || !schoolId} className="btn-primary mt-2 w-full py-3">
        {registerStudent.isPending ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : 'Register as student'}
      </button>
    </div>
  )
}
