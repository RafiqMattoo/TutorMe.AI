import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { articlesApi, categoriesApi } from '../services'
import { Field } from '../../../shared/components/ui/index.tsx'
import { useAuthStore } from '../../../shared/store/authStore.ts'
import toast from 'react-hot-toast'
import clsx from 'clsx'

type ContentType = 'Text' | 'Image' | 'YouTube'

export default function ArticleFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const user = useAuthStore(s => s.user)

  const [form, setForm] = useState({
    title: '', body: '', coverImageUrl: '', youtubeUrl: '', tags: '',
    contentType: 'Text' as ContentType, categoryId: '', scheduledAt: ''
  })

  const { data: article } = useQuery({
    queryKey: ['article', id], queryFn: () => articlesApi.getById(id!), enabled: isEdit
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'], queryFn: categoriesApi.getAll
  })

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title, body: article.body,
        coverImageUrl: article.coverImageUrl ?? '', youtubeUrl: article.youtubeUrl ?? '',
        tags: article.tags ?? '', contentType: article.contentType,
        categoryId: article.categoryId ?? '', scheduledAt: ''
      })
    }
  }, [article])

  const saveMutation = useMutation({
    mutationFn: (data: object) => isEdit
      ? articlesApi.update(id!, data)
      : articlesApi.create({ ...data, schoolId: user?.schoolId }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['articles'] })
      toast.success(isEdit ? 'Article updated' : 'Article saved as draft')
      navigate('/articles')
    },
    onError: () => toast.error('Failed to save article'),
  })

  const publishMutation = useMutation({
    mutationFn: async (data: object) => {
      const res = isEdit ? await articlesApi.update(id!, data) : await articlesApi.create({ ...data, schoolId: user?.schoolId })
      await articlesApi.publish(res.id)
      return res
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['articles'] })
      toast.success('Article published!')
      navigate('/articles')
    },
    onError: () => toast.error('Failed to publish'),
  })

  const getFormData = () => ({
    title: form.title, body: form.body,
    coverImageUrl: form.coverImageUrl || null,
    youtubeUrl: form.youtubeUrl || null,
    tags: form.tags || null,
    contentType: form.contentType,
    categoryId: form.categoryId || null,
    scheduledAt: form.scheduledAt || null,
  })

  return (
    <div>
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/articles')} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{isEdit ? 'Edit Article' : 'New Article'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Fill in the details below</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => saveMutation.mutate(getFormData())} disabled={saveMutation.isPending}
            className="btn-secondary flex items-center gap-2">
            <Save size={14} />{saveMutation.isPending ? 'Saving...' : 'Save Draft'}
          </button>
          <button onClick={() => publishMutation.mutate(getFormData())} disabled={publishMutation.isPending}
            className="btn-primary flex items-center gap-2">
            <Send size={14} />{publishMutation.isPending ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-5 space-y-4">
              <Field label="Article Title">
                <input className="input text-base" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Enter a clear, descriptive title..." />
              </Field>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Content Type</label>
                <div className="flex gap-2">
                  {(['Text', 'Image', 'YouTube'] as ContentType[]).map(type => (
                    <button key={type} onClick={() => setForm(f => ({ ...f, contentType: type }))}
                      className={clsx('px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        form.contentType === type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                      {type === 'YouTube' ? '▶ YouTube' : type}
                    </button>
                  ))}
                </div>
              </div>

              {form.contentType === 'YouTube' && (
                <Field label="YouTube URL">
                  <input className="input" value={form.youtubeUrl}
                    onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..." />
                </Field>
              )}

              <Field label="Body Content">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-4">
                    {['B', 'I', 'H1', 'H2', 'Link', 'List'].map(t => (
                      <button key={t} className="text-xs font-medium text-gray-600 hover:text-primary transition-colors px-1">{t}</button>
                    ))}
                  </div>
                  <textarea rows={12} value={form.body}
                    onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                    className="w-full px-4 py-3 text-sm text-gray-800 focus:outline-none resize-none"
                    placeholder="Write your article content here..." />
                </div>
              </Field>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Article Settings</h3>
              <Field label="Category">
                <select className="input" value={form.categoryId}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                  <option value="">Select category</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Cover Image URL">
                <input className="input" value={form.coverImageUrl}
                  onChange={e => setForm(f => ({ ...f, coverImageUrl: e.target.value }))}
                  placeholder="https://..." />
                {form.coverImageUrl && (
                  <img src={form.coverImageUrl} alt="Preview"
                    className="mt-2 w-full h-28 object-cover rounded-lg border border-gray-200" />
                )}
              </Field>
              <Field label="Tags (comma separated)">
                <input className="input" value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="#CBSE, #Science, #Class10" />
              </Field>
              <Field label="Schedule Publish (optional)">
                <input type="datetime-local" className="input" value={form.scheduledAt}
                  onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} />
              </Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
