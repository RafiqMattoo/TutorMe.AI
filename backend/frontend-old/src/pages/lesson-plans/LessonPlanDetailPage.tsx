import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Clock, FileText, Loader2, Printer } from 'lucide-react'
import { lessonPlansApi } from '../../api'

// Tiny markdown renderer — handles headings, bold, lists, paragraphs.
// Avoids pulling in a markdown library for one page.
function renderMarkdown(md: string) {
  const lines = md.split('\n')
  const out: React.ReactNode[] = []
  let listBuf: string[] = []
  const flushList = () => {
    if (listBuf.length === 0) return
    out.push(
      <ul key={`ul-${out.length}`} className="list-disc ml-6 my-2 space-y-1 text-sm text-gray-700">
        {listBuf.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: inline(li) }} />)}
      </ul>
    )
    listBuf = []
  }
  const inline = (s: string) =>
    s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
     .replace(/\*(.+?)\*/g, '<em>$1</em>')
     .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-gray-100 rounded text-xs">$1</code>')

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.startsWith('## ')) {
      flushList()
      out.push(<h2 key={out.length} className="text-base font-bold text-gray-900 mt-6 mb-2 pb-1 border-b border-gray-100">{line.slice(3)}</h2>)
    } else if (line.startsWith('# ')) {
      flushList()
      out.push(<h1 key={out.length} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.slice(2)}</h1>)
    } else if (line.startsWith('### ')) {
      flushList()
      out.push(<h3 key={out.length} className="text-sm font-semibold text-gray-800 mt-4 mb-1">{line.slice(4)}</h3>)
    } else if (/^\s*[-*]\s+/.test(line)) {
      listBuf.push(line.replace(/^\s*[-*]\s+/, ''))
    } else if (line.trim() === '') {
      flushList()
    } else {
      flushList()
      out.push(<p key={out.length} className="text-sm text-gray-700 leading-relaxed my-2"
        dangerouslySetInnerHTML={{ __html: inline(line) }} />)
    }
  }
  flushList()
  return out
}

export default function LessonPlanDetailPage() {
  const { id } = useParams()
  const nav = useNavigate()

  const { data: plan, isLoading } = useQuery({
    queryKey: ['lesson-plan', id], queryFn: () => lessonPlansApi.getById(id!), enabled: !!id,
  })

  if (isLoading || !plan) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" /></div>
  }

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => nav('/lesson-plans')} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{plan.title}</h1>
            <div className="text-sm text-gray-500 mt-0.5 flex items-center gap-3">
              {plan.subject && <span>{plan.subject}</span>}
              {plan.gradeLevel && <><span>·</span><span>{plan.gradeLevel}</span></>}
              <span>·</span>
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {plan.durationMinutes} min</span>
              {plan.materialTitle && <><span>·</span>
                <span className="inline-flex items-center gap-1"><FileText size={12} /> {plan.materialTitle}</span></>}
            </div>
          </div>
        </div>
        <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 text-xs">
          <Printer size={13} /> Print
        </button>
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        <div className="card p-8 print:shadow-none print:border-0">
          {renderMarkdown(plan.contentMarkdown)}
        </div>
      </div>
    </div>
  )
}
