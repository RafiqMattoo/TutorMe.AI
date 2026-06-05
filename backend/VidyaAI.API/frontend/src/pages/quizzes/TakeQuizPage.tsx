import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Send, XCircle } from 'lucide-react'
import { quizzesApi } from '../../api'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import type { QuizAttemptResult } from '../../types'

export default function TakeQuizPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<QuizAttemptResult | null>(null)

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', id], queryFn: () => quizzesApi.getById(id!), enabled: !!id,
  })

  const submit = useMutation({
    mutationFn: () => quizzesApi.submit(id!, answers),
    onSuccess: r => setResult(r),
    onError: () => toast.error('Failed to submit attempt'),
  })

  const total = quiz?.questions.length ?? 0
  const answered = useMemo(() => Object.keys(answers).length, [answers])
  const q = quiz?.questions[index]

  if (isLoading || !quiz) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" /></div>
  }

  if (result) return <QuizResult result={result} onBack={() => nav('/quizzes')} />

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => nav('/quizzes')} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{quiz.title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{quiz.materialTitle ?? 'Unattached'} · {total} questions</p>
          </div>
        </div>
        <div className="text-xs text-gray-500">{answered}/{total} answered</div>
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        <div className="text-xs text-gray-500 mb-3">Question {index + 1} of {total}</div>

        {q && (
          <div className="card p-6">
            <div className="text-base font-medium text-gray-900 mb-5">{q.questionText}</div>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i
                return (
                  <button key={i} onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                    className={clsx('w-full text-left px-4 py-3 rounded-lg border text-sm transition-all',
                      selected
                        ? 'border-primary bg-primary/5 text-gray-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700')}>
                    <span className={clsx('inline-block w-5 h-5 rounded-full border mr-3 text-xs flex-shrink-0 items-center justify-center font-bold',
                      selected ? 'border-primary bg-primary text-white inline-flex' : 'border-gray-300 text-gray-400')}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}
            className="btn-secondary flex items-center gap-1 disabled:opacity-40">
            <ChevronLeft size={14} /> Prev
          </button>

          {index < total - 1 ? (
            <button onClick={() => setIndex(i => Math.min(total - 1, i + 1))}
              className="btn-primary flex items-center gap-1">
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={() => submit.mutate()} disabled={submit.isPending || answered === 0}
              className="btn-primary flex items-center gap-2">
              {submit.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {submit.isPending ? 'Scoring...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function QuizResult({ result, onBack }: { result: QuizAttemptResult; onBack: () => void }) {
  const pct = Math.round((result.score / result.totalQuestions) * 100)
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="card p-8 text-center mb-6">
        <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Your score</div>
        <div className="text-5xl font-bold text-primary mb-1">{result.score} / {result.totalQuestions}</div>
        <div className="text-sm text-gray-500">{pct}% correct</div>
      </div>

      <div className="space-y-3">
        {result.questions.map((q, i) => (
          <div key={q.questionId} className="card p-5">
            <div className="flex items-start gap-3 mb-3">
              {q.isCorrect
                ? <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                : <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Q{i + 1}. {q.questionText}</div>
              </div>
            </div>
            <div className="space-y-1.5 ml-7">
              {q.options.map((opt, j) => {
                const isCorrect = j === q.correctIndex
                const isSelected = j === q.selectedIndex
                return (
                  <div key={j} className={clsx('text-xs px-3 py-2 rounded-lg flex items-center gap-2',
                    isCorrect ? 'bg-green-50 text-green-800' :
                      isSelected ? 'bg-red-50 text-red-700' : 'text-gray-500')}>
                    <span className="font-bold">{String.fromCharCode(65 + j)}.</span>
                    <span className="flex-1">{opt}</span>
                    {isCorrect && <CheckCircle2 size={12} />}
                    {isSelected && !isCorrect && <XCircle size={12} />}
                  </div>
                )
              })}
            </div>
            {q.explanation && (
              <div className="mt-3 ml-7 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-semibold">Why: </span>{q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={onBack} className="btn-secondary w-full mt-6">Back to quizzes</button>
    </div>
  )
}
