import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Edit3, Lock, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { roleOrder } from '../../auth/roles'
import { Field, Modal, PageHeader } from '../../components/ui'
import { rolesApi } from '../../api'
import { useAuthStore } from '../../store/authStore'
import type { PermissionModule, RoleDefinition, RolePermission, UserRole } from '../../types'
import toast from 'react-hot-toast'

const modules: PermissionModule[] = ['Dashboard', 'Schools', 'Users', 'Roles', 'Articles', 'Categories']
const permissionFields = [
  { key: 'canView', label: 'View' },
  { key: 'canCreate', label: 'Create' },
  { key: 'canEdit', label: 'Edit' },
  { key: 'canDelete', label: 'Delete' },
  { key: 'canApprove', label: 'Approve' },
] as const

type PermissionForm = Omit<RolePermission, 'id' | 'roleName' | 'roleDisplayName'>

const emptyForm: PermissionForm = {
  roleDefinitionId: '',
  module: 'Articles',
  canView: true,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canApprove: false,
}

export default function RolesPage() {
  const currentRole = useAuthStore(s => s.user?.role)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null)
  const [form, setForm] = useState<PermissionForm>(emptyForm)
  const [roleForm, setRoleForm] = useState({ name: '', displayName: '', description: '', isActive: true })
  const qc = useQueryClient()
  const canEdit = currentRole === 'SuperAdmin'

  const { data: roleDefinitions = [] } = useQuery({
    queryKey: ['role-definitions'],
    queryFn: rolesApi.getRoles,
  })

  useEffect(() => {
    if (!roleDefinitions.length) return
    if (!selectedRoleId || !roleDefinitions.some(role => role.id === selectedRoleId)) {
      setSelectedRoleId(roleDefinitions[0].id)
    }
  }, [roleDefinitions, selectedRoleId])

  const { data = [], isLoading } = useQuery({
    queryKey: ['role-permissions'],
    queryFn: () => rolesApi.getPermissions(),
  })

  const selectedRole = useMemo(
    () => roleDefinitions.find(role => role.id === selectedRoleId) ?? roleDefinitions[0],
    [roleDefinitions, selectedRoleId]
  )

  const rolePermissions = useMemo(
    () => data.filter(p => p.roleDefinitionId === selectedRole?.id).sort((a, b) => a.module.localeCompare(b.module)),
    [data, selectedRole?.id]
  )

  const permissionMap = useMemo(() => {
    const map = new Map<string, RolePermission>()
    data.forEach(p => map.set(`${p.roleDefinitionId}:${p.module}`, p))
    return map
  }, [data])

  const saveMutation = useMutation({
    mutationFn: rolesApi.upsertPermission,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['role-permissions'] })
      toast.success('Permission saved')
      setModalOpen(false)
      setEditingId(null)
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Only Super Admin can edit permissions')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: rolesApi.deletePermission,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['role-permissions'] })
      toast.success('Permission removed')
    },
    onError: () => toast.error('Only Super Admin can delete permissions'),
  })

  const saveRoleMutation = useMutation({
    mutationFn: () => editingRole
      ? rolesApi.updateRole(editingRole.id, {
          displayName: roleForm.displayName,
          description: roleForm.description,
          isActive: roleForm.isActive,
        })
      : rolesApi.createRole(roleForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['role-definitions'] })
      toast.success(editingRole ? 'Role updated' : 'Role added')
      setRoleModalOpen(false)
      setEditingRole(null)
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Unable to save role')
    },
  })

  const deleteRoleMutation = useMutation({
    mutationFn: rolesApi.deleteRole,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['role-definitions'] })
      toast.success('Role deleted')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'System roles cannot be deleted')
    },
  })

  const openAdd = () => {
    if (!selectedRole) {
      toast.error('Add or select a role first')
      return
    }
    setEditingId(null)
    const nextModule = modules.find(module => !permissionMap.has(`${selectedRole.id}:${module}`)) ?? 'Dashboard'
    setForm({ ...emptyForm, roleDefinitionId: selectedRole.id, module: nextModule })
    setModalOpen(true)
  }

  const openAddRole = () => {
    setEditingRole(null)
    setRoleForm({ name: '', displayName: '', description: '', isActive: true })
    setRoleModalOpen(true)
  }

  const openEditRole = (role: RoleDefinition) => {
    setEditingRole(role)
    setRoleForm({
      name: role.name,
      displayName: role.displayName,
      description: role.description ?? '',
      isActive: role.isActive,
    })
    setRoleModalOpen(true)
  }

  const openEdit = (permission: RolePermission) => {
    setEditingId(permission.id)
    setForm({
      roleDefinitionId: permission.roleDefinitionId,
      module: permission.module,
      canView: permission.canView,
      canCreate: permission.canCreate,
      canEdit: permission.canEdit,
      canDelete: permission.canDelete,
      canApprove: permission.canApprove,
    })
    setModalOpen(true)
  }

  const save = () => {
    if (!form.roleDefinitionId) {
      toast.error('Select a role')
      return
    }
    saveMutation.mutate(form)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <PageHeader title="Roles & Permissions" subtitle="Manage what each role can do in every module"
        action={canEdit ? <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={15} />Add Permission</button> : undefined} />

      <div className="grid gap-5 p-5 lg:grid-cols-[20rem_1fr] lg:p-8">
        <aside className="space-y-3">
          <div className="rounded-lg border border-sky-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase text-sky-600">Roles</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">Add/edit role records here. System roles drive login today.</p>
              </div>
              {canEdit && <button onClick={openAddRole} className="rounded-lg bg-sky-600 p-2 text-white hover:bg-emerald-600"><Plus size={16} /></button>}
            </div>
          </div>

          {roleDefinitions.map(roleDef => {
            const isKnownAuthRole = roleOrder.includes(roleDef.name as UserRole)
            const active = selectedRole?.id === roleDef.id
            const count = data.filter(p => p.roleDefinitionId === roleDef.id).length
            return (
              <div key={roleDef.id}
                className={`w-full rounded-lg border p-4 text-left transition-all ${active ? 'border-sky-300 bg-sky-50 shadow-md' : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/60'}`}>
                <button onClick={() => setSelectedRoleId(roleDef.id)} className="w-full text-left">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${active ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <ShieldCheck size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-black text-slate-900">{roleDef.displayName}</div>
                    <div className="text-xs text-slate-500">{count} permission rows {isKnownAuthRole ? '' : '- custom role'}</div>
                  </div>
                </div>
                </button>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className={roleDef.isActive ? 'badge-green' : 'badge-gray'}>{roleDef.isActive ? 'Active' : 'Inactive'}</span>
                  {canEdit && (
                    <div className="flex gap-1">
                      <button onClick={() => openEditRole(roleDef)} className="rounded-md p-1.5 text-slate-400 hover:bg-sky-100 hover:text-sky-700"><Edit3 size={14} /></button>
                      {!roleDef.isSystemRole && <button onClick={() => { if (confirm('Delete this role?')) deleteRoleMutation.mutate(roleDef.id) }} className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </aside>

        <main className="space-y-5">
          <section className="overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm">
            <div className="border-b border-sky-100 bg-gradient-to-r from-sky-600 to-emerald-500 p-5 text-white">
              <div className="text-xs font-black uppercase text-white/70">Selected Role</div>
              <h2 className="mt-1 text-2xl font-black">{selectedRole?.displayName ?? 'Select a role'}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/82">
                {selectedRole?.description ?? 'Choose a role from the left to configure module permissions.'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-3 text-left text-xs font-black uppercase text-slate-500">Module</th>
                    {permissionFields.map(field => <th key={field.key} className="px-4 py-3 text-center text-xs font-black uppercase text-slate-500">{field.label}</th>)}
                    <th className="px-5 py-3 text-right text-xs font-black uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">Loading role permissions...</td></tr>
                  ) : rolePermissions.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">No permission rows yet. Add one to start.</td></tr>
                  ) : rolePermissions.map(permission => (
                    <tr key={permission.id} className="hover:bg-sky-50/40">
                      <td className="px-5 py-4">
                        <div className="font-black text-slate-900">{permission.module}</div>
                        <div className="text-xs text-slate-400">Module access rule</div>
                      </td>
                      {permissionFields.map(field => (
                        <td key={field.key} className="px-4 py-4 text-center">
                          <PermissionDot enabled={permission[field.key]} />
                        </td>
                      ))}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(permission)} disabled={!canEdit}
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:opacity-40">
                            <Edit3 size={15} />
                          </button>
                          <button onClick={() => { if (confirm('Delete this permission row?')) deleteMutation.mutate(permission.id) }} disabled={!canEdit}
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-900">About adding new roles</h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
              New role records can now be selected here and given module permissions. User login still uses the five system login roles until user assignment is moved to database-backed role definitions.
            </p>
          </section>
        </main>
      </div>

      <Modal title={editingId ? 'Edit Permission' : 'Add Permission'} open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Role">
              <select className="input" value={form.roleDefinitionId} onChange={e => setForm(f => ({ ...f, roleDefinitionId: e.target.value }))} disabled={!!editingId}>
                {roleDefinitions.map(role => <option key={role.id} value={role.id}>{role.displayName}</option>)}
              </select>
            </Field>
            <Field label="Module">
              <select className="input" value={form.module} onChange={e => setForm(f => ({ ...f, module: e.target.value as PermissionModule }))}>
                {modules.map(module => <option key={module} value={module}>{module}</option>)}
              </select>
            </Field>
          </div>

          <div className="rounded-lg border border-slate-200">
            {permissionFields.map(field => (
              <label key={field.key} className="flex items-center justify-between border-b border-slate-100 px-4 py-3 last:border-b-0">
                <span className="text-sm font-bold text-slate-700">{field.label}</span>
                <input type="checkbox" checked={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={save} disabled={saveMutation.isPending} className="btn-primary flex-1">
              {saveMutation.isPending ? 'Saving...' : 'Save Permission'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal title={editingRole ? 'Edit Role' : 'Add Role'} open={roleModalOpen} onClose={() => setRoleModalOpen(false)}>
        <div className="space-y-4">
          <Field label="Role Key">
            <input className="input" value={roleForm.name} onChange={e => setRoleForm(f => ({ ...f, name: e.target.value }))}
              disabled={!!editingRole} placeholder="Principal" />
          </Field>
          <Field label="Display Name">
            <input className="input" value={roleForm.displayName} onChange={e => setRoleForm(f => ({ ...f, displayName: e.target.value }))}
              placeholder="Principal" />
          </Field>
          <Field label="Description">
            <textarea className="input min-h-24" value={roleForm.description} onChange={e => setRoleForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What this role is responsible for..." />
          </Field>
          <label className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
            <span className="text-sm font-bold text-slate-700">Active</span>
            <input type="checkbox" checked={roleForm.isActive} onChange={e => setRoleForm(f => ({ ...f, isActive: e.target.checked }))} />
          </label>
          <div className="rounded-lg bg-sky-50 px-4 py-3 text-xs leading-5 text-slate-600">
            After saving, select this role in the left panel and add module permissions.
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setRoleModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={() => saveRoleMutation.mutate()} disabled={saveRoleMutation.isPending || !roleForm.name || !roleForm.displayName} className="btn-primary flex-1">
              {saveRoleMutation.isPending ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function PermissionDot({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
      <Check size={16} />
    </span>
  ) : (
    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-300 ring-1 ring-slate-200">
      <Lock size={15} />
    </span>
  )
}
