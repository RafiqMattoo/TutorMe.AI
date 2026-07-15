import React from 'react'

// Lightweight markdown renderer — headings, bold/italic/code, bullet & numbered
// lists, paragraphs. Avoids pulling in a markdown library. HTML in the source is
// escaped first, so model/document output can't inject markup.
function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inline(s: string) {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-gray-100 rounded text-xs">$1</code>')
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  const lines = content.split('\n')
  const out: React.ReactNode[] = []
  let ul: string[] = []
  let ol: string[] = []

  const flushUl = () => {
    if (ul.length === 0) return
    out.push(
      <ul key={`ul-${out.length}`} className="list-disc ml-5 my-2 space-y-1">
        {ul.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: inline(li) }} />)}
      </ul>)
    ul = []
  }
  const flushOl = () => {
    if (ol.length === 0) return
    out.push(
      <ol key={`ol-${out.length}`} className="list-decimal ml-5 my-2 space-y-1">
        {ol.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: inline(li) }} />)}
      </ol>)
    ol = []
  }
  const flush = () => { flushUl(); flushOl() }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.startsWith('### ')) {
      flush()
      out.push(<h3 key={out.length} className="text-sm font-semibold mt-3 mb-1 first:mt-0">{line.slice(4)}</h3>)
    } else if (line.startsWith('## ')) {
      flush()
      out.push(<h2 key={out.length} className="text-base font-bold mt-3 mb-1 first:mt-0">{line.slice(3)}</h2>)
    } else if (line.startsWith('# ')) {
      flush()
      out.push(<h1 key={out.length} className="text-lg font-bold mt-3 mb-2 first:mt-0">{line.slice(2)}</h1>)
    } else if (/^\s*[-*]\s+/.test(line)) {
      flushOl()
      ul.push(line.replace(/^\s*[-*]\s+/, ''))
    } else if (/^\s*\d+\.\s+/.test(line)) {
      flushUl()
      ol.push(line.replace(/^\s*\d+\.\s+/, ''))
    } else if (line.trim() === '') {
      flush()
    } else {
      flush()
      out.push(<p key={out.length} className="my-2 first:mt-0 last:mb-0 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: inline(line) }} />)
    }
  }
  flush()
  return <div className={className}>{out}</div>
}
