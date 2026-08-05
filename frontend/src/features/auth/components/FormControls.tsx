import { useState } from 'react'
import clsx from 'clsx'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'


export function Field({
  id,
  label,
  children
}: {
  id: string
  label: string
  children: React.ReactNode
}) {

  return (

    <div>

      <label
        htmlFor={id}
        className="mb-1 block text-[12px] font-semibold text-slate-600"
      >
        {label}
      </label>

      {children}

    </div>

  )

}


export function Section({
  title
}: {
  title: string
}) {

  return (

    <div className="border-b border-slate-100 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
      {title}
    </div>

  )

}


export function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  sub
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
  sub: string
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 rounded-xl border p-2 text-left transition-all",
        active
          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
          : "border-slate-200 hover:bg-slate-50"
      )}
    >
      <Icon
        size={18}
        className={
          active ? "text-blue-600 shrink-0" : "text-slate-400 shrink-0"
        }
      />

      <div className="flex flex-col">
        <span className="text-[13px] font-bold text-slate-700">
          {label}
        </span>

        <span className="text-[11px] text-slate-400 leading-4">
          {sub}
        </span>
      </div>
    </button>

  )

}


export function PasswordInput({
  id,
  placeholder,
  value,
  onChange
}: {
  id: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {

  const [visible, setVisible] = useState(false)

  return (

    <div className="relative">

      <input
        id={id}
        type={visible ? 'text' : 'password'}
        className="input pr-10"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />

      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>

    </div>

  )

}


export function ModernSelect({
  id,
  value,
  onChange,
  children
}: {
  id: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {

  return (

    <div className="relative">

      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={clsx(
          "input appearance-none rounded-2xl pr-9 transition-all",
          "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
        )}
      >
        {children}
      </select>
        +
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

    </div>

  )

}