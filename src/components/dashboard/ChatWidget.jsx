import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const SUGGESTIONS = [
  'What should I work on next?',
  'How is my practice trending?',
  'Which clubs need the most work?',
]

export default function ChatWidget({ sessions }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    const userText = text ?? input.trim()
    if (!userText || loading) return
    setInput('')

    const next = [...messages, { role: 'user', content: userText }]
    setMessages(next)
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: next, sessions },
      })
      if (error) throw error
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Drawer */}
      <div className={`chat-drawer ${open ? 'chat-drawer-open' : ''}`}>
        <div className="chat-drawer-header">
          <div className="chat-drawer-title">
            <span className="chat-drawer-icon">⛳</span>
            Practice Coach
          </div>
          <button className="chat-close-btn" onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <p>Ask me anything about your practice sessions.</p>
              <div className="chat-suggestions">
                {SUGGESTIONS.map(s => (
                  <button key={s} className="chat-suggestion" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`chat-msg chat-msg-${m.role}`}>
              {m.content}
            </div>
          ))}

          {loading && (
            <div className="chat-msg chat-msg-assistant chat-typing">
              <span /><span /><span />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Ask your coach…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            disabled={loading}
          />
          <button className="chat-send-btn" onClick={() => send()} disabled={loading || !input.trim()}>
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
              <path d="M17 10L3 3l3 7-3 7 14-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Backdrop (mobile) */}
      {open && <div className="chat-backdrop" onClick={() => setOpen(false)} />}

      {/* Floating bubble */}
      <button className={`chat-bubble ${open ? 'chat-bubble-open' : ''}`} onClick={() => setOpen(o => !o)}>
        {open ? (
          <svg viewBox="0 0 20 20" fill="none" width="22" height="22">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </>
  )
}
