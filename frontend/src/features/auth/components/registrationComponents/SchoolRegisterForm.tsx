import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { BoardType, SchoolType } from '@/shared/types'
import Captcha from '@/shared/components/Captcha'
import { authApi } from '../../services'
import { Section } from '../FormControls'

const boards: BoardType[] = ['CBSE', 'ICSE', 'JKBOSE', 'StateBoard', 'IGCSE', 'Other']
const schoolTypes: SchoolType[] = ['Private', 'Government', 'CoachingCentre', 'College']

function errorMessage(error: unknown) {
  return (error as { response?: { data?: { message?: string } } })?.response?.data?.message
}

export default function SchoolRegisterForm({ onSuccess }: { onSuccess: (message: string) => void }) {
  const [captcha, setCaptcha] = useState<string | undefined>()
  const [school, setSchool] = useState({
    schoolName: '', city: '', state: '', phone: '', email: '',
    type: 'Private' as SchoolType, board: 'CBSE' as BoardType,
    adminFirstName: '', adminLastName: '', adminEmail: '', adminPassword: '', adminPhone: '',
  })

  const registerSchool = useMutation({
    mutationFn: () => authApi.registerSchool({ ...school, captchaToken: captcha }),
    onSuccess: (response) => onSuccess(response.message),
    onError: (error) => toast.error(errorMessage(error) ?? 'Could not register school'),
  })

  return (
    <div className="space-y-4">
      <Section title="School details" />
      <input className="input" placeholder="School name *" value={school.schoolName} onChange={(event) => setSchool((current) => ({ ...current, schoolName: event.target.value }))} />
      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="City" value={school.city} onChange={(event) => setSchool((current) => ({ ...current, city: event.target.value }))} />
        <input className="input" placeholder="State" value={school.state} onChange={(event) => setSchool((current) => ({ ...current, state: event.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select className="input" value={school.type} onChange={(event) => setSchool((current) => ({ ...current, type: event.target.value as SchoolType }))}>
          {schoolTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <select className="input" value={school.board} onChange={(event) => setSchool((current) => ({ ...current, board: event.target.value as BoardType }))}>
          {boards.map((board) => <option key={board} value={board}>{board}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="School phone" value={school.phone} onChange={(event) => setSchool((current) => ({ ...current, phone: event.target.value }))} />
        <input className="input" placeholder="School email" value={school.email} onChange={(event) => setSchool((current) => ({ ...current, email: event.target.value }))} />
      </div>

      <Section title="Admin account" />
      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="First name *" value={school.adminFirstName} onChange={(event) => setSchool((current) => ({ ...current, adminFirstName: event.target.value }))} />
        <input className="input" placeholder="Last name *" value={school.adminLastName} onChange={(event) => setSchool((current) => ({ ...current, adminLastName: event.target.value }))} />
      </div>
      <input type="email" className="input" placeholder="Admin email *" value={school.adminEmail} onChange={(event) => setSchool((current) => ({ ...current, adminEmail: event.target.value }))} />
      <div className="grid grid-cols-2 gap-3">
        <input type="password" className="input" placeholder="Password *" value={school.adminPassword} onChange={(event) => setSchool((current) => ({ ...current, adminPassword: event.target.value }))} />
        <input className="input" placeholder="Phone" value={school.adminPhone} onChange={(event) => setSchool((current) => ({ ...current, adminPhone: event.target.value }))} />
      </div>
      <Captcha onChange={setCaptcha} />
      <button onClick={() => registerSchool.mutate()} disabled={registerSchool.isPending} className="btn-primary mt-2 w-full py-3">
        {registerSchool.isPending ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : 'Register school'}
      </button>
    </div>
  )
}
