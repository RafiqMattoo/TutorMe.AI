import { Check, ChevronDown, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import clsx from 'clsx'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SearchableDropdownProps {
  /** Required only when the component is used with React Hook Form. */
  name?: string
  label?: string
  options: SelectOption[]
  optional?: boolean
  placeholder?: string
  searchable?: boolean
  disabled?: boolean
  error?: string
  /** Initial value when used without React Hook Form. */
  defaultValue?: string
  /** Makes the standalone component controlled by its parent. */
  value?: string
  /** Runs whenever the selected option changes. */
  onChange?: (value: string) => void
  onBlur?: () => void
  className?: string
}

export default function SearchableDropdown({
  name,
  label,
  options,
  optional = false,
  placeholder,
  searchable = false,
  disabled = false,
  error,
  defaultValue = '',
  value,
  onChange,
  onBlur,
  className,
}: SearchableDropdownProps) {
  const form = useFormContext()
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    if (!searchable || !query) return options
    return options.filter((option) => option.label.toLowerCase().includes(query))
  }, [options, searchText, searchable])

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
        setSearchText('')
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setSearchText('')
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  useEffect(() => {
    if (open && searchable) searchInputRef.current?.focus()
  }, [open, searchable])

  const renderDropdown = (
    selectedValue: string,
    setSelectedValue: (nextValue: string) => void,
    fieldError?: string,
    fieldBlur?: () => void,
  ) => {
    const selected = options.find((option) => option.value === selectedValue)
    const errorMessage = fieldError ?? error
    const hasError = Boolean(errorMessage)

    const closeMenu = () => {
      setOpen(false)
      setSearchText('')
      fieldBlur?.()
      onBlur?.()
    }

    return (
      <div ref={dropdownRef} className={clsx('relative w-full', className)}>
        {label && (
          <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
            {label}
            {!optional && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => !disabled && setOpen((current) => !current)}
          className={clsx(
            'flex h-11 w-full items-center justify-between rounded-xl border bg-[var(--color-surface)] px-4 text-left text-sm shadow-sm transition-all duration-200',
            hasError
              ? 'border-[var(--color-danger)] focus-visible:ring-2 focus-visible:ring-red-100'
              : 'border-[var(--color-border)] hover:border-slate-300 focus-visible:border-[var(--color-primary-600)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-100)]',
            disabled && 'cursor-not-allowed bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] opacity-60',
          )}
        >
          <span className={clsx('truncate', selected ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]')}>
            {selected?.label ?? placeholder ?? `Select ${label ?? 'an option'}`}
          </span>
          <ChevronDown size={17} aria-hidden="true" className={clsx('ml-3 shrink-0 text-slate-400 transition-transform duration-200', open && 'rotate-180')} />
        </button>

        {hasError && <p className="mt-1.5 text-xs font-medium text-[var(--color-danger)]">{errorMessage || 'This field is required'}</p>}

        {open && !disabled && (
          <div className="absolute left-0 top-full z-40 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 animate-fade-in">
            {searchable && (
              <div className="border-b border-slate-100 p-2.5">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-[var(--color-primary-400)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--color-primary-100)]">
                  <Search size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
                  <input ref={searchInputRef} value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder={`Search ${label ?? 'options'}`} className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
                </div>
              </div>
            )}

            <div role="listbox" className="max-h-60 overflow-y-auto p-1.5">
              {filteredOptions.map((option) => {
                const isSelected = option.value === selectedValue
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled}
                    onClick={() => {
                      setSelectedValue(option.value)
                      onChange?.(option.value)
                      closeMenu()
                    }}
                    className={clsx(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                      isSelected ? 'bg-[var(--color-primary-50)] font-semibold text-[var(--color-primary-700)]' : 'text-slate-700 hover:bg-slate-50',
                      option.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check size={16} className="ml-3 shrink-0" aria-hidden="true" />}
                  </button>
                )
              })}
              {!filteredOptions.length && <p className="px-3 py-6 text-center text-sm text-slate-400">No results found</p>}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (name && form?.control) {
    return (
      <Controller
        control={form.control}
        name={name}
        defaultValue={defaultValue}
        render={({ field, fieldState }) =>
          renderDropdown(
            typeof field.value === 'string' ? field.value : '',
            field.onChange,
            fieldState.error?.message,
            field.onBlur,
          )
        }
      />
    )
  }

  const standaloneValue = value ?? uncontrolledValue
  return renderDropdown(standaloneValue, (nextValue) => {
    if (value === undefined) setUncontrolledValue(nextValue)
  })
}
