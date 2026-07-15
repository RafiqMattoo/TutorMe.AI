import { useEffect, useRef, useState } from 'react'
import { Bot, Loader2, RotateCcw, Send, Sparkles, X } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { simpleBotApi } from '../api'
import { Markdown } from './Markdown'
import type { SimpleBotTurn } from '../types'

interface BotMessage extends SimpleBotTurn {
  id: string
}

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

export default function FloatingBotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<BotMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending, open])

  const reset = () => {
    setMessages([])
    setInput('')
  }

  const sendMessage = async () => {
    const question = input.trim()
    if (!question || sending) return

    const history = messages.slice(-12).map(({ role, content }) => ({ role, content }))
    setMessages(prev => [...prev, { id: makeId(), role: 'user', content: question }])
    setInput('')
    setSending(true)

    try {
      const res = await simpleBotApi.ask({ message: question, history })
      setMessages(prev => [...prev, {
        id: makeId(),
        role: 'assistant',
        content: res.reply || 'I could not produce a response. Please try again.',
      }])
    } catch {
      toast.error('Simple bot failed to respond')
      setMessages(prev => [...prev, {
        id: makeId(),
        role: 'assistant',
        content: 'I could not reach the AI service. Make sure the API and Ollama are running.',
      }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-3 flex h-[min(560px,calc(100vh-112px))] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Bot size={16} />
              </span>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-bold text-slate-900">Simple Bot</div>
                <div className="truncate text-[11px] font-medium text-slate-400">Ollama chat</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                disabled={messages.length === 0 && !input}
                title="Reset chat"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 disabled:opacity-35"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Close"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 && !sending && (
              <div className="mt-16 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Sparkles size={18} />
                </div>
                <div className="text-[13px] font-semibold text-slate-700">Ask me anything</div>
              </div>
            )}

            <div className="space-y-4">
              {messages.map(message => <MessageBubble key={message.id} message={message} />)}
              {sending && (
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Sparkles size={13} />
                  </span>
                  <span className="inline-flex items-center gap-1 py-1" aria-label="Thinking">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
                  </span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); void sendMessage() }}
            className="border-t border-slate-100 bg-white p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 px-3 py-2 focus-within:border-slate-300">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void sendMessage()
                  }
                }}
                rows={1}
                placeholder="Message"
                className="max-h-28 min-h-[36px] flex-1 resize-none border-0 bg-transparent py-2 text-[13px] leading-5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                title="Send"
                className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-35"
              >
                {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-label={open ? 'Close Simple Bot' : 'Open Simple Bot'}
        title={open ? 'Close Simple Bot' : 'Open Simple Bot'}
        className={clsx(
          'flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl shadow-blue-600/30 ring-1 ring-white/30 transition hover:-translate-y-0.5 hover:shadow-2xl',
          open ? 'bg-slate-900' : 'bg-blue-600 hover:bg-blue-700',
        )}
      >
        {open ? <X size={22} /> : <Bot size={23} />}
      </button>
    </div>
  )
}

function MessageBubble({ message }: { message: BotMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={clsx(
        'max-w-[86%] text-[13px] leading-5',
        isUser
          ? 'rounded-2xl bg-slate-100 px-3.5 py-2.5 text-slate-900'
          : 'text-slate-800',
      )}>
        {isUser ? <div className="whitespace-pre-wrap">{message.content}</div> : <Markdown content={message.content} />}
      </div>
    </div>
  )
}
