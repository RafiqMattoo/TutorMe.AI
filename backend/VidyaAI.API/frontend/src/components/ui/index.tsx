import React from 'react'
import { Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

// ── STAT CARD ────────────────────────────────────────────────────
const statColors: Record<string, { bg: string; icon: string; border: string }> = {
  blue:   { bg: 'bg-blue-50',    icon: 'text-blue-600',   border: 'border-blue-100'   },
  teal:   { bg: 'bg-teal-50',    icon: 'text-teal-600',   border: 'border-teal-100'   },
  green:  { bg: 'bg-emerald-50', icon: 'text-emerald-600',border: 'border-emerald-100'},
  purple: { bg: 'bg-violet-50',  icon: 'text-violet-600', border: 'border-violet-100' },
  orange: { bg: 'bg-amber-50',   icon: 'text-amber-600',  border: 'border-amber-100'  },
  indigo: { bg: 'bg-indigo-50',  icon: 'text-indigo-600', border: 'border-indigo-100' },
}

export function StatCard({ title, value, delta, icon: Icon, color = 'blue' }:
  { title: string; value: string | number; delta?: string; icon: React.ElementType; color?: string }
) {
  const c = statColors[color] ?? statColors.blue
  return (
    <div className="card-hover group p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', c.bg, c.border, 'border')}>
          <Icon size={18} className={c.icon} />
        </div>
        {delta && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200/70">
            {delta}
          </span>
        )}
      </div>
      <div className="text-[26px] font-black text-slate-900 leading-none">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="mt-1.5 text-[13px] font-medium text-slate-500">{title}</div>
    </div>
  )
}

// ── TABLE ────────────────────────────────────────────────────────
export function Table({ headers, children, loading }: {
  headers: string[]; children: React.ReactNode; loading?: boolean
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            {headers.map(h => (
              <th key={h} className="table-header-cell">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-12 text-center">
                <Loader2 className="mx-auto animate-spin text-blue-500" size={22} />
                <p className="mt-2 text-[12px] text-slate-400">Loading…</p>
              </td>
            </tr>
          ) : children}
        </tbody>
      </table>
    </div>
  )
}

// ── MODAL ────────────────────────────────────────────────────────
export function Modal({ title, open, onClose, children }: {
  title: string; open: boolean; onClose: () => void; children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-fade-in overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-1.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ── PAGE HEADER ──────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: React.ReactNode
}) {
  return (
    <div
      className="flex items-center justify-between bg-white px-5 py-5 lg:px-8"
      style={{ borderBottom: '1px solid #E2E8F0' }}
    >
      <div>
        <h1 className="text-[22px] font-black tracking-tight text-slate-900">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-[13px] font-medium text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

// ── SEARCH BAR ───────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search…'}
        className="input max-w-xs"
      />
    </div>
  )
}

// ── EMPTY STATE ──────────────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return (
    <tr>
      <td colSpan={100} className="px-4 py-14 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
          <span className="text-xl">📭</span>
        </div>
        <p className="text-[13px] font-medium text-slate-500">{message}</p>
      </td>
    </tr>
  )
}

// ── PAGINATION ───────────────────────────────────────────────────
export function Pagination({ page, totalPages, onPage }: {
  page: number; totalPages: number; onPage: (p: number) => void
}) {
  if (totalPages <= 1) return null
  return (
    <div
      className="flex items-center justify-between px-5 py-3"
      style={{ borderTop: '1px solid #F1F5F9' }}
    >
      <span className="text-[12px] font-medium text-slate-500">
        Page <span className="font-bold text-slate-700">{page}</span> of {totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-[12px] disabled:opacity-40"
        >
          <ChevronLeft size={14} /> Prev
        </button>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-[12px] disabled:opacity-40"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ── SELECT ───────────────────────────────────────────────────────
export function Select({ label, options, ...props }: {
  label?: string; options: { value: string; label: string }[]
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <select {...props} className="input appearance-none">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// ── FORM FIELD ───────────────────────────────────────────────────
export function Field({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-[12px] font-medium text-red-500">{error}</p>}
    </div>
  )
}

// ── STATUS BADGE ─────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Published: 'badge-green', Live:      'badge-green', Active:    'badge-green',
    Draft:     'badge-yellow', Trial:    'badge-yellow', Pending:  'badge-yellow',
    Archived:  'badge-gray',  Inactive: 'badge-gray',
    Expired:   'badge-red',   Cancelled:'badge-red',
  }
  return (
    <span className={clsx(map[status] ?? 'badge-gray')}>
      <span className={clsx(
        'h-1.5 w-1.5 rounded-full',
        (map[status] ?? 'badge-gray').includes('green')  ? 'bg-emerald-500' :
        (map[status] ?? 'badge-gray').includes('yellow') ? 'bg-amber-500'  :
        (map[status] ?? 'badge-gray').includes('red')    ? 'bg-red-500'    : 'bg-slate-400',
      )} />
      {status}
    </span>
  )
}
