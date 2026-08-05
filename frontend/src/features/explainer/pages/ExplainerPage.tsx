import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Clapperboard, Loader2, Pause, Play, RotateCcw, SkipBack, SkipForward, Sparkles } from 'lucide-react'
import { materialsApi, narrationApi } from '../services'
import { PageHeader } from '../../../shared/components/ui/index.tsx'
import type { NarrationSegment } from '../../../shared/types/index.ts'
import clsx from 'clsx'

// Animated "explainer video": the local LLM rewrites each section into a simple
// explanation, we narrate it, and play it back as an animated slideshow with the
// words highlighting in sync. Built on the narration pipeline (kind = Explained).
export default function ExplainerPage() {
  const [params, setParams] = useSearchParams()
  const materialId = params.get('materialId') ?? undefined

  const { data: materialsResp } = useQuery({
    queryKey: ['materials-ready'],
    queryFn: () => materialsApi.getAll({ page: 1, pageSize: 100 }),
  })
  const ready = useMemo(
    () => (materialsResp?.items ?? []).filter(m => m.status === 'Ready'),
    [materialsResp])

  const qc = useQueryClient()
  const { data: explainer } = useQuery({
    queryKey: ['explainer', materialId],
    queryFn: () => narrationApi.get(materialId!, 'Explained'),
    enabled: !!materialId,
    refetchInterval: q => (q.state.data?.status === 'Processing' ? 3000 : false),
  })
  const { data: voices } = useQuery({ queryKey: ['narration-voices'], queryFn: () => narrationApi.voices(), staleTime: Infinity })
  const [voice, setVoice] = useState('')
  useEffect(() => {
    if (!voice && voices?.length) setVoice((voices.find(v => v.language.startsWith('en')) ?? voices[0]).id)
  }, [voices, voice])

  const generate = useMutation({
    mutationFn: () => narrationApi.generate(materialId!, voice || undefined, 'Explained'),
    onSuccess: n => qc.setQueryData(['explainer', materialId], n),
  })

  // ── Playback state ──────────────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [ms, setMs] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [rate, setRate] = useState(1)

  const segments = useMemo<NarrationSegment[]>(() => explainer?.segments ?? [], [explainer])
  const active = useMemo(() => {
    if (!segments.length) return undefined
    let found = segments[0]
    for (const s of segments) if (ms >= s.startMs) found = s
    return found
  }, [segments, ms])
  const activeIdx = active ? segments.indexOf(active) : -1

  // Word tokens of the active explanation, highlighted by elapsed-time fraction.
  const tokens = useMemo(() => (active?.text ?? '').split(/(\s+)/).filter(t => t.length), [active])
  const wordCount = useMemo(() => tokens.filter(t => t.trim()).length, [tokens])
  const activeWord = useMemo(() => {
    if (!active || wordCount === 0) return -1
    const frac = Math.min(1, Math.max(0, (ms - active.startMs) / Math.max(1, active.endMs - active.startMs)))
    return Math.min(wordCount - 1, Math.floor(frac * wordCount))
  }, [active, ms, wordCount])

  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = rate }, [rate, explainer?.audioUrl])

  const seekToSeg = (i: number) => {
    const s = segments[i]; const a = audioRef.current
    if (s && a) { a.currentTime = s.startMs / 1000; if (a.paused) a.play() }
  }

  // ── Material picker ─────────────────────────────────────────────
  if (!materialId) {
    return (
      <div>
        <PageHeader title="AI Explainer" subtitle="Pick a document — AI turns it into an animated explainer" />
        <div className="p-6">
          {!ready.length ? (
            <div className="card p-10 text-center text-sm text-gray-500">
              No Ready materials yet. Upload a PDF on the Materials page first.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ready.map(m => (
                <button key={m.id} onClick={() => setParams({ materialId: m.id })}
                  className="card p-5 text-left transition-shadow hover:shadow-md">
                  <Clapperboard size={18} className="mb-3 text-blue-600" />
                  <div className="truncate text-sm font-semibold text-gray-900">{m.title}</div>
                  <div className="mt-1 text-xs text-gray-400">{m.pageCount} pages · {m.chunkCount} sections</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const material = ready.find(m => m.id === materialId)
  const isReady = explainer?.status === 'Ready' && explainer.audioUrl
  const isProcessing = explainer?.status === 'Processing' || generate.isPending

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Link to="/explain" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={18} /></Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{material?.title ?? 'Explainer'}</h1>
            <p className="mt-0.5 text-sm text-gray-500">AI animated explainer</p>
          </div>
        </div>
        {isReady && (
          <button onClick={() => generate.mutate()} disabled={generate.isPending}
            className="btn-secondary flex items-center gap-2 text-xs">
            <Sparkles size={13} className={clsx(generate.isPending && 'animate-spin')} /> Regenerate
          </button>
        )}
      </div>

      {/* ── Stage (light) ──────────────────────────────────────── */}
      <div className="relative flex min-h-[calc(100vh-130px)] items-center justify-center overflow-hidden bg-slate-50 p-6">
        {/* Soft animated background tints */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl animate-pulse" />
          <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {isReady ? (
          <div className="relative z-10 w-full max-w-3xl">
            <audio
              ref={audioRef}
              src={explainer!.audioUrl}
              onTimeUpdate={() => audioRef.current && setMs(audioRef.current.currentTime * 1000)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onLoadedMetadata={() => { if (audioRef.current) audioRef.current.playbackRate = rate }}
              className="hidden"
            />

            {/* Section indicator */}
            <div className="mb-4 flex items-center justify-center gap-2">
              {segments.map((s, i) => (
                <button key={s.segmentIndex} onClick={() => seekToSeg(i)}
                  className={clsx('h-1.5 rounded-full transition-all',
                    i === activeIdx ? 'w-8 bg-blue-500' : 'w-2 bg-slate-300 hover:bg-slate-400')} />
              ))}
            </div>

            {/* Animated slide */}
            <div key={activeIdx} className="animate-fade-in rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-12">
              <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600">
                <Sparkles size={12} /> Part {activeIdx + 1} of {segments.length}
              </div>
              <p className="text-[22px] font-semibold leading-relaxed text-slate-900 sm:text-[26px] sm:leading-relaxed">
                {(() => { let wi = -1; return tokens.map((t, i) => {
                  const isWord = !!t.trim()
                  if (isWord) wi += 1
                  const on = isWord && wi === activeWord && playing
                  return (
                    <span key={i} className={clsx('transition-colors duration-150', on ? 'rounded bg-blue-500/20 text-slate-900' : 'text-slate-400')}>
                      {t}
                    </span>
                  )
                }) })()}
              </p>
            </div>

            {/* Progress */}
            <input type="range" min={0} max={Math.max(1, explainer!.durationMs)} value={Math.min(ms, explainer!.durationMs)}
              onChange={e => { if (audioRef.current) audioRef.current.currentTime = +e.target.value / 1000 }}
              className="mt-6 w-full accent-blue-600" />

            {/* Controls */}
            <div className="mt-3 flex items-center justify-center gap-3">
              <Ctrl onClick={() => activeIdx > 0 && seekToSeg(activeIdx - 1)} title="Previous"><SkipBack size={17} /></Ctrl>
              {!playing ? (
                <button onClick={() => audioRef.current?.play()} className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/50 transition hover:bg-blue-500" title="Play">
                  <Play size={22} className="ml-0.5" />
                </button>
              ) : (
                <button onClick={() => audioRef.current?.pause()} className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/50 transition hover:bg-blue-500" title="Pause">
                  <Pause size={22} />
                </button>
              )}
              <Ctrl onClick={() => activeIdx < segments.length - 1 && seekToSeg(activeIdx + 1)} title="Next"><SkipForward size={17} /></Ctrl>
              <Ctrl onClick={() => { const a = audioRef.current; if (a) { a.currentTime = 0; a.play() } }} title="Restart"><RotateCcw size={15} /></Ctrl>
              <select value={rate} onChange={e => setRate(+e.target.value)}
                className="ml-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 outline-none">
                {[0.75, 1, 1.25, 1.5].map(r => <option key={r} value={r}>{r}x</option>)}
              </select>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="relative z-10 text-center">
            <Loader2 className="mx-auto mb-4 animate-spin text-blue-600" size={36} />
            <div className="text-lg font-semibold text-slate-900">Creating your explainer…</div>
            <div className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              The AI is rewriting each section into a simple explanation and narrating it. This can take a minute.
            </div>
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Clapperboard size={26} />
            </div>
            <div className="text-lg font-semibold text-slate-900">Generate an AI explainer</div>
            <p className="mx-auto mt-2 text-sm text-slate-500">
              The AI explains each section in simple words and plays it as an animated, narrated walkthrough.
            </p>
            {explainer?.status === 'Failed' && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {explainer.errorMessage ?? 'Generation failed. Try again.'}
              </div>
            )}
            {!!voices?.length && (
              <select value={voice} onChange={e => setVoice(e.target.value)}
                className="input mt-5 w-full text-sm">
                {voices.map(v => <option key={v.id} value={v.id}>{v.name} ({v.language})</option>)}
              </select>
            )}
            <button onClick={() => generate.mutate()} disabled={generate.isPending}
              className="btn-primary mx-auto mt-4 flex items-center gap-2">
              <Sparkles size={15} /> Generate explainer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Ctrl({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button onClick={onClick} title={title}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100">
      {children}
    </button>
  )
}
