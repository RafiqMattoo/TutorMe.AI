import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Edit2, Bus, Route as RouteIcon, MapPin, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { studentsApi, transportApi } from '../services'
import { EmptyState, Field, Modal, PageHeader, StatusBadge, Table, Tabs } from '../../../shared/components/ui/index.tsx'
import { useAuthStore } from '../../../shared/store/authStore.ts'
import type { TransportFeeFrequency } from '../../../shared/types/index.ts'

const FREQS: TransportFeeFrequency[] = ['Monthly', 'Quarterly', 'HalfYearly', 'Annual']
const freqLabel = (f: TransportFeeFrequency) => (f === 'HalfYearly' ? 'Half-Yearly' : f)
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

const TABS = [
  { key: 'vehicles', label: 'Vehicles', icon: Bus },
  { key: 'routes', label: 'Routes', icon: RouteIcon },
  { key: 'stops', label: 'Stops', icon: MapPin },
  { key: 'allocations', label: 'Student Transport', icon: UserCheck },
] as const
type TabKey = typeof TABS[number]['key']

export default function TransportPage() {
  const [tab, setTab] = useState<TabKey>('vehicles')
  return (
    <div>
      <PageHeader title="Transport" subtitle="Fleet, routes, stops, and per-student transport with fares" />
      <div className="px-5 pt-5 lg:px-8"><Tabs tabs={TABS} active={tab} onChange={setTab} fullWidth /></div>
      <div className="p-5 lg:p-8">
        {tab === 'vehicles' && <VehiclesTab />}
        {tab === 'routes' && <RoutesTab />}
        {tab === 'stops' && <StopsTab />}
        {tab === 'allocations' && <AllocationsTab />}
      </div>
    </div>
  )
}

function useSchoolId() { return useAuthStore(s => s.user?.schoolId) }
function FormActions({ editing, pending, onCancel, onSave }: { editing: boolean; pending: boolean; onCancel: () => void; onSave: () => void }) {
  return (
    <div className="flex gap-3 pt-2">
      <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
      <button onClick={onSave} disabled={pending} className="btn-primary flex-1">{pending ? 'Saving…' : editing ? 'Update' : 'Create'}</button>
    </div>
  )
}

// ── Vehicles ────────────────────────────────────────────────────────
function VehiclesTab() {
  const sid = useSchoolId(); const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ registrationNumber: '', model: '', capacity: 40, driverName: '', driverPhone: '', notes: '', isActive: true })

  const { data, isLoading } = useQuery({ queryKey: ['vehicles', sid], queryFn: () => transportApi.vehicles(sid) })
  const save = useMutation({
    mutationFn: () => transportApi.saveVehicle({ ...form, schoolId: sid }, editId ?? undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vehicles'] }); toast.success('Saved'); setOpen(false) },
    onError: (e: unknown) => toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to save vehicle'),
  })
  const del = useMutation({
    mutationFn: (id: string) => transportApi.deleteVehicle(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vehicles'] }); toast.success('Deleted') },
  })
  const create = () => { setEditId(null); setForm({ registrationNumber: '', model: '', capacity: 40, driverName: '', driverPhone: '', notes: '', isActive: true }); setOpen(true) }
  return (
    <>
      <div className="mb-3 flex justify-end"><button onClick={create} className="btn-primary flex items-center gap-2"><Plus size={14} />Add Vehicle</button></div>
      <div className="card">
        <Table headers={['Registration', 'Model', 'Capacity', 'Driver', 'Routes', 'Status', 'Actions']} loading={isLoading}>
          {!data?.length ? <EmptyState message="No vehicles yet. Add your first bus." /> :
            data.map(v => (
              <tr key={v.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-4 py-3 text-sm font-bold text-slate-900">{v.registrationNumber}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{v.model ?? '—'}</td>
                <td className="px-4 py-3 text-center text-sm text-slate-500">{v.capacity}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{v.driverName ?? '—'}{v.driverPhone ? ` · ${v.driverPhone}` : ''}</td>
                <td className="px-4 py-3 text-center text-sm text-slate-500">{v.routeCount}</td>
                <td className="px-4 py-3"><StatusBadge status={v.isActive ? 'Active' : 'Inactive'} /></td>
                <td className="px-4 py-3"><div className="flex gap-2">
                  <button onClick={() => { setEditId(v.id); setForm({ registrationNumber: v.registrationNumber, model: v.model ?? '', capacity: v.capacity, driverName: v.driverName ?? '', driverPhone: v.driverPhone ?? '', notes: v.notes ?? '', isActive: v.isActive }); setOpen(true) }} className="text-slate-400 hover:text-blue-600"><Edit2 size={14} /></button>
                  <button onClick={() => { if (confirm('Delete vehicle?')) del.mutate(v.id) }} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
        </Table>
      </div>
      <Modal title={editId ? 'Edit Vehicle' : 'Add Vehicle'} open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Registration Number"><input className="input" value={form.registrationNumber} onChange={e => setForm(f => ({ ...f, registrationNumber: e.target.value }))} placeholder="e.g. JK01AB1234" /></Field>
            <Field label="Capacity"><input type="number" className="input" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: +e.target.value }))} /></Field>
          </div>
          <Field label="Model (optional)"><input className="input" value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} placeholder="e.g. Tata Starbus" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Driver Name"><input className="input" value={form.driverName} onChange={e => setForm(f => ({ ...f, driverName: e.target.value }))} /></Field>
            <Field label="Driver Phone"><input className="input" value={form.driverPhone} onChange={e => setForm(f => ({ ...f, driverPhone: e.target.value }))} /></Field>
          </div>
          <Field label="Notes (optional)"><input className="input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></Field>
          <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" className="rounded" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} /> Active</label>
          <FormActions editing={!!editId} pending={save.isPending} onCancel={() => setOpen(false)} onSave={() => save.mutate()} />
        </div>
      </Modal>
    </>
  )
}

