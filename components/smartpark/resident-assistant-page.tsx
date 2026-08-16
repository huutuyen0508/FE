'use client'

import { FormEvent, useState } from 'react'
import { Bot, Send, Sparkles, User } from 'lucide-react'
import { ParkingMap } from './parking-map'
import { ResidentShell } from './shell'

type Message = { id: number; from: 'assistant' | 'user'; text: string; meta?: string; map?: boolean }

const initialMessages: Message[] = [
  { id: 1, from: 'assistant', text: 'Xin chào Olivia. Tôi có thể giúp bạn tìm chỗ đỗ, quản lý khách và trả lời các câu hỏi về xe của bạn.', meta: 'SmartPark AI · vừa xong' },
  { id: 2, from: 'user', text: 'Cho tôi xem chỗ trống ở B1.' },
  { id: 3, from: 'assistant', text: 'Tôi đã tìm thấy các vị trí phù hợp ở B1.', meta: 'SmartPark AI · vừa xong', map: true },
]

const suggestions = ['Tìm chỗ xe điện', 'Đặt chỗ cho khách', 'Xe của tôi ở đâu?']

export function ResidentAssistantPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')

  function sendMessage(event: FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((current) => [...current, { id: Date.now(), from: 'user', text }, { id: Date.now() + 1, from: 'assistant', text: 'Tôi sẽ kiểm tra giúp bạn. Đây là tình trạng chỗ đỗ mới nhất.', meta: 'SmartPark AI · vừa xong' }])
    setDraft('')
  }

  return <ResidentShell><main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col"><div className="mb-6 text-center"><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Hôm nay, 10:42 AM</p><h1 className="mt-3 text-2xl font-bold tracking-tight">Parking assistant</h1><p className="mt-2 text-sm text-muted-foreground">Trợ lý thông minh cho mọi nhu cầu đỗ xe của bạn.</p></div><section className="panel flex min-h-[600px] min-w-0 flex-1 flex-col overflow-hidden"><header className="flex items-center gap-3 border-b p-5"><span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"><Sparkles className="size-5" /></span><div><h2 className="font-semibold">SmartPark AI</h2><p className="flex items-center gap-1 text-xs text-success"><span className="realtime-dot" />Online and ready</p></div></header><div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-6 sm:px-8">{messages.map((message) => <div key={message.id} className={`flex min-w-0 gap-3 ${message.from === 'user' ? 'flex-row-reverse' : ''}`}><span className={`grid size-8 shrink-0 place-items-center rounded-full ${message.from === 'user' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>{message.from === 'user' ? <User className="size-4" /> : <Bot className="size-4" />}</span><div className={`${message.map ? 'w-full max-w-[90%]' : 'max-w-[78%]'} min-w-0`}><div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.from === 'user' ? 'rounded-tr-sm bg-primary text-primary-foreground' : 'rounded-tl-sm bg-muted'}`}><p>{message.text}</p>{message.meta && <p className="mt-2 text-[11px] opacity-65">{message.meta}</p>}</div>{message.map && <div className="mt-3 min-w-0 max-w-full rounded-2xl border bg-card p-3 sm:p-4"><div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">B1 Floor</p><p className="text-xs text-muted-foreground">Live parking availability</p></div><span className="flex items-center gap-1.5 text-xs font-semibold text-success"><span className="realtime-dot" />Live</span></div><ParkingMap mode="readonly" compact variant="chat" /><button type="button" className="mt-3 w-full text-right text-xs font-semibold text-primary hover:underline">Xem toàn bản đồ</button></div>}</div></div>)}</div><footer className="border-t p-4 sm:p-5"><div className="mb-3 flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" className="filter-chip" onClick={() => setDraft(suggestion)}>{suggestion}</button>)}</div><form onSubmit={sendMessage} className="flex items-center gap-2 rounded-xl border bg-background p-2"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground" aria-hidden="true">+</span><input value={draft} onChange={(event) => setDraft(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none" placeholder="Nhập yêu cầu tìm chỗ đỗ..." aria-label="Nhập yêu cầu tìm chỗ đỗ" /><button type="submit" className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground" aria-label="Gửi tin nhắn"><Send className="size-4" /></button></form></footer></section></main></ResidentShell>
}

export default ResidentAssistantPage
