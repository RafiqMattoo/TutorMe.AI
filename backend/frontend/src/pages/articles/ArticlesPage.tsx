import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Eye, Heart, MessageSquare, Plus, Send, Trash2, XCircle, Edit2 } from 'lucide-react'
import { articlesApi } from '../../api'
import { EmptyState, PageHeader, Pagination, SearchBar, StatusBadge, Table } from '../../components/ui'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import type { ArticleStatus } from '../../types'
import clsx from 'clsx'

const STATUS_FILTERS: { label: string; value: ArticleStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Published', value: 'Published' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Archived', value: 'Archived' },
]

export default function ArticlesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ArticleStatus | ''>('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['articles', page, search, status],
    queryFn: () => articlesApi.getAll({ page, pageSize: 20, search, status: status || undefined }),
  })

  const publishMutation = useMutation({
    mutationFn: articlesApi.publish,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['articles'] }); toast.success('Article published') },
  })
  const unpublishMutation = useMutation({
    mutationFn: articlesApi.unpublish,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['articles'] }); toast.success('Article unpublished') },
  })
  const deleteMutation = useMutation({
    mutationFn: articlesApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['articles'] }); toast.success('Article deleted') },
  })

  const contentTypeIcon = (type: string) => {
    if (type === 'YouTube') return <span className="badge-red">YT</span>
    if (type === 'Image') return <span className="badge-blue">IMG</span>
    return <span className="badge-gray">TXT</span>
  }

  return (
    <div>
      <PageHeader title="Articles" subtitle={`${data?.totalCount ?? 0} total articles`}
        action={<Link to="/articles/new" className="btn-primary flex items-center gap-2"><Plus size={14} />New Article</Link>} />

      <div className="p-6">
        <div className="card">
          <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Search articles..." />
            <div className="flex gap-1">
              {STATUS_FILTERS.map(f => (
                <button key={f.value} onClick={() => { setStatus(f.value); setPage(1) }}
                  className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    status === f.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <Table headers={['Title', 'Type', 'Category', 'Author', 'Engagement', 'Status', 'Date', 'Actions']} loading={isLoading}>
            {!data?.items?.length ? <EmptyState message="No articles found." /> :
              data.items.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 max-w-xs">
                    <div className="text-sm font-medium text-gray-900 truncate">{a.title}</div>
                    {a.tags && <div className="text-xs text-gray-400 mt-0.5">{a.tags}</div>}
                  </td>
                  <td className="px-4 py-3">{contentTypeIcon(a.contentType)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.categoryName ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.authorName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Eye size={11} />{a.viewCount}</span>
                      <span className="flex items-center gap-1"><Heart size={11} />{a.likeCount}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={11} />{a.commentCount}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {a.publishedAt ? formatDistanceToNow(new Date(a.publishedAt), { addSuffix: true })
                      : formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Link to={`/articles/${a.id}/edit`} className="text-gray-400 hover:text-primary transition-colors"><Edit2 size={14} /></Link>
                      {a.status === 'Draft'
                        ? <button onClick={() => publishMutation.mutate(a.id)} title="Publish" className="text-gray-400 hover:text-green-600 transition-colors"><Send size={14} /></button>
                        : <button onClick={() => unpublishMutation.mutate(a.id)} title="Unpublish" className="text-gray-400 hover:text-yellow-600 transition-colors"><XCircle size={14} /></button>}
                      <button onClick={() => { if (confirm('Delete article?')) deleteMutation.mutate(a.id) }}
                        className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
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
