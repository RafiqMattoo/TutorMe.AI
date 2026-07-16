import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft, Check, ChevronLeft, ChevronRight, Loader2, RotateCcw,
  Shuffle, Sparkles, X,
} from 'lucide-react'
import { flashcardsApi } from '../services'
import clsx from 'clsx'
import type { Flashcard } from '../../../shared/types/index.ts'

type Verdict = 'known' | 'review'

export default function StudyFlashcardsPage() {
  const { id } = useParams()
  const nav = useNavigate()

  const { data: set, isLoading } = useQuery({
    queryKey: ['flashcard-set', id], queryFn: () => flashcardsApi.getById(id!), enabled: !!id,
  })

  const [order, setOrder] = useState<number[]>([])
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({})
  const [done, setDone] = useState(false)

  // Build the working order once the set loads (and on restart/shuffle).
  useEffect(() => {
    if (set) setOrder(set.cards.map((_, i) => i))
  }, [set])

  const cards = set?.cards ?? []
  const total = order.length
  const card: Flashcard | undefined = cards[order[pos]]

  const knownCount = useMemo(
    () => Object.values(verdicts).filter(v => v === 'known').length, [verdicts])
  const reviewCount = useMemo(
    () => Object.values(verdicts).filter(v => v === 'review').length, [verdicts])

  const goNext = () => {
    setFlipped(false)
    if (pos >= total - 1) setDone(true)
    else setPos(p => p + 1)
  }
  const goPrev = () => { setFlipped(false); setPos(p => Math.max(0, p - 1)) }

  const mark = (v: Verdict) => {
    if (!card) return
    setVerdicts(prev => ({ ...prev, [card.id]: v }))
    goNext()
  }

  const restart = (cardIdxs?: number[]) => {
    setOrder(cardIdxs ?? cards.map((_, i) => i))
    setPos(0); setFlipped(false); setDone(false)
    if (!cardIdxs) setVerdicts({})
  }

  const shuffle = () => {
    const arr = [...order]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    setOrder(arr); setPos(0); setFlipped(false)
  }

  const reviewMissed = () => {
    const missed = cards.map((c, i) => ({ c, i })).filter(({ c }) => verdicts[c.id] === 'review').map(({ i }) => i)
    if (missed.length) restart(missed)
  }

  // Keyboard: space/enter flip, arrows navigate, K known, J review.
  useEffect(() => {
    if (!set || done) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(f => !f) }
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key.toLowerCase() === 'k') mark('known')
      else if (e.key.toLowerCase() === 'j') mark('review')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [set, done, card, pos, total])

  if (isLoading || !set) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" /></div>
  }

  return (
    <div>
      <div className="px-6 py-5 border-b border-slate-100 bg-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => nav('/flashcards')} className="text-slate-400 hover:text-slate-600">
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 truncate">{set.title}</h1>
            <p className="text-sm text-slate-500 mt-0.5 truncate">{set.materialTitle ?? 'Unattached'} · {total} cards</p>
          </div>
        </div>
        {!done && (
          <div className="flex items-center gap-2">
            <button onClick={shuffle} className="btn-secondary text-xs"><Shuffle size={13} /> Shuffle</button>
            <button onClick={() => restart()} className="btn-secondary text-xs"><RotateCcw size={13} /> Restart</button>
          </div>
        )}
      </div>

      {done ? (
        <Summary
          total={total} known={knownCount} review={reviewCount}
          onRestart={() => restart()} onReviewMissed={reviewMissed} onBack={() => nav('/flashcards')}
        />
      ) : (
        <div className="p-6 max-w-2xl mx-auto">
          {/* progress + tallies */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Card {pos + 1} of {total}</span>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="text-emerald-600">{knownCount} known</span>
              <span className="text-amber-600">{reviewCount} to review</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${((pos + 1) / total) * 100}%` }} />
          </div>

          {/* flip card */}
          <div className="[perspective:1600px]">
            <button onClick={() => setFlipped(f => !f)}
              className="group w-full text-left"
              style={{ minHeight: 340 }}>
              <div className={clsx('relative w-full transition-transform duration-500 [transform-style:preserve-3d]')}
                style={{ minHeight: 340, transform: flipped ? 'rotateY(180deg)' : 'none' }}>
                {/* front */}
                <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-slate-200 bg-white shadow-card p-8 flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-slate-400 mb-4">Question</span>
                  <div className="flex-1 flex items-center justify-center overflow-y-auto">
                    <div className="text-xl font-medium text-slate-800 text-center whitespace-pre-wrap leading-relaxed">
                      {card?.front}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 text-center mt-4">Click or press Space to reveal</div>
                </div>
                {/* back */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-blue-200 bg-blue-50/40 shadow-card p-8 flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-blue-500 mb-4">Answer</span>
                  <div className="flex-1 overflow-y-auto">
                    <div className="text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {card?.back}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 text-center mt-4">Click to see the question</div>
                </div>
              </div>
            </button>
          </div>

          {/* mark known / review */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button onClick={() => mark('review')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition-all hover:bg-amber-100 active:scale-[0.98]">
              <X size={16} /> Review again
            </button>
            <button onClick={() => mark('known')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-[0.98]">
              <Check size={16} /> I knew this
            </button>
          </div>

          {/* prev / next */}
          <div className="mt-5 flex items-center justify-between">
            <button onClick={goPrev} disabled={pos === 0} className="btn-secondary disabled:opacity-40">
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="text-xs text-slate-400 hidden sm:block">Space flip · ← → move · K known · J review</span>
            <button onClick={goNext} className="btn-primary">
              {pos >= total - 1 ? 'Finish' : 'Next'} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Summary({ total, known, review, onRestart, onReviewMissed, onBack }: {
  total: number; known: number; review: number
  onRestart: () => void; onReviewMissed: () => void; onBack: () => void
}) {
  const pct = total ? Math.round((known / total) * 100) : 0
  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="card p-8 text-center">
        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={24} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Deck complete!</h2>
        <p className="text-sm text-slate-500 mb-6">You reviewed all {total} cards.</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-emerald-50 px-3 py-3">
            <div className="text-xl font-bold text-emerald-700">{known}</div>
            <div className="text-[11px] font-medium text-emerald-600">Known</div>
          </div>
          <div className="rounded-xl bg-amber-50 px-3 py-3">
            <div className="text-xl font-bold text-amber-700">{review}</div>
            <div className="text-[11px] font-medium text-amber-600">To review</div>
          </div>
          <div className="rounded-xl bg-slate-100 px-3 py-3">
            <div className="text-xl font-bold text-slate-700">{pct}%</div>
            <div className="text-[11px] font-medium text-slate-500">Mastery</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {review > 0 && (
            <button onClick={onReviewMissed} className="btn-primary w-full">
              <RotateCcw size={14} /> Review {review} missed card{review > 1 ? 's' : ''}
            </button>
          )}
          <button onClick={onRestart} className="btn-secondary w-full">
            <RotateCcw size={14} /> Restart whole deck
          </button>
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-700 mt-1">Back to flashcards</button>
        </div>
      </div>
    </div>
  )
}
