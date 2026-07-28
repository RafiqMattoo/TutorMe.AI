import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { authApi } from '../services'
import type { UserRole } from '../../../shared/types/index.ts'
import Captcha from '../../../../src/shared/components/Captcha'
import { Field, Section } from './FormControls'
import { PasswordInput } from './FormControls'
import Select from "react-select";
function err(e: unknown) {
  return (
    e as {
      response?: {
        data?: {
          message?: string
        }
      }
    }
  )?.response?.data?.message
}


export default function MemberRegisterForm({
  onSuccess
}: {
  onSuccess: (message: string) => void
}) {

  const [captcha, setCaptcha] = useState<string | undefined>()

  const { data: schools } = useQuery({
    queryKey: ['public-schools'],
    queryFn: authApi.publicSchools
  })


const options =
  (schools ?? []).map((school) => ({
    value: school.id,
    label: school.name,
  }));



  const [member, setMember] = useState({

    schoolId: '',

    role: 'Student' as UserRole,

    firstName: '',
    lastName: '',

    email: '',

    password: '',

    confirmPassword: '',

    termsAccepted: false,

    phone: '',

    gradeLevel: '',
    rollNumber: '',

    dateOfBirth: '',

    guardianName: '',
    guardianPhone: '',

  })


  const registerMember = useMutation({

    mutationFn: () => {

      const {
        confirmPassword,
        termsAccepted,
        ...memberData
      } = member


      return authApi.registerMember({

        ...memberData,

        dateOfBirth: member.dateOfBirth
          ? new Date(member.dateOfBirth).toISOString()
          : null,

        captchaToken: captcha

      })

    },

    onSuccess: r => onSuccess(r.message),

    onError: e =>
      toast.error(
        err(e) ?? 'Could not submit registration'
      ),

  })


  return (

    <div className="space-y-3">

      <Section title="Your school" />
{/* 
            <Field id="schoolId" label="School *">
  <div className="relative">

    <select
      id="schoolId"
      value={member.schoolId}
      onChange={(e) =>
        setMember((m) => ({
          ...m,
          schoolId: e.target.value,
        }))
      }
      className="
            w-full
            appearance-none
            rounded-xl
            border
            border-slate-300
            bg-white
            px-4
            py-2.5
            pr-10
            text-sm
            text-slate-700
            shadow-sm
            transition-all
            outline-none
            hover:border-[var(--color-primary-400)]
            focus:border-[var(--color-primary-600)]
            focus:ring-2
            focus:ring-[var(--color-primary-100)]
"
    >
      <option value="">Select your school</option>

      {(schools ?? []).map((school) => (
        <option key={school.id} value={school.id}>
          {school.name}
        </option>
      ))}
    </select>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 9l-7 7-7-7"
      />
    </svg>

  </div>
                </Field> */}
                <Field id="schoolId" label="School *">
  <Select
    options={options}
    placeholder="Select your school"
    value={options.find((o) => o.value === member.schoolId)}
    onChange={(selected) =>
      setMember((m) => ({
        ...m,
        schoolId: selected?.value ?? "",
      }))
    }
    isSearchable
    styles={{
      control: (base, state) => ({
        ...base,
        minHeight: 32,
        borderRadius: 12,
        borderColor: state.isFocused ? "#2563eb" : "#cbd5e1",
        boxShadow: state.isFocused
          ? "0 0 0 3px rgba(37,99,235,0.15)"
          : "none",
        "&:hover": {
          borderColor: "#2563eb",
        },
      }),
      placeholder: (base) => ({
        ...base,
        color: "#94a3b8",
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? "#2563eb"
          : state.isFocused
          ? "#eff6ff"
          : "#fff",
        color: state.isSelected ? "#fff" : "#334155",
        cursor: "pointer",
      }),
      menu: (base) => ({
        ...base,
        borderRadius: 12,
        overflow: "hidden",
      }),
    }}
  />
</Field>

      


      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

        <Field id="firstName" label="First name *">
          <input
            id="firstName"
            className="input"
            placeholder="First name *"
            value={member.firstName}
            onChange={e =>
              setMember(m => ({
                ...m,
                firstName: e.target.value
              }))
            }
          />
        </Field>


        <Field id="lastName" label="Last name *">
          <input
            id="lastName"
            className="input"
            placeholder="Last name *"
            value={member.lastName}
            onChange={e =>
              setMember(m => ({
                ...m,
                lastName: e.target.value
              }))
            }
          />
        </Field>

      </div>


      <Field id="memberEmail" label="Email *">
        <input
          id="memberEmail"
          type="email"
          className="input"
          placeholder="Email *"
          value={member.email}
          onChange={e =>
            setMember(m => ({
              ...m,
              email: e.target.value
            }))
          }
        />
      </Field>


      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

        <Field id="password" label="Password *">
          <PasswordInput
            id="password"
            placeholder="Password *"
            value={member.password}
            onChange={(value) =>
                setMember((m) => ({
                ...m,
                password: value,
                }))
            }
            />

        </Field>

                <Field id="confirmPassword" label="Confirm password *">
                        <PasswordInput
                            id="confirmPassword"
                            placeholder="Confirm Password *"
                            value={member.confirmPassword}
                            onChange={(value) =>
                            setMember((m) => ({
                                ...m,
                                confirmPassword: value,
                            }))
                            }
                        />
                        </Field>

      </div>


      <Field id="memberPhone" label="Phone">
        <input
          id="memberPhone"
          className="input"
          placeholder="Phone"
          value={member.phone}
          onChange={e =>
            setMember(m => ({
              ...m,
              phone: e.target.value
            }))
          }
        />
      </Field>


      <label
        htmlFor="termsAccepted"
        className="flex items-start gap-2 text-sm text-slate-600"
      >

        <input
          id="termsAccepted"
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={member.termsAccepted}
          onChange={e =>
            setMember(m => ({
              ...m,
              termsAccepted: e.target.checked
            }))
          }
        />

        <span>
          I agree to Terms &amp; Conditions
        </span>

      </label>


      <Captcha onChange={setCaptcha} />

      <button
        onClick={() => {
          if (member.password !== member.confirmPassword) {
            toast.error("Passwords do not match")
            return
          }

          if (!member.termsAccepted) {
            toast.error("Please accept Terms & Conditions")
            return
          }

          registerMember.mutate()
        }}
        disabled={registerMember.isPending}
        className="btn-primary mt-2 flex w-full items-center justify-center gap-2 py-3"
      >
        {registerMember.isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Signing Up...
          </>
        ) : (
          "Sign Up"
        )}
      </button>

    </div>

  )

}