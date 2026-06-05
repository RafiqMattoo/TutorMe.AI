import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, RotateCcw } from 'lucide-react'
import { flashcardsApi } from '../../api'
import clsx from 'clsx'

export default function StudyFlashcardsPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const { data: set, isLoading } = useQuery({
    queryKey: ['flashcard-set', id], queryFn: () => flashcardsApi.getById(id!), enabled: !!id,
  })

  if (isLoading || !set) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" /></div>
  }

  const card = set.cards[index]
  const total = set.cards.length

  const next = () => { setFlipped(false); setIndex(i => Math.min(total - 1, i + 1)) }
  const prev = () => { setFlipped(false); setIndex(i => Math.max(0, i - 1)) }
  const reset = () => { setIndex(0); setFlipped(false) }

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => nav('/flashcards')} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{set.title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{set.materialTitle ?? 'Unattached'} · {total} cards</p>
          </div>
        </div>
        <button onClick={reset} className="btn-secondary flex items-center gap-2 text-xs">
          <RotateCcw size={13} /> Restart
        </button>
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        <div className="text-xs text-gray-500 text-center mb-3">Card {index + 1} of {total}</div>

        <button onClick={() => setFlipped(f => !f)}
          className={clsx('w-full min-h-[280px] rounded-2xl border border-gray-200 bg-white shadow-sm',
            'p-8 flex flex-col items-center justify-center text-center transition-all hover:shadow-md',
            flipped ? 'bg-primary/5 border-primary/30' : '')}>
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-4">
            {flipped ? 'Answer' : 'Question'}
          </div>
          <div className="text-lg text-gray-800 whitespace-pre-wrap">
            {flipped ? card.back : card.front}
          </div>
          <div className="text-xs text-gray-400 mt-6">Click to {flipped ? 'see question' : 'reveal answer'}</div>
        </button>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={prev} disabled={index === 0}
            className="btn-secondary flex items-center gap-1 disabled:opacity-40">
            <ChevronLeft size={14} /> Prev
          </button>
          <div className="flex-1 mx-6 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all"
              style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
          <button onClick={next} disabled={index === total - 1}
            className="btn-primary flex items-center gap-1 disabled:opacity-40">
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
