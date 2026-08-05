import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Images, Loader2, Pause, Play, RotateCcw, SkipBack, SkipForward, Sparkles } from 'lucide-react'
import { materialsApi, narrationApi } from '../services'
import { PageHeader } from '../../../shared/components/ui/index.tsx'
import type { NarrationSegment } from '../../../shared/types/index.ts'
import clsx from 'clsx'

// Animated "story scenes": the LLM rewrites each section into a simple narration,
// an image model illustrates it, and we play it back as a full-bleed slideshow —
// each picture pans/zooms (Ken Burns) while the narration plays and the caption
// words highlight in sync. Built on the narration pipeline (kind = Illustrated).
export default function ScenesPage() {
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
  const { data: scenes } = useQuery({
    queryKey: ['scenes', materialId],
    queryFn: () => narrationApi.get(materialId!, 'Illustrated'),
    enabled: !!materialId,
    refetchInterval: q => (q.state.data?.status === 'Processing' ? 4000 : false),
  })
  const { data: voices } = useQuery({ queryKey: ['narration-voices'], queryFn: () => narrationApi.voices(), staleTime: Infinity })
  const [voice, setVoice] = useState('')
  useEffect(() => {
    if (!voice && voices?.length) setVoice((voices.find(v => v.language.startsWith('en')) ?? voices[0]).id)
  }, [voices, voice])

  const generate = useMutation({
    mutationFn: () => narrationApi.generate(materialId!, voice || undefined, 'Illustrated'),
    onSuccess: n => qc.setQueryData(['scenes', materialId], n),
  })

  // ── Playback state ──────────────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [ms, setMs] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [rate, setRate] = useState(1)

  const segments = useMemo<NarrationSegment[]>(() => scenes?.segments ?? [], [scenes])
  const active = useMemo(() => {
    if (!segments.length) return undefined
    let found = segments[0]
    for (const s of segments) if (ms >= s.startMs) found = s
    return found
  }, [segments, ms])
  const activeIdx = active ? segments.indexOf(active) : -1

  // Word tokens of the active caption, highlighted by elapsed-time fraction.
  const tokens = useMemo(() => (active?.text ?? '').split(/(\s+)/).filter(t => t.length), [active])
  const wordCount = useMemo(() => tokens.filter(t => t.trim()).length, [tokens])
  const activeWord = useMemo(() => {
    if (!active || wordCount === 0) return -1
    const frac = Math.min(1, Math.max(0, (ms - active.startMs) / Math.max(1, active.endMs - active.startMs)))
    return Math.min(wordCount - 1, Math.floor(frac * wordCount))
  }, [active, ms, wordCount])

  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = rate }, [rate, scenes?.audioUrl])

  const seekToSeg = (i: number) => {
    const s = segments[i]; const a = audioRef.current
    if (s && a) { a.currentTime = s.startMs / 1000; if (a.paused) a.play() }
  }

  // ── Material picker ─────────────────────────────────────────────
  if (!materialId) {
    return (
      <div>
        <PageHeader title="Story Scenes" subtitle="Pick a document — AI turns it into an illustrated, narrated story" />
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
                  <Images size={18} className="mb-3 text-fuchsia-600" />
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
  const isReady = scenes?.status === 'Ready' && scenes.audioUrl
  const isProcessing = scenes?.status === 'Processing' || generate.isPending

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Link to="/scenes" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={18} /></Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{material?.title ?? 'Story Scenes'}</h1>
            <p className="mt-0.5 text-sm text-gray-500">AI illustrated story</p>
          </div>
        </div>
        {isReady && (
          <button onClick={() => generate.mutate()} disabled={generate.isPending}
            className="btn-secondary flex items-center gap-2 text-xs">
            <Sparkles size={13} className={clsx(generate.isPending && 'animate-spin')} /> Regenerate
          </button>
        )}
      </div>

      {/* ── Stage (dark, cinematic) ─────────────────────────────── */}
      <div className="relative flex min-h-[calc(100vh-130px)] items-center justify-center overflow-hidden bg-slate-950 p-4 sm:p-6">
        {isReady ? (
          <div className="relative z-10 w-full max-w-4xl">
            <audio
              ref={audioRef}
              src={scenes!.audioUrl}
              onTimeUpdate={() => audioRef.current && setMs(audioRef.current.currentTime * 1000)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onLoadedMetadata={() => { if (audioRef.current) audioRef.current.playbackRate = rate }}
              className="hidden"
            />

            {/* Scene */}
            <div key={activeIdx} className="animate-scene-in relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
              {active?.imageUrl ? (
                <img
                  src={active.imageUrl}
                  alt=""
                  className={clsx('absolute inset-0 h-full w-full object-cover', playing && 'animate-ken-burns')}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/40 via-indigo-700/40 to-cyan-600/40">
                  <div className="absolute inset-0 flex items-center justify-center text-white/30">
                    <Images size={64} />
                  </div>
                </div>
              )}

              {/* Caption overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-6 pt-16 sm:p-8 sm:pt-24">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-fuchsia-300">
                  <Sparkles size={12} /> Scene {activeIdx + 1} of {segments.length}
                </div>
                <p className="text-[19px] font-semibold leading-relaxed text-white drop-shadow sm:text-[23px] sm:leading-relaxed">
                  {(() => { let wi = -1; return tokens.map((t, i) => {
                    const isWord = !!t.trim()
                    if (isWord) wi += 1
                    const on = isWord && wi === activeWord && playing
                    return (
                      <span key={i} className={clsx('transition-colors duration-150', on ? 'rounded bg-fuchsia-400/30 text-white' : 'text-white/65')}>
                        {t}
                      </span>
                    )
                  }) })()}
                </p>
              </div>
            </div>

            {/* Scene indicator */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {segments.map((s, i) => (
                <button key={s.segmentIndex} onClick={() => seekToSeg(i)}
                  className={clsx('h-1.5 rounded-full transition-all',
                    i === activeIdx ? 'w-8 bg-fuchsia-400' : 'w-2 bg-white/25 hover:bg-white/40')} />
              ))}
            </div>

            {/* Progress */}
            <input type="range" min={0} max={Math.max(1, scenes!.durationMs)} value={Math.min(ms, scenes!.durationMs)}
              onChange={e => { if (audioRef.current) audioRef.current.currentTime = +e.target.value / 1000 }}
              className="mt-3 w-full accent-fuchsia-500" />

            {/* Controls */}
            <div className="mt-3 flex items-center justify-center gap-3">
              <Ctrl onClick={() => activeIdx > 0 && seekToSeg(activeIdx - 1)} title="Previous"><SkipBack size={17} /></Ctrl>
              {!playing ? (
                <button onClick={() => audioRef.current?.play()} className="flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/50 transition hover:bg-fuchsia-500" title="Play">
                  <Play size={22} className="ml-0.5" />
                </button>
              ) : (
                <button onClick={() => audioRef.current?.pause()} className="flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/50 transition hover:bg-fuchsia-500" title="Pause">
                  <Pause size={22} />
                </button>
              )}
              <Ctrl onClick={() => activeIdx < segments.length - 1 && seekToSeg(activeIdx + 1)} title="Next"><SkipForward size={17} /></Ctrl>
              <Ctrl onClick={() => { const a = audioRef.current; if (a) { a.currentTime = 0; a.play() } }} title="Restart"><RotateCcw size={15} /></Ctrl>
              <select value={rate} onChange={e => setRate(+e.target.value)}
                className="ml-2 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs font-medium text-white/80 outline-none">
                {[0.75, 1, 1.25, 1.5].map(r => <option key={r} value={r} className="text-slate-900">{r}x</option>)}
              </select>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="relative z-10 text-center">
            <Loader2 className="mx-auto mb-4 animate-spin text-fuchsia-400" size={36} />
            <div className="text-lg font-semibold text-white">Illustrating your story…</div>
            <div className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              The AI is rewriting each section, narrating it, and painting a picture for every scene.
              Generating images takes a couple of minutes.
            </div>
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-fuchsia-300">
              <Images size={26} />
            </div>
            <div className="text-lg font-semibold text-white">Create an illustrated story</div>
            <p className="mx-auto mt-2 text-sm text-slate-400">
              The AI explains each section in simple words, narrates it, and generates a picture per scene —
              played back as an animated, narrated story.
            </p>
            {scenes?.status === 'Failed' && (
              <div className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {scenes.errorMessage ?? 'Generation failed. Try again.'}
              </div>
            )}
            {!!voices?.length && (
              <select value={voice} onChange={e => setVoice(e.target.value)}
                className="mt-5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none">
                {voices.map(v => <option key={v.id} value={v.id} className="text-slate-900">{v.name} ({v.language})</option>)}
              </select>
            )}
            <button onClick={() => generate.mutate()} disabled={generate.isPending}
              className="mx-auto mt-4 flex items-center gap-2 rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-500 disabled:opacity-60">
              <Sparkles size={15} /> Generate story
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 shadow-sm transition hover:bg-white/15">
      {children}
    </button>
  )
}
