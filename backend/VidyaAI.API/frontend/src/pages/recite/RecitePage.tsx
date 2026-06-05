import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Loader2, Pause, Play, SkipBack, SkipForward, Square } from 'lucide-react'
import { materialsApi } from '../../api'
import { PageHeader } from '../../components/ui'
import clsx from 'clsx'

// Side-by-side reader: left = chunks of the document, right = TTS player.
// Speaks chunk-by-chunk using the browser's native SpeechSynthesis (no API quota).
export default function RecitePage() {
  const [params, setParams] = useSearchParams()
  const materialId = params.get('materialId') ?? undefined

  const { data: materialsResp } = useQuery({
    queryKey: ['materials-ready'],
    queryFn: () => materialsApi.getAll({ page: 1, pageSize: 100 }),
  })
  const ready = useMemo(
    () => (materialsResp?.items ?? []).filter(m => m.status === 'Ready'),
    [materialsResp])

  const { data: chunks, isLoading } = useQuery({
    queryKey: ['material-chunks', materialId],
    queryFn: () => materialsApi.getChunks(materialId!),
    enabled: !!materialId,
  })

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const [voiceName, setVoiceName] = useState<string>('')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [spokenChar, setSpokenChar] = useState(-1) // char offset of the word being spoken
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const activeRef = useRef<HTMLDivElement | null>(null)
  const activeWordRef = useRef<HTMLSpanElement | null>(null)

  // Split the current chunk into word tokens with their start offsets, so the
  // boundary event (which reports a char index) can light up the active word.
  const tokens = useMemo(() => {
    const text = chunks?.[index]?.content ?? ''
    const out: { text: string; start: number }[] = []
    const re = /\S+\s*/g
    let m: RegExpExecArray | null
    while ((m = re.exec(text)) !== null) out.push({ text: m[0], start: m.index })
    return out
  }, [chunks, index])

  const activeToken = useMemo(() => {
    if (spokenChar < 0) return -1
    let lo = 0
    for (let i = 0; i < tokens.length; i++) if (tokens[i].start <= spokenChar) lo = i
    return lo
  }, [tokens, spokenChar])

  // Load available voices.
  useEffect(() => {
    const update = () => {
      const v = window.speechSynthesis.getVoices()
      setVoices(v)
      if (!voiceName && v.length > 0) {
        const en = v.find(x => x.lang.startsWith('en')) ?? v[0]
        setVoiceName(en.name)
      }
    }
    update()
    window.speechSynthesis.onvoiceschanged = update
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [voiceName])

  // Stop on unmount or when material changes.
  useEffect(() => () => window.speechSynthesis.cancel(), [])
  // On material change, stop and resume from the last position the student left at.
  useEffect(() => {
    stop()
    const saved = materialId ? Number(localStorage.getItem(`recite-pos-${materialId}`)) : 0
    setIndex(Number.isFinite(saved) && saved > 0 ? saved : 0)
    /* eslint-disable-line */
  }, [materialId])

  // Clamp the restored position once chunks load.
  useEffect(() => {
    if (chunks && index >= chunks.length) setIndex(0)
  }, [chunks, index])

  // Persist the current section so the student can pick up where they left off.
  useEffect(() => {
    if (materialId) localStorage.setItem(`recite-pos-${materialId}`, String(index))
  }, [materialId, index])

  // Scroll the active chunk into view.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [index])

  // Keep the word being spoken visible in the "Now reading" panel.
  useEffect(() => {
    activeWordRef.current?.scrollIntoView({ block: 'nearest' })
  }, [activeToken])

  // Spacebar toggles play/pause (ignored while focused in a form control).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if (e.code === 'Space') {
        e.preventDefault()
        if (!playing) play()
        else if (paused) resume()
        else pause()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const speakAt = (i: number) => {
    if (!chunks || i >= chunks.length || i < 0) { stop(); return }
    window.speechSynthesis.cancel()
    setSpokenChar(-1)
    const u = new SpeechSynthesisUtterance(chunks[i].content)
    u.rate = rate
    u.pitch = 1
    const v = voices.find(x => x.name === voiceName)
    if (v) u.voice = v
    // Light up the word as it is spoken (read-along). Not all voices fire this.
    u.onboundary = (e) => {
      if (utteranceRef.current === u && (e.name === 'word' || e.name === undefined)) {
        setSpokenChar(e.charIndex)
      }
    }
    u.onend = () => {
      // Auto-advance unless user pressed stop.
      if (utteranceRef.current === u) {
        const next = i + 1
        setIndex(next)
        if (next < (chunks?.length ?? 0)) speakAt(next)
        else { setPlaying(false); utteranceRef.current = null }
      }
    }
    u.onerror = () => { setPlaying(false); utteranceRef.current = null }
    utteranceRef.current = u
    window.speechSynthesis.speak(u)
    setPlaying(true)
    setPaused(false)
  }

  const play = () => speakAt(index)
  const pause = () => { window.speechSynthesis.pause(); setPaused(true) }
  const resume = () => { window.speechSynthesis.resume(); setPaused(false) }
  const stop = () => {
    window.speechSynthesis.cancel()
    utteranceRef.current = null
    setPlaying(false); setPaused(false); setSpokenChar(-1)
  }
  const next = () => { const i = Math.min((chunks?.length ?? 1) - 1, index + 1); setIndex(i); if (playing) speakAt(i) }
  const prev = () => { const i = Math.max(0, index - 1); setIndex(i); if (playing) speakAt(i) }
  const jumpTo = (i: number) => { setIndex(i); if (playing) speakAt(i); else stop() }

  // Apply speed changes live by re-speaking the current section at the new rate.
  useEffect(() => {
    if (playing && !paused) speakAt(index)
    /* eslint-disable-line */
  }, [rate]) // eslint-disable-line react-hooks/exhaustive-deps

  // No material selected → picker.
  if (!materialId) {
    return (
      <div>
        <PageHeader title="Audio Recitation" subtitle="Pick a document to read aloud" />
        <div className="p-6">
          {!ready.length ? (
            <div className="card p-10 text-center text-sm text-gray-500">
              No Ready materials yet. Upload a PDF on the Materials page first.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ready.map(m => (
                <button key={m.id} onClick={() => setParams({ materialId: m.id })}
                  className="card p-5 text-left hover:shadow-md transition-shadow">
                  <BookOpen size={18} className="text-primary mb-3" />
                  <div className="text-sm font-semibold text-gray-900 truncate">{m.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{m.pageCount} pages · {m.chunkCount} sections</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isLoading || !chunks) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" /></div>
  }

  const activeMaterial = ready.find(m => m.id === materialId)

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/recite" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={18} /></Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{activeMaterial?.title ?? 'Recitation'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Section {index + 1} of {chunks.length}</p>
          </div>
        </div>
        <a href={activeMaterial?.fileUrl} target="_blank" rel="noreferrer"
          className="btn-secondary text-xs flex items-center gap-2">
          <BookOpen size={13} /> Open PDF
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[calc(100vh-130px)]">
        {/* Left: book */}
        <div className="overflow-y-auto bg-white border-r border-gray-100 px-6 py-6 space-y-3">
          {chunks.map((c, i) => (
            <div key={c.id} ref={i === index ? activeRef : null}
              onClick={() => jumpTo(i)}
              className={clsx('cursor-pointer rounded-lg p-3 text-sm leading-relaxed transition-all',
                i === index
                  ? 'bg-primary/10 border-l-4 border-primary text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50')}>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <span className="font-semibold">§ {i + 1}</span>
                {c.pageNumber && <span>· page {c.pageNumber}</span>}
              </div>
              {c.content}
            </div>
          ))}
        </div>

        {/* Right: player */}
        <div className="bg-gray-50/50 px-6 py-6 flex flex-col">
          <div className="card p-6 mb-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Now reading</div>
            <div className="text-sm text-gray-800 max-h-48 overflow-y-auto leading-relaxed">
              {activeToken >= 0
                ? tokens.map((t, i) => (
                    <span key={i} ref={i === activeToken ? activeWordRef : null}
                      className={clsx('rounded transition-colors',
                        i === activeToken && 'bg-primary/20 text-gray-900 font-medium')}>
                      {t.text}
                    </span>
                  ))
                : <span className="whitespace-pre-wrap">{chunks[index]?.content}</span>}
            </div>
          </div>

          {/* Controls */}
          <div className="card p-5 mb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <button onClick={prev} className="btn-secondary p-3" title="Previous section">
                <SkipBack size={16} />
              </button>
              {!playing ? (
                <button onClick={play} className="btn-primary p-4 rounded-full" title="Play">
                  <Play size={18} />
                </button>
              ) : paused ? (
                <button onClick={resume} className="btn-primary p-4 rounded-full" title="Resume">
                  <Play size={18} />
                </button>
              ) : (
                <button onClick={pause} className="btn-primary p-4 rounded-full" title="Pause">
                  <Pause size={18} />
                </button>
              )}
              <button onClick={stop} disabled={!playing} className="btn-secondary p-3 disabled:opacity-40" title="Stop">
                <Square size={16} />
              </button>
              <button onClick={next} className="btn-secondary p-3" title="Next section">
                <SkipForward size={16} />
              </button>
            </div>

            {/* Progress */}
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-primary transition-all"
                style={{ width: `${((index + 1) / chunks.length) * 100}%` }} />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Voice</label>
                <select value={voiceName} onChange={e => setVoiceName(e.target.value)}
                  className="input text-xs">
                  {voices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Speed: {rate.toFixed(2)}x</label>
                <input type="range" min={0.5} max={2} step={0.1} value={rate}
                  onChange={e => setRate(+e.target.value)} className="w-full" />
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center">
            Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border border-gray-200">Space</kbd> to play/pause ·
            words highlight as they're read · resumes where you left off
          </div>
        </div>
      </div>
    </div>
  )
}
