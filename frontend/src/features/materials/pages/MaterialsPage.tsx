import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { CheckCircle2, Download, ExternalLink, FileText, Loader2, MessageCircle, Trash2, Upload, X, XCircle } from 'lucide-react'
import { materialsApi } from '../services'
import { canCreateMaterials, canDeleteStudyContent } from '@/shared/auth/roles'
import { useAuthStore } from '@/shared/store/authStore'
import { EmptyState, PageHeader, Pagination, SearchBar, Table } from '@/shared/components/ui'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import type { Material, MaterialStatus, PagedResult } from '@/shared/types'

const statusBadge = (s: MaterialStatus, err?: string) => {
  if (s === 'Ready') return <span className="badge-green inline-flex items-center gap-1"><CheckCircle2 size={11} /> Ready</span>
  if (s === 'Processing') return <span className="badge-yellow inline-flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> Processing</span>
  return (
    <span className="badge-red inline-flex items-center gap-1" title={err ?? 'Ingestion failed'}>
      <XCircle size={11} /> Failed
    </span>
  )
}

const fmtSize = (b: number) => b < 1024 ? `${b} B` : b < 1024*1024 ? `${(b/1024).toFixed(1)} KB` : `${(b/1024/1024).toFixed(1)} MB`

export default function MaterialsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [viewing, setViewing] = useState<Material | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const qc = useQueryClient()
  const role = useAuthStore(s => s.user?.role)
  const canUpload = canCreateMaterials(role)
  const canDelete = canDeleteStudyContent(role)

  const { data, isLoading } = useQuery({
    queryKey: ['materials', page, search],
    queryFn: () => materialsApi.getAll({ page, pageSize: 20, search }),
    refetchInterval: q => {
      const items = (q.state.data as { items?: Material[] } | undefined)?.items ?? []
      return items.some(m => m.status === 'Processing') ? 4000 : false
    },
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: 'always',
  })

  const upload = useMutation({
    mutationFn: (file: File) => materialsApi.upload(file),
    onSuccess: (material) => {
      qc.setQueriesData<PagedResult<Material>>({ queryKey: ['materials'] }, old => {
        if (!old) return old

        const exists = old.items.some(m => m.id === material.id)
        const items = exists
          ? old.items.map(m => m.id === material.id ? material : m)
          : [material, ...old.items].slice(0, old.pageSize)

        return { ...old, items, totalCount: exists ? old.totalCount : old.totalCount + 1 }
      })
      qc.invalidateQueries({ queryKey: ['materials'] })
      toast.success(material.status === 'Ready'
        ? 'Material uploaded and indexed'
        : material.status === 'Failed'
          ? 'Material uploaded but indexing failed'
          : 'Material uploaded — indexing started')
    },
    onError: (e: { response?: { data?: { message?: string } } }) => toast.error(e?.response?.data?.message ?? 'Upload failed'),
  })

  const del = useMutation({
    mutationFn: materialsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['materials'] }); toast.success('Material deleted') },
  })

  return (
    <div>
      <PageHeader title="Materials"
        subtitle={canUpload
          ? `${data?.totalCount ?? 0} documents · indexed for AI tutor`
          : `${data?.totalCount ?? 0} documents · ask the tutor about any of these`}
        action={canUpload ? (
          <>
            <input ref={fileRef} type="file" accept="application/pdf" hidden
              onChange={e => { const f = e.target.files?.[0]; if (f) upload.mutate(f); e.target.value = '' }} />
            <button onClick={() => fileRef.current?.click()} disabled={upload.isPending}
              className="btn-primary flex items-center gap-2">
              {upload.isPending ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {upload.isPending ? 'Uploading...' : 'Upload PDF'}
            </button>
          </>
        ) : undefined} />

      <div className="p-6">
        <div className="card">
          <div className="px-4 py-3 border-b border-gray-100">
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Search materials..." />
          </div>
          <Table headers={['Title', 'Pages', 'Chunks', 'Size', 'Uploaded By', 'Status', 'Date', 'Actions']} loading={isLoading}>
            {!data?.items?.length ? <EmptyState message="No materials yet — upload a PDF to begin." /> :
              data.items.flatMap(m => [
                <tr key={m.id} className={`hover:bg-gray-50/50 transition-colors ${m.status === 'Failed' ? 'bg-red-50/40' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-primary flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{m.title}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">{m.fileName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{m.pageCount || '—'}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{m.chunkCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{fmtSize(m.fileSize)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{m.uploadedByName}</td>
                  <td className="px-4 py-3">{statusBadge(m.status, m.errorMessage)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/tutor?materialId=${m.id}`} title="Tutor Me"
                        className={`text-gray-400 ${m.status === 'Ready' ? 'hover:text-primary' : 'opacity-40 pointer-events-none'} transition-colors`}>
                        <MessageCircle size={14} />
                      </Link>
                      <button onClick={() => setViewing(m)} title="View PDF"
                        className="text-gray-400 hover:text-primary transition-colors">
                        <FileText size={14} />
                      </button>
                      {canDelete && (
                        <button onClick={() => { if (confirm('Delete material?')) del.mutate(m.id) }}
                          className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>,
                m.status === 'Failed' && m.errorMessage ? (
                  <tr key={`${m.id}-err`} className="bg-red-50/40">
                    <td colSpan={8} className="px-4 py-2 text-xs text-red-700 border-t border-red-100">
                      <span className="font-semibold">Ingestion error:</span> {m.errorMessage}
                    </td>
                  </tr>
                ) : null
              ])}
          </Table>
          <Pagination page={page} totalPages={data?.totalPages ?? 1} onPage={setPage} />
        </div>
      </div>

      {viewing && <PdfViewer material={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}

// ── In-app PDF viewer ────────────────────────────────────────────
// Uses the browser's native PDF renderer via an <iframe>. No extra
// dependency. fileUrl is the API-served path (/files/**), proxied in dev.
function PdfViewer({ material, onClose }: { material: Material; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <FileText size={16} className="text-primary flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900">{material.title}</div>
            <div className="truncate text-xs text-slate-400">{material.fileName} · {material.pageCount || '—'} pages</div>
          </div>
          <a href={material.fileUrl} target="_blank" rel="noreferrer" title="Open in new tab"
            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-primary">
            <ExternalLink size={15} />
          </a>
          <a href={material.fileUrl} download={material.fileName} title="Download"
            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-primary">
            <Download size={15} />
          </a>
          <button onClick={onClose} title="Close"
            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
        {/* PDF */}
        <iframe
          src={material.fileUrl}
          title={material.title}
          className="h-full w-full flex-1 bg-slate-100"
        />
      </div>
    </div>
  )
}
