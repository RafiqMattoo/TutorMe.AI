import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  BookOpen, CalendarCheck, ClipboardList, Headphones, Layers,
  Loader2, MessageCircle, Sparkles,
} from 'lucide-react'
import { format } from 'date-fns'
import { deliveriesApi } from '../../api'
import { PageHeader } from '../../components/ui'
import type { Delivery } from '../../types'

// The browser's local calendar date as YYYY-MM-DD, so "today" matches the
// student's timezone (the server defaults to UTC otherwise).
function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function TodayPage() {
  const today = localToday()
  const { data: deliveries, isLoading } = useQuery({
    queryKey: ['deliveries-today', today],
    queryFn: () => deliveriesApi.getToday(today),
  })

  return (
    <div>
      <PageHeader
        title="Today"
        subtitle={format(new Date(), 'EEEE, d MMMM yyyy')}
      />

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
        ) : !deliveries?.length ? (
          <div className="card p-10 text-center">
            <CalendarCheck size={28} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-sm font-semibold text-gray-700">Nothing delivered today</h3>
            <p className="text-sm text-gray-500 mt-1">When your teacher delivers a lesson, it will appear here to read and practise.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map(d => <DeliveryCard key={d.id} delivery={d} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function DeliveryCard({ delivery: d }: { delivery: Delivery }) {
  const materialReady = d.materialId && d.materialStatus === 'Ready'

  return (
    <div className="card p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Sparkles size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-gray-900">{d.title}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            From {d.createdByName}
            {d.gradeLevel ? ` · ${d.gradeLevel}` : ''}
          </div>
        </div>
      </div>

      {d.instructions && (
        <p className="text-sm text-gray-600 mb-4 whitespace-pre-line border-l-2 border-gray-100 pl-3">
          {d.instructions}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {/* Read / listen / ask — the book */}
        {d.materialId && (
          <>
            {d.materialFileUrl && (
              <a href={d.materialFileUrl} target="_blank" rel="noreferrer"
                className="btn-secondary flex items-center gap-2 text-xs py-2">
                <BookOpen size={14} /> Read book
              </a>
            )}
            <Link to="/recite" className="btn-secondary flex items-center gap-2 text-xs py-2">
              <Headphones size={14} /> Listen
            </Link>
            <Link to="/tutor" className="btn-secondary flex items-center gap-2 text-xs py-2">
              <MessageCircle size={14} /> Ask the tutor
            </Link>
            {!materialReady && (
              <span className="text-xs text-amber-600 self-center">Book still processing…</span>
            )}
          </>
        )}

        {/* Practise — quiz */}
        {d.quizId && (
          <Link to={`/quizzes/${d.quizId}/take`} className="btn-primary flex items-center gap-2 text-xs py-2">
            <ClipboardList size={14} /> Practice quiz
            {d.quizQuestionCount ? ` (${d.quizQuestionCount})` : ''}
          </Link>
        )}

        {/* Practise — flashcards */}
        {d.flashcardSetId && (
          <Link to={`/flashcards/${d.flashcardSetId}/study`} className="btn-primary flex items-center gap-2 text-xs py-2">
            <Layers size={14} /> Study cards
            {d.flashcardCardCount ? ` (${d.flashcardCardCount})` : ''}
          </Link>
        )}
      </div>

      {/* Attached content summary */}
      <div className="text-xs text-gray-400 mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {d.materialTitle && <span>📖 {d.materialTitle}</span>}
        {d.quizTitle && <span>📝 {d.quizTitle}</span>}
        {d.flashcardSetTitle && <span>🃏 {d.flashcardSetTitle}</span>}
      </div>
    </div>
  )
}
