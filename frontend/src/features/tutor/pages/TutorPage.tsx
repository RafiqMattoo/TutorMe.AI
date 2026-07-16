import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { BookOpen, FileText, Loader2, Mic, MicOff, Plus, Send, Sparkles, Trash2 } from 'lucide-react'
import { materialsApi, tutorApi } from '../services'
import { PageHeader } from '../../../shared/components/ui/index.tsx'
import { Markdown } from '../../../shared/components/Markdown.tsx'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import type { ChatMessage } from '../../../shared/types/index.ts'

// Browser SpeechRecognition (Chrome/Edge — webkitSpeechRecognition).
// Minimal local types since the DOM lib doesn't ship them.
interface SpeechRecognitionAlternative { transcript: string }
interface SpeechRecognitionResult { isFinal: boolean; readonly length: number; [i: number]: SpeechRecognitionAlternative }
interface SpeechRecognitionResultList { readonly length: number; [i: number]: SpeechRecognitionResult }
interface SpeechRecognitionEvent { resultIndex: number; results: SpeechRecognitionResultList }
interface SpeechRecognitionErrorEvent { error: string }
interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  continuous: boolean
  start(): void
  stop(): void
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null
}
type SpeechRecogCtor = new () => SpeechRecognitionLike
function getSpeechRecognition(): SpeechRecogCtor | null {
  const w = window as unknown as { SpeechRecognition?: SpeechRecogCtor; webkitSpeechRecognition?: SpeechRecogCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export default function TutorPage() {
  const [params, setParams] = useSearchParams()
  const qc = useQueryClient()
  const queryMaterialId = params.get('materialId') ?? undefined
  const querySessionId = params.get('sessionId') ?? undefined

  const [sessionId, setSessionId] = useState<string | undefined>(querySessionId)
  const [materialId, setMaterialId] = useState<string | undefined>(queryMaterialId)
  const [input, setInput] = useState('')
  const [pending, setPending] = useState<ChatMessage[]>([])
  const [streaming, setStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [listening, setListening] = useState(false)
  const recogRef = useRef<SpeechRecognitionLike | null>(null)
  const speechSupported = useMemo(() => !!getSpeechRecognition(), [])

  const { data: sessions } = useQuery({ queryKey: ['tutor-sessions'], queryFn: tutorApi.getSessions })
  const { data: materials } = useQuery({
    queryKey: ['materials-ready'],
    queryFn: () => materialsApi.getAll({ page: 1, pageSize: 100 }),
  })
  const readyMaterials = useMemo(
    () => (materials?.items ?? []).filter(m => m.status === 'Ready'),
    [materials])

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['tutor-messages', sessionId],
    queryFn: () => tutorApi.getMessages(sessionId!),
    enabled: !!sessionId,
  })

  const messages = useMemo(() => [...(history ?? []), ...pending], [history, pending])
  const activeSession = sessions?.find(s => s.id === sessionId)
  const activeMaterialId = activeSession?.materialId ?? materialId
  const activeMaterial = useMemo(
    () => readyMaterials.find(m => m.id === activeMaterialId),
    [readyMaterials, activeMaterialId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  useEffect(() => { setPending([]) }, [sessionId])

  // Abort any in-flight stream when leaving the page.
  useEffect(() => () => abortRef.current?.abort(), [])

  const del = useMutation({
    mutationFn: tutorApi.deleteSession,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tutor-sessions'] })
      setSessionId(undefined); setParams({})
    }
  })

  // Streams the answer token-by-token into a temporary assistant bubble, then
  // swaps in the server-persisted message once the stream completes.
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = input.trim()
    if (!q || streaming) return
    setInput('')

    const userTmpId = `tmp-u-${Date.now()}`
    const asstTmpId = `tmp-a-${Date.now()}`
    const now = new Date().toISOString()
    setPending([
      { id: userTmpId, role: 'User', content: q, citations: [], createdAt: now },
      { id: asstTmpId, role: 'Assistant', content: '', citations: [], createdAt: now },
    ])
    setStreaming(true)

    const ac = new AbortController()
    abortRef.current = ac
    let resolvedSessionId = sessionId

    try {
      await tutorApi.askStream(
        { question: q, sessionId, materialId: activeMaterialId },
        (ev) => {
          if (ev.type === 'meta') {
            if (ev.sessionId) resolvedSessionId = ev.sessionId
          } else if (ev.type === 'token') {
            setPending(prev => prev.map(m =>
              m.id === asstTmpId ? { ...m, content: m.content + (ev.delta ?? '') } : m))
          } else if (ev.type === 'done') {
            setPending(prev => prev.map(m =>
              m.id === asstTmpId ? { ...m, citations: ev.citations ?? [] } : m))
          } else if (ev.type === 'error') {
            setPending(prev => prev.map(m =>
              m.id === asstTmpId
                ? { ...m, content: (m.content ? m.content + '\n\n' : '') + (ev.delta ?? 'Something went wrong.') }
                : m))
          }
        },
        ac.signal,
      )

      // Pre-load the persisted messages into cache so swapping away from the
      // temporary bubbles is seamless (no empty flash), then switch session.
      if (resolvedSessionId) {
        await qc.prefetchQuery({
          queryKey: ['tutor-messages', resolvedSessionId],
          queryFn: () => tutorApi.getMessages(resolvedSessionId!),
        })
        if (!sessionId) {
          setSessionId(resolvedSessionId)
          setParams({ sessionId: resolvedSessionId, ...(activeMaterialId ? { materialId: activeMaterialId } : {}) })
        }
        qc.invalidateQueries({ queryKey: ['tutor-sessions'] })
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        toast.error('Tutor failed to respond')
      }
    } finally {
      setStreaming(false)
      abortRef.current = null
      setPending([])
    }
  }

  const startNew = () => {
    abortRef.current?.abort()
    setSessionId(undefined)
    setMaterialId(undefined)
    setPending([])
    setParams({})
  }

  const toggleMic = () => {
    const Ctor = getSpeechRecognition()
    if (!Ctor) { toast.error('Voice input is not supported in this browser'); return }
    if (listening) { recogRef.current?.stop(); return }
    const r = new Ctor()
    r.lang = 'en-US'
    r.interimResults = true
    r.continuous = false
    let final = ''
    r.onresult = (e: SpeechRecognitionEvent) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const txt = e.results[i][0].transcript
        if (e.results[i].isFinal) final += txt
        else interim += txt
      }
      setInput(prev => (final || interim).trim() ? (final + interim).trim() : prev)
    }
    r.onend = () => { setListening(false); recogRef.current = null }
    r.onerror = (ev: SpeechRecognitionErrorEvent) => {
      if (ev.error !== 'no-speech') toast.error(`Mic error: ${ev.error}`)
      setListening(false)
    }
    recogRef.current = r
    setListening(true)
    r.start()
  }

  return (
    <div>
      <PageHeader title="Tutor Me" subtitle="Ask questions grounded in your study materials" />

      <div className="flex h-[calc(100vh-160px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-100 bg-white flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-gray-100">
            <button onClick={startNew}
              className="w-full btn-primary flex items-center justify-center gap-2 py-2">
              <Plus size={14} /> New chat
            </button>
          </div>

          {!sessionId && (
            <div className="px-3 py-3 border-b border-gray-100">
              <label className="block text-xs font-medium text-gray-600 mb-1">Material context (optional)</label>
              <select value={materialId ?? ''} onChange={e => setMaterialId(e.target.value || undefined)} className="input text-xs">
                <option value="">— general (no material) —</option>
                {readyMaterials.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
          )}

          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent sessions</div>
            {(!sessions || sessions.length === 0) && (
              <div className="px-4 py-6 text-xs text-gray-400">No chats yet.</div>
            )}
            {sessions?.map(s => (
              <button key={s.id} onClick={() => { abortRef.current?.abort(); setSessionId(s.id); setParams({ sessionId: s.id }) }}
                className={clsx('w-full text-left px-4 py-2 text-sm transition-colors flex items-start gap-2 group',
                  s.id === sessionId ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50')}>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{s.title || 'Untitled'}</div>
                  <div className="text-xs text-gray-400 truncate">
                    {s.materialTitle ? <><BookOpen size={10} className="inline mr-1" />{s.materialTitle}</> : 'General'}
                  </div>
                </div>
                <span className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                  onClick={(e) => { e.stopPropagation(); if (confirm('Delete chat?')) del.mutate(s.id) }}>
                  <Trash2 size={12} />
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat area — full width */}
        <main className="flex-1 flex flex-col bg-white min-w-0">
          {/* Header strip showing which document answers are grounded in */}
          {activeMaterial && (
            <div className="flex items-center justify-between px-6 py-2.5 border-b border-gray-100 bg-white text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={12} className="text-primary flex-shrink-0" />
                <span className="text-gray-500">Grounded in:</span>
                <span className="text-gray-800 font-medium truncate">{activeMaterial.title}</span>
              </div>
              <a href={activeMaterial.fileUrl} target="_blank" rel="noreferrer"
                className="text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 flex-shrink-0"
                title="Open the source PDF in a new tab">
                <BookOpen size={13} /> Open PDF ↗
              </a>
            </div>
          )}

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
            {!sessionId && messages.length === 0 && (
              <div className="max-w-2xl mx-auto text-center mt-20">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={20} className="text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Ask your study material</h2>
                <p className="text-sm text-gray-500 mb-6">
                  {activeMaterialId
                    ? 'Answers come only from your selected document, with cited sources.'
                    : 'Select a material on the left — the tutor answers only from your documents, not from general knowledge.'}
                </p>
              </div>
            )}

            {historyLoading && (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
            )}

            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map(m => (
                m.role === 'User' ? (
                  // User turn — light rounded bubble, aligned right (ChatGPT style).
                  <div key={m.id} className="flex justify-end">
                    <div className="bg-gray-100 text-gray-900 rounded-3xl px-5 py-2.5 max-w-[80%] whitespace-pre-wrap text-[15px] leading-relaxed">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  // Assistant turn — full width, no bubble, avatar on the left.
                  <div key={m.id} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles size={15} />
                    </div>
                    <div className="flex-1 min-w-0 text-[15px] leading-relaxed text-gray-800 pt-1">
                      {m.content
                        ? <Markdown content={m.content} />
                        : (
                          <span className="inline-flex items-center gap-1 py-1" aria-label="Thinking">
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                          </span>
                        )}
                      {m.citations?.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                          <div className="text-xs font-semibold text-gray-500">Sources</div>
                          {m.citations.map((c, i) => (
                            <div key={c.chunkId} className="text-xs text-gray-500">
                              <span className="font-medium text-gray-700">[{i + 1}]</span>{' '}
                              {c.pageNumber ? `p.${c.pageNumber} · ` : ''}{c.snippet}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Composer — rounded pill, controls inside (ChatGPT style) */}
          <form onSubmit={submit} className="bg-white px-4 pb-4 pt-2">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-1.5 rounded-3xl border border-gray-200 bg-white px-2.5 py-1.5 shadow-sm transition-colors focus-within:border-gray-300">
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) submit(e) }}
                  rows={1} placeholder={listening
                    ? 'Listening... speak now'
                    : (activeMaterialId ? 'Ask about this material...' : 'Select a material on the left first...')}
                  className="flex-1 resize-none border-0 bg-transparent px-2 py-2 text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 max-h-40" />
                {speechSupported && (
                  <button type="button" onClick={toggleMic}
                    title={listening ? 'Stop recording' : 'Voice input'}
                    className={clsx('flex items-center justify-center rounded-full w-9 h-9 flex-shrink-0 transition-colors',
                      listening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'text-gray-500 hover:bg-gray-100')}>
                    {listening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                )}
                <button type="submit" disabled={!input.trim() || streaming}
                  title="Send"
                  className="flex items-center justify-center rounded-full w-9 h-9 flex-shrink-0 bg-primary text-white transition-opacity disabled:opacity-30 hover:opacity-90">
                  {streaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
              <div className="text-center text-xs text-gray-400 mt-2">
                VidyaAI answers from your selected document · press Enter to send, Shift+Enter for a new line
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
