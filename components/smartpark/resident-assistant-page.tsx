'use client'

import { FormEvent, useState } from 'react'
import { Bot, CarFront, Check, Clock3, MapPin, Send, Sparkles, User } from 'lucide-react'
import { ParkingMap } from './parking-map'
import { PageHeader, ResidentShell } from './shell'

type Message = { id: number; from: 'assistant' | 'user'; text: string; meta?: string }

const initialMessages: Message[] = [
  { id: 1, from: 'assistant', text: 'Hi Olivia. I can help you find a parking space, manage guests, and answer questions about your vehicle.', meta: 'SmartPark AI · just now' },
  { id: 2, from: 'user', text: 'Find me an available spot for my Tesla tonight.' },
  { id: 3, from: 'assistant', text: 'I found several options on B1. A3 is closest to the main elevator and is available now.', meta: 'SmartPark AI · just now' },
]

const suggestions = ['Find an EV spot', 'Reserve a guest space', 'Where is my car?']

export function ResidentAssistantPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')

  function sendMessage(event: FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((current) => [...current, { id: Date.now(), from: 'user', text }, { id: Date.now() + 1, from: 'assistant', text: 'I’ll check that for you. The live parking map on the right shows the latest availability.', meta: 'SmartPark AI · just now' }])
    setDraft('')
  }

  return <ResidentShell><div className="mx-auto max-w-7xl"><PageHeader eyebrow="Resident portal" title="Parking assistant" description="Ask SmartPark AI to find spaces, coordinate guests, and manage your parking." /><section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,480px)]"><article className="panel flex min-h-[620px] min-w-0 flex-col overflow-hidden"><div className="flex items-center gap-3 border-b p-5"><span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"><Sparkles className="size-5" /></span><div><h2 className="font-semibold">SmartPark AI</h2><p className="flex items-center gap-1 text-xs text-success"><span className="realtime-dot" />Online and ready</p></div></div><div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">{messages.map((message) => <div key={message.id} className={`flex gap-3 ${message.from === 'user' ? 'flex-row-reverse' : ''}`}><span className={`grid size-8 shrink-0 place-items-center rounded-full ${message.from === 'user' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>{message.from === 'user' ? <User className="size-4" /> : <Bot className="size-4" />}</span><div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.from === 'user' ? 'rounded-tr-sm bg-primary text-primary-foreground' : 'rounded-tl-sm bg-muted'}`}><p>{message.text}</p>{message.meta && <p className="mt-2 text-[11px] opacity-65">{message.meta}</p>}</div></div>)}</div><div className="border-t p-4"><div className="mb-3 flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" className="filter-chip" onClick={() => setDraft(suggestion)}>{suggestion}</button>)}</div><form onSubmit={sendMessage} className="flex items-center gap-2 rounded-xl border bg-background p-2"><input value={draft} onChange={(event) => setDraft(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none" placeholder="Ask about parking..." aria-label="Ask SmartPark AI" /><button className="button-primary size-10 justify-center p-0" type="submit" aria-label="Send message"><Send className="size-4" /></button></form></div></article><aside className="flex min-w-0 flex-col gap-4"><div className="panel overflow-hidden"><div className="flex items-center justify-between border-b p-4"><div><h2 className="font-semibold">Live availability</h2><p className="text-xs text-muted-foreground">Tap a floor to explore spaces</p></div><MapPin className="size-5 text-primary" /></div><div className="p-3"><ParkingMap mode="readonly" compact /></div></div><div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1"><div className="panel flex items-center gap-3 p-4"><span className="stat-icon stat-success"><Check /></span><div><p className="text-xs text-muted-foreground">Your vehicle</p><p className="font-mono font-semibold">A-024</p></div></div><div className="panel flex items-center gap-3 p-4"><span className="stat-icon stat-primary"><CarFront /></span><div><p className="text-xs text-muted-foreground">Vehicle</p><p className="font-semibold">Tesla Model 3</p></div></div><div className="panel flex items-center gap-3 p-4"><span className="stat-icon stat-warning"><Clock3 /></span><div><p className="text-xs text-muted-foreground">Reservation</p><p className="font-semibold">14h 22m left</p></div></div></div></aside></section></div></ResidentShell>
}

export default ResidentAssistantPage
