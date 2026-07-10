import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Headphones, Loader2, Pause, Play, RefreshCw, SkipBack, SkipForward, Sparkles, Square, Volume2 } from 'lucide-react'
import { materialsApi, narrationApi } from '../../api'
import { PageHeader } from '../../components/ui'
import type { NarrationSegment } from '../../types'
import clsx from 'clsx'

// Side-by-side reader: left = chunks of the document, right = a player.
// Two narration modes:
//   • Browser voice  — native SpeechSynthesis, no backend (free, instant).
//   • AI narration   — a backend-generated audio file with a precise per-segment
//                      timeline, so words highlight in sync with real audio.
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

  const [mode, setMode] = useState<'browser' | 'audio'>('browser')
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

  // ── AI narration (backend audio) ────────────────────────────────
  const qc = useQueryClient()
  const { data: narration } = useQuery({
    queryKey: ['narration', materialId],
    queryFn: () => narrationApi.get(materialId!),
    enabled: !!materialId && mode === 'audio',
    // While synthesis runs in the background, poll until it's Ready/Failed.
    refetchInterval: q => (q.state.data?.status === 'Processing' ? 3000 : false),
  })
  const { data: audioVoices } = useQuery({
    queryKey: ['narration-voices'],
    queryFn: () => narrationApi.voices(),
    enabled: mode === 'audio',
    staleTime: Infinity,
  })
  const [audioVoice, setAudioVoice] = useState('')
  const generate = useMutation({
    mutationFn: () => narrationApi.generate(materialId!, audioVoice || undefined),
    onSuccess: n => qc.setQueryData(['narration', materialId], n),
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioMs, setAudioMs] = useState(0)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioRate, setAudioRate] = useState(1)

  const segments = useMemo<NarrationSegment[]>(() => narration?.segments ?? [], [narration])
  const segByChunk = useMemo(() => {
    const m = new Map<number, NarrationSegment>()
    segments.forEach(s => m.set(s.chunkIndex, s))
    return m
  }, [segments])
  // The segment whose [startMs, endMs) contains the playhead.
  const activeSeg = useMemo(() => {
    if (!segments.length) return undefined
    let found = segments[0]
    for (const s of segments) if (audioMs >= s.startMs) found = s
    return found
  }, [segments, audioMs])

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

  // Browser-mode active word (from the SpeechSynthesis boundary char index).
  const browserToken = useMemo(() => {
    if (spokenChar < 0) return -1
    let lo = 0
    for (let i = 0; i < tokens.length; i++) if (tokens[i].start <= spokenChar) lo = i
    return lo
  }, [tokens, spokenChar])

  // Audio-mode active word: interpolate position within the active segment by time.
  const audioToken = useMemo(() => {
    if (mode !== 'audio' || !activeSeg || tokens.length === 0) return -1
    const span = Math.max(1, activeSeg.endMs - activeSeg.startMs)
    const frac = Math.min(1, Math.max(0, (audioMs - activeSeg.startMs) / span))
    return Math.min(tokens.length - 1, Math.floor(frac * tokens.length))
  }, [mode, activeSeg, audioMs, tokens])

  const activeToken = mode === 'audio' ? audioToken : browserToken

  // Load available browser voices.
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

  // Default the AI voice to the first English option once voices load.
  useEffect(() => {
    if (!audioVoice && audioVoices?.length) {
      const en = audioVoices.find(v => v.language.startsWith('en')) ?? audioVoices[0]
      setAudioVoice(en.id)
    }
  }, [audioVoices, audioVoice])

  // Stop on unmount or when material changes.
  useEffect(() => () => window.speechSynthesis.cancel(), [])
  // On material change, stop and resume from the last position the student left at.
  useEffect(() => {
    stop()
    const saved = materialId ? Number(localStorage.getItem(`recite-pos-${materialId}`)) : 0
    setIndex(Number.isFinite(saved) && saved > 0 ? saved : 0)
    /* eslint-disable-line */
  }, [materialId])

  // Switching modes: silence whichever player isn't active.
  useEffect(() => {
    if (mode === 'audio') stop()
    else audioRef.current?.pause()
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Clamp the restored position once chunks load.
  useEffect(() => {
    if (chunks && index >= chunks.length) setIndex(0)
  }, [chunks, index])

  // Persist the current section so the student can pick up where they left off.
  useEffect(() => {
    if (materialId) localStorage.setItem(`recite-pos-${materialId}`, String(index))
  }, [materialId, index])

  // In audio mode, follow the playhead: move the active section to match the
  // segment currently being spoken.
  useEffect(() => {
    if (mode !== 'audio' || !activeSeg || !chunks) return
    const i = chunks.findIndex(c => c.chunkIndex === activeSeg.chunkIndex)
    if (i >= 0 && i !== index) setIndex(i)
  }, [mode, activeSeg, chunks]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the audio element's speed in sync with the slider.
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = audioRate
  }, [audioRate, narration?.audioUrl])

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
        if (mode === 'audio') {
          const a = audioRef.current
          if (a) { a.paused ? a.play() : a.pause() }
        } else if (!playing) play()
        else if (paused) resume()
        else pause()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // ── Browser-voice playback ──────────────────────────────────────
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

  // ── AI-audio playback ───────────────────────────────────────────
  const seekToChunk = (chunkIndex: number) => {
    const s = segByChunk.get(chunkIndex)
    const a = audioRef.current
    if (s && a) { a.currentTime = s.startMs / 1000; if (a.paused) a.play() }
  }
  const audioNeighbour = (dir: 1 | -1) => {
    const a = audioRef.current
    if (!a || !chunks) return
    const target = Math.min(chunks.length - 1, Math.max(0, index + dir))
    seekToChunk(chunks[target].chunkIndex)
  }

  // Clicking a section seeks audio (audio mode) or jumps the browser reader.
  const onSectionClick = (i: number, chunkIndex: number) => {
    if (mode === 'audio') { seekToChunk(chunkIndex); return }
    setIndex(i); if (playing) speakAt(i); else stop()
  }

  // Apply browser speed changes live by re-speaking the current section.
  useEffect(() => {
    if (mode === 'browser' && playing && !paused) speakAt(index)
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
        <div className="flex items-center gap-3">
          {/* Mode switch */}
          <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-xs">
            <button onClick={() => setMode('browser')}
              className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors',
                mode === 'browser' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500')}>
              <Volume2 size={13} /> Browser voice
            </button>
            <button onClick={() => setMode('audio')}
              className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors',
                mode === 'audio' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500')}>
              <Headphones size={13} /> AI narration
            </button>
          </div>
          <a href={activeMaterial?.fileUrl} target="_blank" rel="noreferrer"
            className="btn-secondary text-xs flex items-center gap-2">
            <BookOpen size={13} /> Open PDF
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[calc(100vh-130px)]">
        {/* Left: book */}
        <div className="overflow-y-auto bg-white border-r border-gray-100 px-6 py-6 space-y-3">
          {chunks.map((c, i) => (
            <div key={c.id} ref={i === index ? activeRef : null}
              onClick={() => onSectionClick(i, c.chunkIndex)}
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

          {mode === 'browser' ? (
            /* Browser-voice controls */
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

              <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-primary transition-all"
                  style={{ width: `${((index + 1) / chunks.length) * 100}%` }} />
              </div>

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
          ) : (
            /* AI-narration controls */
            <div className="card p-5 mb-4">
              {narration?.status === 'Ready' && narration.audioUrl ? (
                <>
                  <audio
                    ref={audioRef}
                    src={narration.audioUrl}
                    onTimeUpdate={() => audioRef.current && setAudioMs(audioRef.current.currentTime * 1000)}
                    onPlay={() => setAudioPlaying(true)}
                    onPause={() => setAudioPlaying(false)}
                    onEnded={() => setAudioPlaying(false)}
                    onLoadedMetadata={() => { if (audioRef.current) audioRef.current.playbackRate = audioRate }}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <button onClick={() => audioNeighbour(-1)} className="btn-secondary p-3" title="Previous section">
                      <SkipBack size={16} />
                    </button>
                    {!audioPlaying ? (
                      <button onClick={() => audioRef.current?.play()} className="btn-primary p-4 rounded-full" title="Play">
                        <Play size={18} />
                      </button>
                    ) : (
                      <button onClick={() => audioRef.current?.pause()} className="btn-primary p-4 rounded-full" title="Pause">
                        <Pause size={18} />
                      </button>
                    )}
                    <button onClick={() => { const a = audioRef.current; if (a) { a.pause(); a.currentTime = 0 } }}
                      className="btn-secondary p-3" title="Stop">
                      <Square size={16} />
                    </button>
                    <button onClick={() => audioNeighbour(1)} className="btn-secondary p-3" title="Next section">
                      <SkipForward size={16} />
                    </button>
                  </div>

                  {/* Seekable progress */}
                  <input type="range" min={0} max={Math.max(1, narration.durationMs)} value={Math.min(audioMs, narration.durationMs)}
                    onChange={e => { if (audioRef.current) audioRef.current.currentTime = +e.target.value / 1000 }}
                    className="w-full mb-4" />

                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div className="text-xs text-gray-500">
                      {fmt(audioMs)} / {fmt(narration.durationMs)}
                      {narration.voice && <div className="text-gray-400 mt-0.5 truncate">Voice: {narration.voice}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Speed: {audioRate.toFixed(2)}x</label>
                      <input type="range" min={0.5} max={2} step={0.1} value={audioRate}
                        onChange={e => setAudioRate(+e.target.value)} className="w-full" />
                    </div>
                  </div>

                  <button onClick={() => generate.mutate()} disabled={generate.isPending}
                    className="btn-secondary text-xs flex items-center gap-2 mt-4 mx-auto">
                    <RefreshCw size={12} className={clsx(generate.isPending && 'animate-spin')} /> Regenerate
                  </button>
                </>
              ) : narration?.status === 'Processing' || generate.isPending ? (
                <div className="text-center py-8">
                  <Loader2 className="animate-spin text-primary mx-auto mb-3" />
                  <div className="text-sm font-medium text-gray-800">Generating narration…</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Synthesizing audio for {chunks.length} sections. This can take a minute — you can keep reading.
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Headphones size={22} className="text-primary mx-auto mb-3" />
                  <div className="text-sm font-medium text-gray-800 mb-1">AI audio narration</div>
                  <div className="text-xs text-gray-500 mb-4">
                    Generate a natural voice-over with words highlighting in sync.
                  </div>

                  {narration?.status === 'Failed' && (
                    <div className="text-xs text-red-600 bg-red-50 rounded-md p-2 mb-3">
                      {narration.errorMessage ?? 'Generation failed. Try again.'}
                    </div>
                  )}

                  {!!audioVoices?.length && (
                    <div className="max-w-xs mx-auto mb-4 text-left">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Voice</label>
                      <select value={audioVoice} onChange={e => setAudioVoice(e.target.value)}
                        className="input text-xs">
                        {audioVoices.map(v => <option key={v.id} value={v.id}>{v.name} ({v.language})</option>)}
                      </select>
                    </div>
                  )}

                  <button onClick={() => generate.mutate()} disabled={generate.isPending || !materialId}
                    className="btn-primary text-sm flex items-center gap-2 mx-auto">
                    <Sparkles size={14} /> Generate narration
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-400 text-center">
            {mode === 'audio'
              ? 'AI-generated audio · words highlight in sync · click a section to jump'
              : <>Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border border-gray-200">Space</kbd> to play/pause · words highlight as they're read · resumes where you left off</>}
          </div>
        </div>
      </div>
    </div>
  )
}

// mm:ss from milliseconds.
function fmt(ms: number) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
