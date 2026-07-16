import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Clock, Flag,
  Loader2, RotateCcw, Send, Sparkles, XCircle,
} from 'lucide-react'
import { quizzesApi } from '../services'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import type { QuizAttemptResult } from '../../../shared/types/index.ts'

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TakeQuizPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [flagged, setFlagged] = useState<Record<string, boolean>>({})
  const [result, setResult] = useState<QuizAttemptResult | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const timerStopped = useRef(false)

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', id], queryFn: () => quizzesApi.getById(id!), enabled: !!id,
  })

  // Count-up timer; freezes once the attempt is submitted.
  useEffect(() => {
    if (timerStopped.current || result) return
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(t)
  }, [result])

  const submit = useMutation({
    mutationFn: () => quizzesApi.submit(id!, answers),
    onSuccess: r => { timerStopped.current = true; setResult(r) },
    onError: () => toast.error('Failed to submit attempt'),
  })

  const total = quiz?.questions.length ?? 0
  const answered = useMemo(() => Object.keys(answers).length, [answers])
  const q = quiz?.questions[index]

  // Keyboard nav: 1-9 / A-D select option, arrows move, F flags.
  useEffect(() => {
    if (!quiz || result) return
    const onKey = (e: KeyboardEvent) => {
      if (!q) return
      if (e.key === 'ArrowRight') setIndex(i => Math.min(total - 1, i + 1))
      else if (e.key === 'ArrowLeft') setIndex(i => Math.max(0, i - 1))
      else if (e.key.toLowerCase() === 'f') setFlagged(f => ({ ...f, [q.id]: !f[q.id] }))
      else {
        const n = e.key.toUpperCase().charCodeAt(0) - 65 // A=0
        const d = parseInt(e.key, 10) - 1                // 1=0
        const pick = !Number.isNaN(d) && d >= 0 ? d : (n >= 0 && n < 26 ? n : -1)
        if (pick >= 0 && pick < q.options.length) setAnswers(a => ({ ...a, [q.id]: pick }))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [quiz, q, total, result])

  if (isLoading || !quiz) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" /></div>
  }

  if (result) return <QuizResult result={result} timeTaken={elapsed} onBack={() => nav('/quizzes')} />

  const unanswered = total - answered
  const flagCount = Object.values(flagged).filter(Boolean).length

  const doSubmit = () => { setConfirmSubmit(false); submit.mutate() }

  return (
    <div>
      <div className="px-6 py-5 border-b border-slate-100 bg-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => nav('/quizzes')} className="text-slate-400 hover:text-slate-600">
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 truncate">{quiz.title}</h1>
            <p className="text-sm text-slate-500 mt-0.5 truncate">
              {quiz.materialTitle ?? 'Unattached'} · {total} questions · {quiz.difficulty}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
          <Clock size={15} className="text-slate-400" />
          <span className="tabular-nums">{fmtTime(elapsed)}</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 max-w-5xl mx-auto">
        {/* ── Question navigator ─────────────────────────── */}
        <aside className="order-2 lg:order-1">
          <div className="card p-4 lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Questions</span>
              <span className="text-xs text-slate-500">{answered}/{total}</span>
            </div>
            <div className="grid grid-cols-6 lg:grid-cols-5 gap-2">
              {quiz.questions.map((qq, i) => {
                const isAnswered = answers[qq.id] !== undefined
                const isFlagged = flagged[qq.id]
                const isCurrent = i === index
                return (
                  <button key={qq.id} onClick={() => setIndex(i)}
                    title={isFlagged ? 'Flagged for review' : undefined}
                    className={clsx(
                      'relative h-9 rounded-lg text-sm font-semibold transition-all',
                      isCurrent
                        ? 'ring-2 ring-blue-500 ring-offset-1'
                        : '',
                      isAnswered
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}>
                    {i + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-blue-600" /> Answered</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-slate-100 border border-slate-200" /> Unanswered</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-white border border-amber-300 relative"><span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400" /></span> Flagged</div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${(answered / total) * 100}%` }} />
              </div>
              <button onClick={() => setConfirmSubmit(true)} disabled={answered === 0}
                className="btn-primary w-full mt-4 disabled:opacity-50">
                <Send size={14} /> Submit quiz
              </button>
              {flagCount > 0 && (
                <p className="text-[11px] text-amber-600 mt-2 text-center">{flagCount} flagged for review</p>
              )}
            </div>
          </div>
        </aside>

        {/* ── Current question ───────────────────────────── */}
        <main className="order-1 lg:order-2">
          {q && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Question {index + 1} of {total}
                </span>
                <button onClick={() => setFlagged(f => ({ ...f, [q.id]: !f[q.id] }))}
                  className={clsx('inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-1.5 transition-all',
                    flagged[q.id]
                      ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600')}>
                  <Flag size={13} className={flagged[q.id] ? 'fill-amber-500 text-amber-500' : ''} />
                  {flagged[q.id] ? 'Flagged' : 'Flag'}
                </button>
              </div>

              <div className="text-base font-medium text-slate-900 mb-5 leading-relaxed">{q.questionText}</div>
              <div className="space-y-2.5">
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === i
                  return (
                    <button key={i} onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                      className={clsx('w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3',
                        selected
                          ? 'border-blue-500 bg-blue-50 text-slate-900 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700')}>
                      <span className={clsx('inline-flex w-6 h-6 rounded-full border text-xs flex-shrink-0 items-center justify-center font-bold',
                        selected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-400')}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {selected && <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}
              className="btn-secondary disabled:opacity-40">
              <ChevronLeft size={14} /> Prev
            </button>

            <span className="text-xs text-slate-400 hidden sm:block">
              Keys: 1-4 / A-D to answer · ← → to move · F to flag
            </span>

            {index < total - 1 ? (
              <button onClick={() => setIndex(i => Math.min(total - 1, i + 1))} className="btn-primary">
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={() => setConfirmSubmit(true)} disabled={submit.isPending || answered === 0}
                className="btn-primary">
                {submit.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {submit.isPending ? 'Scoring...' : 'Submit'}
              </button>
            )}
          </div>
        </main>
      </div>

      {/* ── Submit confirmation ──────────────────────────── */}
      {confirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          onClick={() => setConfirmSubmit(false)}>
          <div className="card p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Sparkles size={18} className="text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Submit your quiz?</h3>
            </div>
            <p className="text-sm text-slate-500 mb-1">
              You answered <span className="font-semibold text-slate-700">{answered}</span> of {total} questions.
            </p>
            {unanswered > 0 && (
              <p className="text-sm text-amber-600 mb-1">{unanswered} unanswered will be marked incorrect.</p>
            )}
            {flagCount > 0 && (
              <p className="text-sm text-slate-500 mb-1">{flagCount} still flagged for review.</p>
            )}
            <div className="flex gap-2 mt-5">
              <button onClick={() => setConfirmSubmit(false)} className="btn-secondary flex-1">Keep working</button>
              <button onClick={doSubmit} disabled={submit.isPending} className="btn-primary flex-1">
                {submit.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ScoreGauge({ pct, passed }: { pct: number; passed: boolean }) {
  const r = 52
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <div className="relative h-36 w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="12" className="stroke-slate-100" />
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="12" strokeLinecap="round"
          className={passed ? 'stroke-emerald-500' : 'stroke-amber-500'}
          strokeDasharray={`${dash} ${c}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900">{pct}%</span>
        <span className={clsx('text-xs font-semibold', passed ? 'text-emerald-600' : 'text-amber-600')}>
          {passed ? 'Passed' : 'Keep going'}
        </span>
      </div>
    </div>
  )
}

function QuizResult({ result, timeTaken, onBack }: { result: QuizAttemptResult; timeTaken: number; onBack: () => void }) {
  const pct = Math.round((result.score / result.totalQuestions) * 100)
  const passed = pct >= 60
  const incorrect = result.questions.filter(q => q.selectedIndex !== undefined && q.selectedIndex !== null && !q.isCorrect).length
  const skipped = result.questions.filter(q => q.selectedIndex === undefined || q.selectedIndex === null).length

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="card p-8 mb-6 flex flex-col sm:flex-row items-center gap-8">
        <ScoreGauge pct={pct} passed={passed} />
        <div className="flex-1 w-full">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Your result</div>
          <div className="text-2xl font-bold text-slate-900 mb-4">
            {result.score} / {result.totalQuestions} correct
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-center">
              <div className="text-lg font-bold text-emerald-700">{result.score}</div>
              <div className="text-[11px] font-medium text-emerald-600">Correct</div>
            </div>
            <div className="rounded-xl bg-red-50 px-3 py-2.5 text-center">
              <div className="text-lg font-bold text-red-600">{incorrect}</div>
              <div className="text-[11px] font-medium text-red-500">Incorrect</div>
            </div>
            <div className="rounded-xl bg-slate-100 px-3 py-2.5 text-center">
              <div className="text-lg font-bold text-slate-600">{skipped}</div>
              <div className="text-[11px] font-medium text-slate-500">Skipped</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-4">
            <Clock size={13} /> Time taken: <span className="font-semibold text-slate-700">{fmtTime(timeTaken)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-700">Review answers</h2>
        <span className="text-xs text-slate-400">{result.questions.length} questions</span>
      </div>

      <div className="space-y-3">
        {result.questions.map((q, i) => {
          const wasSkipped = q.selectedIndex === undefined || q.selectedIndex === null
          return (
            <div key={q.questionId} className="card p-5">
              <div className="flex items-start gap-3 mb-3">
                {q.isCorrect
                  ? <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  : <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">Q{i + 1}. {q.questionText}</div>
                  {wasSkipped && <span className="text-[11px] font-semibold text-slate-400">Not answered</span>}
                </div>
              </div>
              <div className="space-y-1.5 ml-7">
                {q.options.map((opt, j) => {
                  const isCorrect = j === q.correctIndex
                  const isSelected = j === q.selectedIndex
                  return (
                    <div key={j} className={clsx('text-xs px-3 py-2 rounded-lg flex items-center gap-2',
                      isCorrect ? 'bg-emerald-50 text-emerald-800' :
                        isSelected ? 'bg-red-50 text-red-700' : 'text-slate-500')}>
                      <span className="font-bold">{String.fromCharCode(65 + j)}.</span>
                      <span className="flex-1">{opt}</span>
                      {isCorrect && <CheckCircle2 size={12} />}
                      {isSelected && !isCorrect && <XCircle size={12} />}
                    </div>
                  )
                })}
              </div>
              {q.explanation && (
                <div className="mt-3 ml-7 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                  <span className="font-semibold">Why: </span>{q.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={() => window.location.reload()} className="btn-secondary flex-1">
          <RotateCcw size={14} /> Retake quiz
        </button>
        <button onClick={onBack} className="btn-primary flex-1">Back to quizzes</button>
      </div>
    </div>
  )
}
