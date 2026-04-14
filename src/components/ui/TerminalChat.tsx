'use client'

import { useState, useRef, useEffect } from 'react'
import { useTypewriter } from '@/hooks/useTypewriter'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const BOOT_TEXT = '> SISTEMA LISTO. Pregúntame sobre skills, disponibilidad o proyectos.'

function BootLine() {
  const { displayed, done } = useTypewriter(BOOT_TEXT, 25, 400)
  return (
    <p className="font-terminal text-xs text-gray-400 mb-4">
      {displayed}{!done && <span className="cursor-blink" aria-hidden="true" />}
    </p>
  )
}

export default function TerminalChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = messagesContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, streamingText])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setStreamingText('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            if (data === '[ERROR]') {
              accumulated = 'Error de conexión. Intenta de nuevo.'
              break
            }
            try {
              const { text } = JSON.parse(data) as { text: string }
              accumulated += text
              setStreamingText(accumulated)
            } catch {
              // Partial chunk — continue
            }
          }
        }
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: accumulated }])
      setStreamingText('')
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error de conexión. Por favor intenta de nuevo.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="bg-black text-white p-6 md:p-8 shadow-[8px_8px_0_0_#bbe405] relative flex flex-col"
      style={{ minHeight: 360 }}
      role="log"
      aria-label="Chat con asistente de Felipe"
      aria-live="polite"
    >
      {/* Terminal header dots */}
      <div className="absolute top-4 right-4 flex gap-2" aria-hidden="true">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>

      <span className="font-terminal text-[10px] tracking-widest text-gray-400 mb-4 block uppercase">
        ASSISTANT_ONLINE · claude-sonnet-4-6
      </span>

      {/* Boot line */}
      <BootLine />

      {/* Message history */}
      <div ref={messagesContainerRef} className="flex-1 space-y-3 mb-4 overflow-y-auto max-h-52">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-secondary-container' : 'text-gray-300'}>
            <span className="font-terminal text-[10px] opacity-50">
              {msg.role === 'user' ? '> YOU' : '> HEX.vIA.sys[06]'}
            </span>
            <p className="font-terminal text-xs leading-relaxed mt-1 whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}

        {streamingText && (
          <div className="text-gray-300">
            <span className="font-terminal text-[10px] opacity-50">&gt; HEX.vIA.sys[06]</span>
            <p className="font-terminal text-xs leading-relaxed mt-1 whitespace-pre-wrap">
              {streamingText}
              <span className="cursor-blink" aria-hidden="true" />
            </p>
          </div>
        )}

        {loading && !streamingText && (
          <p className="font-terminal text-xs text-gray-500">
            {'> '}<span className="cursor-blink" aria-hidden="true" />
          </p>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="border-t border-white/20 pt-4 flex gap-2">
        <span className="font-terminal text-xs text-secondary-container flex-shrink-0 pt-1" aria-hidden="true">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Escribe tu pregunta..."
          aria-label="Mensaje para el asistente"
          className="flex-1 bg-transparent font-terminal text-xs text-white placeholder-gray-600 outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Enviar mensaje"
          className="font-terminal text-[10px] text-secondary-container uppercase hover:text-white transition-colors disabled:opacity-30"
        >
          SEND
        </button>
      </form>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
        <span className="font-terminal text-xs text-secondary-container animate-pulse">STATUS: LISTENING</span>
        <span className="font-terminal text-xs text-gray-500">END_OF_TRANSMISSION</span>
      </div>
    </div>
  )
}
