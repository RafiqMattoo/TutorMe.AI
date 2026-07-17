import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Pencil, GraduationCap } from 'lucide-react'
import toast from 'react-hot-toast'
import { academicsApi, studentsApi } from '../services'
import { EmptyState, PageHeader, Pagination, SearchBar, StatusBadge, Table } from '../../../shared/components/ui/index.tsx'
import { useAuthStore } from '../../../shared/store/authStore.ts'
import type { StudentStatus } from '../../../shared/types/index.ts'

const STATUSES: StudentStatus[] = ['Active', 'Inactive', 'TransferredOut', 'Graduated', 'Alumni']
const statusColors: Record<StudentStatus, string> = {
  Active: 'badge-green', Inactive: 'badge-gray', TransferredOut: 'badge-yellow', Graduated: 'badge-blue', Alumni: 'badge-purple',
}

export default function StudentsPage() {
  const sid = useAuthStore(s => s.user?.schoolId)
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<StudentStatus | ''>('')

  const { data: classes } = useQuery({ queryKey: ['classes', sid], queryFn: () => academicsApi.classes(sid) })
  const { data, isLoading } = useQuery({
    queryKey: ['students', sid, page, search, classFilter, statusFilter],
    queryFn: () => studentsApi.getAll({
      page, pageSize: 20, search: search || undefined,
      classId: classFilter || undefined, status: statusFilter || undefined, schoolId: sid,
    }),
  })

  const del = useMutation({
    mutationFn: (id: string) => studentsApi.delete(id, sid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['students'] }); toast.success('Student removed') },
  })

  return (
    <div>
      <PageHeader title="Students" subtitle={`${data?.totalCount ?? 0} students enrolled`}
        action={<button onClick={() => navigate('/students/new')} className="btn-primary flex items-center gap-2"><Plus size={14} />Add Student</button>} />

      <div className="space-y-5 p-5 lg:p-8">
        <div className="card">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Search name / admission / roll…" />
            <select className="input max-w-[180px]" value={classFilter} onChange={e => { setClassFilter(e.target.value); setPage(1) }}>
              <option value="">All classes</option>
              {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="input max-w-[160px]" value={statusFilter} onChange={e => { setStatusFilter(e.target.value as StudentStatus | ''); setPage(1) }}>
              <option value="">All statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Table headers={['Student', 'Admission #', 'Class / Section', 'Roll', 'Category', 'Status', 'Actions']} loading={isLoading}>
            {!data?.items?.length ? <EmptyState message="No students found. Add your first student." /> :
              data.items.map(s => (
                <tr key={s.id} className="cursor-pointer transition-colors hover:bg-slate-50/70" onClick={() => navigate(`/students/${s.id}/edit`)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-950 text-xs font-bold text-white">
                        {s.photoUrl ? <img src={s.photoUrl} alt="" className="h-full w-full object-cover" /> : <GraduationCap size={16} />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{s.fullName}</div>
                        <div className="text-xs text-slate-400">{s.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">{s.admissionNumber}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{s.className ?? '—'}{s.sectionName ? ` · ${s.sectionName}` : ''}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{s.rollNumber ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{s.category}</td>
                  <td className="px-4 py-3"><span className={statusColors[s.status]}>{s.status}</span></td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/students/${s.id}/edit`)} className="text-slate-400 transition-colors hover:text-blue-600"><Pencil size={14} /></button>
                      <button onClick={() => { if (confirm(`Remove ${s.fullName}?`)) del.mutate(s.id) }}
                        className="text-slate-400 transition-colors hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
          </Table>
          <Pagination page={page} totalPages={data?.totalPages ?? 1} onPage={setPage} />
        </div>
      </div>
    </div>
  )
}