// ── Routes ──────────────────────────────────────────────────────────
function RoutesTab() {
  const sid = useSchoolId(); const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', code: '', description: '', vehicleId: '', fare: 0, feeFrequency: 'Monthly' as TransportFeeFrequency, isActive: true })

  const { data: vehicles } = useQuery({ queryKey: ['vehicles', sid], queryFn: () => transportApi.vehicles(sid) })
  const { data, isLoading } = useQuery({ queryKey: ['routes', sid], queryFn: () => transportApi.routes(sid) })
  const save = useMutation({
    mutationFn: () => transportApi.saveRoute({ ...form, vehicleId: form.vehicleId || undefined, schoolId: sid }, editId ?? undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['routes'] }); toast.success('Saved'); setOpen(false) },
    onError: () => toast.error('Failed to save route'),
  })
  const del = useMutation({
    mutationFn: (id: string) => transportApi.deleteRoute(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['routes'] }); toast.success('Deleted') },
  })
  const create = () => { setEditId(null); setForm({ name: '', code: '', description: '', vehicleId: '', fare: 0, feeFrequency: 'Monthly', isActive: true }); setOpen(true) }
  return (
    <>
      <div className="mb-3 flex justify-end"><button onClick={create} className="btn-primary flex items-center gap-2"><Plus size={14} />Add Route</button></div>
      <div className="card">
        <Table headers={['Route', 'Code', 'Vehicle', 'Fare', 'Stops', 'Students', 'Status', 'Actions']} loading={isLoading}>
          {!data?.length ? <EmptyState message="No routes yet." /> :
            data.map(r => (
              <tr key={r.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-4 py-3 text-sm font-bold text-slate-900">{r.name}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{r.code ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{r.vehicleName ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{inr(r.fare)} <span className="text-[11px] text-slate-400">/ {freqLabel(r.feeFrequency)}</span></td>
                <td className="px-4 py-3 text-center text-sm text-slate-500">{r.stopCount}</td>
                <td className="px-4 py-3 text-center text-sm text-slate-500">{r.studentCount}</td>
                <td className="px-4 py-3"><StatusBadge status={r.isActive ? 'Active' : 'Inactive'} /></td>
                <td className="px-4 py-3"><div className="flex gap-2">
                  <button onClick={() => { setEditId(r.id); setForm({ name: r.name, code: r.code ?? '', description: r.description ?? '', vehicleId: r.vehicleId ?? '', fare: r.fare, feeFrequency: r.feeFrequency, isActive: r.isActive }); setOpen(true) }} className="text-slate-400 hover:text-blue-600"><Edit2 size={14} /></button>
                  <button onClick={() => { if (confirm('Delete route?')) del.mutate(r.id) }} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
        </Table>
      </div>
      <Modal title={editId ? 'Edit Route' : 'Add Route'} open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. North Loop" /></Field>
            <Field label="Code (optional)"><input className="input" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. R1" /></Field>
          </div>
          <Field label="Vehicle (optional)">
            <select className="input" value={form.vehicleId} onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))}>
              <option value="">— Unassigned —</option>
              {vehicles?.map(v => <option key={v.id} value={v.id}>{v.registrationNumber}{v.model ? ` (${v.model})` : ''}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fare (₹)"><input type="number" className="input" value={form.fare} onChange={e => setForm(f => ({ ...f, fare: +e.target.value }))} /></Field>
            <Field label="Billing">
              <select className="input" value={form.feeFrequency} onChange={e => setForm(f => ({ ...f, feeFrequency: e.target.value as TransportFeeFrequency }))}>
                {FREQS.map(fr => <option key={fr} value={fr}>{freqLabel(fr)}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description (optional)"><input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
          <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" className="rounded" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} /> Active</label>
          <FormActions editing={!!editId} pending={save.isPending} onCancel={() => setOpen(false)} onSave={() => save.mutate()} />
        </div>
      </Modal>
    </>
  )
}

// ── Stops ───────────────────────────────────────────────────────────
function StopsTab() {
  const sid = useSchoolId(); const qc = useQueryClient()
  const [routeId, setRouteId] = useState('')
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', sortOrder: 0, pickupTime: '', dropTime: '', stopFare: '' })

  const { data: routes } = useQuery({ queryKey: ['routes', sid], queryFn: () => transportApi.routes(sid) })
  const effectiveRoute = routeId || routes?.[0]?.id || ''
  const { data, isLoading } = useQuery({
    queryKey: ['stops', sid, effectiveRoute],
    queryFn: () => transportApi.stops(effectiveRoute, sid),
    enabled: !!effectiveRoute,
  })
  const save = useMutation({
    mutationFn: () => transportApi.saveStop({ ...form, routeId: effectiveRoute, stopFare: form.stopFare === '' ? undefined : +form.stopFare, schoolId: sid }, editId ?? undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stops'] }); qc.invalidateQueries({ queryKey: ['routes'] }); toast.success('Saved'); setOpen(false) },
    onError: () => toast.error('Failed to save stop'),
  })
  const del = useMutation({
    mutationFn: (id: string) => transportApi.deleteStop(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stops'] }); qc.invalidateQueries({ queryKey: ['routes'] }); toast.success('Deleted') },
  })
  const create = () => { setEditId(null); setForm({ name: '', sortOrder: (data?.length ?? 0) + 1, pickupTime: '', dropTime: '', stopFare: '' }); setOpen(true) }
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <select className="input max-w-xs" value={effectiveRoute} onChange={e => setRouteId(e.target.value)}>
          {!routes?.length && <option value="">No routes yet</option>}
          {routes?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <button onClick={create} disabled={!effectiveRoute} className="btn-primary flex items-center gap-2 disabled:opacity-50"><Plus size={14} />Add Stop</button>
      </div>
      {!routes?.length && <p className="mb-3 text-sm text-amber-600">Add a route first — stops belong to a route.</p>}
      <div className="card">
        <Table headers={['#', 'Stop', 'Pickup', 'Drop', 'Stop Fare', 'Actions']} loading={isLoading}>
          {!data?.length ? <EmptyState message="No stops on this route yet." /> :
            data.map(s => (
              <tr key={s.id} className="transition-colors hover:bg-slate-50/70">
                <td className="w-12 px-4 py-3 text-center text-sm text-slate-400">{s.sortOrder}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{s.name}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{s.pickupTime ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{s.dropTime ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{s.stopFare != null ? inr(s.stopFare) : '—'}</td>
                <td className="px-4 py-3"><div className="flex gap-2">
                  <button onClick={() => { setEditId(s.id); setForm({ name: s.name, sortOrder: s.sortOrder, pickupTime: s.pickupTime ?? '', dropTime: s.dropTime ?? '', stopFare: s.stopFare?.toString() ?? '' }); setOpen(true) }} className="text-slate-400 hover:text-blue-600"><Edit2 size={14} /></button>
                  <button onClick={() => { if (confirm('Delete stop?')) del.mutate(s.id) }} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
        </Table>
      </div>
      <Modal title={editId ? 'Edit Stop' : 'Add Stop'} open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stop Name"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. City Centre" /></Field>
            <Field label="Order"><input type="number" className="input" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: +e.target.value }))} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Pickup Time"><input className="input" value={form.pickupTime} onChange={e => setForm(f => ({ ...f, pickupTime: e.target.value }))} placeholder="07:45" /></Field>
            <Field label="Drop Time"><input className="input" value={form.dropTime} onChange={e => setForm(f => ({ ...f, dropTime: e.target.value }))} placeholder="14:30" /></Field>
          </div>
          <Field label="Stop Fare (₹, optional — overrides route fare)"><input type="number" className="input" value={form.stopFare} onChange={e => setForm(f => ({ ...f, stopFare: e.target.value }))} /></Field>
          <FormActions editing={!!editId} pending={save.isPending} onCancel={() => setOpen(false)} onSave={() => save.mutate()} />
        </div>
      </Modal>
    </>
  )
}

// ── Student Transport allocations ───────────────────────────────────
function AllocationsTab() {
  const sid = useSchoolId(); const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ studentId: '', routeId: '', stopId: '', fare: 0, isActive: true })

  const { data: routes } = useQuery({ queryKey: ['routes', sid], queryFn: () => transportApi.routes(sid) })
  const { data: students } = useQuery({ queryKey: ['student-options', sid], queryFn: () => studentsApi.options(sid) })
  const { data: stops } = useQuery({
    queryKey: ['stops', sid, form.routeId],
    queryFn: () => transportApi.stops(form.routeId, sid),
    enabled: !!form.routeId,
  })
  const { data, isLoading } = useQuery({ queryKey: ['allocations', sid], queryFn: () => transportApi.allocations(sid) })
  const ready = !!routes?.length && !!students?.length

  const save = useMutation({
    mutationFn: () => transportApi.saveAllocation({ ...form, stopId: form.stopId || undefined, schoolId: sid }, editId ?? undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['allocations'] }); qc.invalidateQueries({ queryKey: ['routes'] }); toast.success('Saved'); setOpen(false) },
    onError: (e: unknown) => toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to save allocation'),
  })
  const del = useMutation({
    mutationFn: (id: string) => transportApi.deleteAllocation(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['allocations'] }); qc.invalidateQueries({ queryKey: ['routes'] }); toast.success('Removed') },
  })
  const create = () => {
    const r0 = routes?.[0]
    setEditId(null); setForm({ studentId: students?.[0]?.id ?? '', routeId: r0?.id ?? '', stopId: '', fare: r0?.fare ?? 0, isActive: true }); setOpen(true)
  }
  // When the route changes during create/edit, default the fare to the route's fare.
  const onRouteChange = (rid: string) => {
    const r = routes?.find(x => x.id === rid)
    setForm(f => ({ ...f, routeId: rid, stopId: '', fare: editId ? f.fare : (r?.fare ?? f.fare) }))
  }
  return (
    <>
      <div className="mb-3 flex justify-end"><button onClick={create} disabled={!ready} className="btn-primary flex items-center gap-2 disabled:opacity-50"><Plus size={14} />Assign Student</button></div>
      {!ready && <p className="mb-3 text-sm text-amber-600">Add at least one route and one active student first.</p>}
      <div className="card">
        <Table headers={['Student', 'Admission #', 'Route', 'Stop', 'Fare', 'Status', 'Actions']} loading={isLoading}>
          {!data?.length ? <EmptyState message="No students assigned to transport yet." /> :
            data.map(a => (
              <tr key={a.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-4 py-3 text-sm font-bold text-slate-900">{a.studentName}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{a.admissionNumber}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{a.routeName}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{a.stopName ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{inr(a.fare)}</td>
                <td className="px-4 py-3"><StatusBadge status={a.isActive ? 'Active' : 'Inactive'} /></td>
                <td className="px-4 py-3"><div className="flex gap-2">
                  <button onClick={() => { setEditId(a.id); setForm({ studentId: a.studentId, routeId: a.routeId, stopId: a.stopId ?? '', fare: a.fare, isActive: a.isActive }); setOpen(true) }} className="text-slate-400 hover:text-blue-600"><Edit2 size={14} /></button>
                  <button onClick={() => { if (confirm('Remove allocation?')) del.mutate(a.id) }} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
        </Table>
      </div>
      <Modal title={editId ? 'Edit Allocation' : 'Assign Student to Transport'} open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Student">
            <select className="input" value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}>
              {students?.map(s => <option key={s.id} value={s.id}>{s.name} · {s.admissionNumber}{s.className ? ` · ${s.className}` : ''}</option>)}
            </select>
          </Field>
          <Field label="Route">
            <select className="input" value={form.routeId} onChange={e => onRouteChange(e.target.value)}>
              {routes?.map(r => <option key={r.id} value={r.id}>{r.name} ({inr(r.fare)} / {freqLabel(r.feeFrequency)})</option>)}
            </select>
          </Field>
          <Field label="Stop (optional)">
            <select className="input" value={form.stopId} onChange={e => setForm(f => ({ ...f, stopId: e.target.value }))} disabled={!form.routeId}>
              <option value="">— None —</option>
              {stops?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Fare (₹)"><input type="number" className="input" value={form.fare} onChange={e => setForm(f => ({ ...f, fare: +e.target.value }))} /></Field>
          <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" className="rounded" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} /> Active</label>
          <FormActions editing={!!editId} pending={save.isPending} onCancel={() => setOpen(false)} onSave={() => save.mutate()} />
        </div>
      </Modal>
    </>
  )
}
