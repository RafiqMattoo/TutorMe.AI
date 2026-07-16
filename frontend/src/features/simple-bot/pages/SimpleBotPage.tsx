import { useEffect, useRef, useState } from 'react'
import { Bot, Loader2, RotateCcw, Send, Sparkles, UserRound } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { simpleBotApi } from '../services'
import { Markdown } from '../../../shared/components/Markdown.tsx'
import { PageHeader } from '../../../shared/components/ui/index.tsx'
import type { SimpleBotTurn } from '../../../shared/types/index.ts'

interface LocalBotMessage extends SimpleBotTurn {
  id: string
  createdAt: string
}

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

export default function SimpleBotPage() {
  const [messages, setMessages] = useState<LocalBotMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  const reset = () => {
    setMessages([])
    setInput('')
  }

  const sendMessage = async () => {
    const question = input.trim()
    if (!question || sending) return

    const history = messages
      .slice(-12)
      .map(({ role, content }) => ({ role, content }))

    const userMessage: LocalBotMessage = {
      id: makeId(),
      role: 'user',
      content: question,
      createdAt: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      const res = await simpleBotApi.ask({ message: question, history })
      const assistantMessage: LocalBotMessage = {
        id: makeId(),
        role: 'assistant',
        content: res.reply || 'I could not produce a response. Please try again.',
        createdAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch {
      toast.error('Simple bot failed to respond')
      setMessages(prev => [...prev, {
        id: makeId(),
        role: 'assistant',
        content: 'I could not reach the AI service. Make sure the backend and Ollama are running.',
        createdAt: new Date().toISOString(),
      }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Simple Bot"
        subtitle="Local Ollama chat"
        action={
          <button onClick={reset} disabled={messages.length === 0 && !input}
            className="btn-secondary px-3 py-2 text-[12px]">
            <RotateCcw size={14} /> Reset
          </button>
        }
      />

      <div className="flex h-[calc(100vh-160px)] flex-col bg-white">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          {messages.length === 0 && !sending && (
            <div className="mx-auto mt-24 max-w-md text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <Bot size={22} />
              </div>
              <h2 className="text-[17px] font-bold text-slate-900">Ask anything</h2>
              <p className="mt-1 text-[13px] text-slate-500">
                This chat talks directly to the configured Ollama model.
              </p>
            </div>
          )}

          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map(message => <MessageRow key={message.id} message={message} />)}

            {sending && (
              <div className="flex gap-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Sparkles size={15} />
                </div>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 py-1" aria-label="Thinking">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); void sendMessage() }}
          className="border-t border-slate-100 bg-white px-4 pb-4 pt-3">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-3xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition-colors focus-within:border-slate-300">
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
                placeholder="Message Simple Bot"
                className="max-h-40 flex-1 resize-none border-0 bg-transparent px-1 py-2 text-[15px] leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
              <button type="submit" disabled={!input.trim() || sending}
                title="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-35">
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function MessageRow({ message }: { message: LocalBotMessage }) {
  const isUser = message.role === 'user'
  const Icon = isUser ? UserRound : Sparkles
  const iconClass = isUser ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600'

  return (
    <div className={clsx('flex gap-4', isUser && 'justify-end')}>
      {!isUser && (
        <div className={clsx('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', iconClass)}>
          <Icon size={15} />
        </div>
      )}

      <div className={clsx(
        'min-w-0 text-[15px] leading-relaxed',
        isUser
          ? 'max-w-[80%] rounded-3xl bg-slate-100 px-5 py-2.5 text-slate-900'
          : 'flex-1 pt-1 text-slate-800',
      )}>
        {isUser
          ? <div className="whitespace-pre-wrap">{message.content}</div>
          : <Markdown content={message.content} />}
      </div>
    </div>
  )
}
