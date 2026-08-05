import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import clsx from 'clsx'

import type { FieldError } from 'react-hook-form'
import type { DatePickerInputProps } from '@/shared/types/index'

const formatDateValue = (value?: string | Date | null) => {
  if (!value) return ''
  if (value instanceof Date) {
    const year = value.getFullYear()
    const month = `${value.getMonth() + 1}`.padStart(2, '0')
    const day = `${value.getDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  return value
}

const parseDateString = (value: string) => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? null : date
}

const getMonthLabel = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

const buildCalendarDays = (currentMonth: Date) => {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDay = firstDay.getDay()
  const days: Array<{ date: Date; inMonth: boolean }> = []

  for (let i = 0; i < startDay; i += 1) {
    const date = new Date(year, month, i - startDay + 1)
    days.push({ date, inMonth: false })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({ date: new Date(year, month, day), inMonth: true })
  }

  while (days.length % 7 !== 0) {
    const lastDate = days[days.length - 1]?.date
    const nextDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1)
    days.push({ date: nextDate, inMonth: false })
  }

  return days
}

export default function DatePickerInput({
  name,
  label = 'Date',
  required = false,
  optional = false,
  placeholder = 'Select date',
  disabled = false,
  error,
  className,
  value,
  onChange,
}: DatePickerInputProps) {
  const form = useFormContext()
  const [selectedDate, setSelectedDate] = useState<string>(formatDateValue(value))
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [internalError, setInternalError] = useState<string | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedDate(formatDateValue(value))
  }, [value])

  useEffect(() => {
    if (!isOpen) return

    const onClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isOpen])

  const calendarDays = useMemo(() => buildCalendarDays(currentMonth), [currentMonth])

  const handleSelectDate = (nextValue: string, fieldChange?: (value: string) => void) => {
    setSelectedDate(nextValue)
    setInternalError(null)
    fieldChange?.(nextValue)
    onChange?.(nextValue)
    setIsOpen(false)
  }

  const clearValue = (fieldChange?: (value: string) => void) => {
    setSelectedDate('')
    setInternalError(null)
    fieldChange?.('')
    onChange?.('')
  }

  const renderPicker = (
    fieldValue: string,
    fieldChange?: (value: string) => void,
    fieldError?: FieldError | string,
  ) => {
    const currentError = internalError ?? (typeof fieldError === 'string' ? fieldError : fieldError?.message) ?? (typeof error === 'string' ? error : error?.message)
    const hasError = Boolean(currentError)
    const parsedDate = parseDateString(fieldValue)

    return (
      <div className={clsx('w-full', className)}>
        {label && (
          <div className="mb-2 flex items-center">
            <label className="text-sm font-medium text-[var(--color-text)]">{label}</label>
            {required && !optional && <span className="ml-1 text-red-500">*</span>}
          </div>
        )}

        <div className="relative" ref={wrapperRef}>
          <div
            className={clsx(
              'flex h-11 w-full items-center justify-between rounded-xl border bg-[var(--color-surface)] px-4 text-left text-sm shadow-sm transition-all duration-200',
              hasError
                ? 'border-[var(--color-danger)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-primary-400)] focus-within:border-[var(--color-primary-600)] focus-within:ring-2 focus-within:ring-[var(--color-primary-100)]',
              disabled && 'cursor-not-allowed bg-[var(--color-surface-muted)] opacity-60',
            )}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => !disabled && setIsOpen((current) => !current)}
              className="flex flex-1 items-center justify-between text-left"
            >
              <span className={clsx('truncate', fieldValue ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]')}>
                {fieldValue ? parsedDate?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : placeholder}
              </span>
              <CalendarDays size={17} className="ml-2 shrink-0 text-slate-400" />
            </button>

            {fieldValue && !disabled && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  clearValue(fieldChange)
                }}
                className="ml-2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear date"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {isOpen && !disabled && (
            <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10">
              <div className="mb-3 flex items-center justify-between">
                <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                  <ChevronLeft size={16} />
                </button>
                <div className="text-sm font-semibold text-slate-800">{getMonthLabel(currentMonth)}</div>
                <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, index) => {
                  const isSelected = parsedDate && item.date.toDateString() === parsedDate.toDateString()
                  const isToday = item.date.toDateString() === new Date().toDateString()
                  return (
                    <button
                      key={`${item.date.toISOString()}-${index}`}
                      type="button"
                      onClick={() => handleSelectDate(`${item.date.getFullYear()}-${`${item.date.getMonth() + 1}`.padStart(2, '0')}-${`${item.date.getDate()}`.padStart(2, '0')}`, fieldChange)}
                      className={clsx(
                        'h-9 rounded-lg text-sm transition',
                        item.inMonth ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300',
                        isSelected && 'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)]',
                        isToday && !isSelected && 'bg-[var(--color-primary-50)] font-semibold text-[var(--color-primary-700)]',
                      )}
                    >
                      {item.date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <p className="mt-1.5 min-h-[16px] text-xs text-[var(--color-danger)]">{currentError ?? ''}</p>
      </div>
    )
  }

  if (name && form?.control) {
    return (
      <Controller
        control={form.control}
        name={name}
        defaultValue=""
        render={({ field, fieldState }) => renderPicker(typeof field.value === 'string' ? field.value : '', field.onChange, fieldState.error?.message)}
      />
    )
  }

  return renderPicker(selectedDate, (nextValue) => {
    if (value === undefined) setSelectedDate(nextValue)
  })
}
