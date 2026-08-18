'use client'

import { FormEvent, useState } from 'react'
import { Bot, Check, Send, Sparkles, User } from 'lucide-react'
import { type ParkingSlot } from '@/lib/smartpark-data'
import { getParkingFloorsSnapshot, ParkingMap } from './parking-map'
import { ResidentShell } from './shell'

type ChatMessage =
  | { id: number; role: 'user' | 'assistant'; type: 'text'; content: string }
  | { id: number; role: 'assistant'; type: 'parking-recommendation'; floorId: 'B1' | 'B2' | 'B3'; recommendedSlotIds: string[]; selectedSlotId?: string }

const initialMessages: ChatMessage[] = [
  { id: 1, role: 'assistant', type: 'text', content: 'Xin chào Olivia. Tôi có thể giúp bạn tìm chỗ đỗ, quản lý khách và trả lời các câu hỏi về xe của bạn.' },
]
const quickPrompt = 'Hãy tìm cho tôi chỗ đỗ xe điện'
const candidates = ['A05', 'B04', 'C03', 'D05']

function isElectricRequest(value: string) {
  const text = value.toLowerCase().replace(/[!?.,]/g, '')
  return text.includes('xe điện') || text === 'xe điện' || text.includes('electric')
}

export function ResidentAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [selection, setSelection] = useState<{ slotId: string; floorId: 'B1' | 'B2' | 'B3' } | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [recommendedSlotIds, setRecommendedSlotIds] = useState<string[]>([])

  const latestRecommendation = [...messages].reverse().find((message): message is Extract<ChatMessage, { type: 'parking-recommendation' }> => message.type === 'parking-recommendation')
  function getAvailableCandidates() {
    const floor = getParkingFloorsSnapshot().find((item) => item.id === 'B1')
    const available = new Set(floor?.zones.flatMap((zone) => zone.slots).filter((slot) => slot.status === 'available').map((slot) => slot.id))
    return candidates.filter((id) => available.has(id)).slice(0, 3)
  }

  function addElectricRequest(text: string) {
    const availableCandidates = getAvailableCandidates()
    setRecommendedSlotIds(availableCandidates)
    setSelection(null)
    setConfirmed(false)
    setLoading(true)
    setMessages((current) => [...current, { id: Date.now(), role: 'user', type: 'text', content: text }])
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', type: 'text', content: `Tôi đã tìm thấy ${availableCandidates.length} vị trí phù hợp cho xe điện ở tầng B1. Hãy chọn một vị trí trên bản đồ.` }, { id: Date.now() + 2, role: 'assistant', type: 'parking-recommendation', floorId: 'B1', recommendedSlotIds: availableCandidates }])
      setLoading(false)
    }, 450)
  }

  function sendMessage(event: FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setDraft('')
    if (isElectricRequest(text)) addElectricRequest(text)
    else setMessages((current) => [...current, { id: Date.now(), role: 'user', type: 'text', content: text }, { id: Date.now() + 1, role: 'assistant', type: 'text', content: 'Tôi có thể giúp bạn tìm chỗ đỗ xe điện. Hãy thử yêu cầu tìm chỗ cho xe điện.', }])
  }

  function chooseSlot(slot: ParkingSlot) {
    if (!latestRecommendation?.recommendedSlotIds.includes(slot.id)) return
    setSelection({ slotId: slot.id, floorId: latestRecommendation.floorId })
    setConfirmed(false)
  }

  function confirmSlot() {
    if (!selection) return
    setConfirmed(true)
    setMessages((current) => [...current, { id: Date.now(), role: 'user', type: 'text', content: `Tôi chọn vị trí ${selection.slotId}.` }, { id: Date.now() + 1, role: 'assistant', type: 'text', content: `Bạn đã chọn vị trí ${selection.slotId} tại tầng ${selection.floorId}. Vị trí này phù hợp với xe điện và hiện đang còn trống. Bạn có thể tiếp tục sang bước xác nhận giữ chỗ.` }])
  }

  return <ResidentShell><main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col"><div className="mb-6 text-center"><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Hôm nay, 10:42 AM</p><h1 className="mt-3 text-2xl font-bold tracking-tight">Parking assistant</h1><p className="mt-2 text-sm text-muted-foreground">Trợ lý thông minh cho mọi nhu cầu đỗ xe của bạn.</p></div><section className="panel flex min-h-[600px] min-w-0 flex-1 flex-col overflow-hidden"><header className="flex items-center gap-3 border-b p-5"><span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"><Sparkles className="size-5" /></span><div><h2 className="font-semibold">SmartPark AI</h2><p className="flex items-center gap-1 text-xs text-success"><span className="realtime-dot" />Online and ready</p></div></header><div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-6 sm:px-8">{messages.map((message) => <div key={message.id} className={`flex min-w-0 gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}><span className={`grid size-8 shrink-0 place-items-center rounded-full ${message.role === 'user' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>{message.role === 'user' ? <User className="size-4" /> : <Bot className="size-4" />}</span><div className="min-w-0 max-w-[90%]">{message.type === 'text' ? <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-tr-sm bg-primary text-primary-foreground' : 'rounded-tl-sm bg-muted'}`}>{message.content}</div> : <div className="w-full rounded-2xl border bg-card p-3 sm:p-4"><div className="mb-3 flex items-center justify-between"><div><p className="text-sm font-semibold">{message.floorId} Floor</p><p className="text-xs text-muted-foreground">{message.recommendedSlotIds.length} đề xuất · chỉ vị trí trống</p></div><span className="status status-info">Xe điện</span></div><ParkingMap mode="select" variant="chat" floorId={message.floorId} selectableSlotIds={message.recommendedSlotIds} selectedSlotId={selection?.slotId} onSelectSlot={chooseSlot}/>{selection && !confirmed && <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-primary/5 p-3"><p className="text-sm">Chọn vị trí <strong>{selection.slotId}</strong></p><button className="button-primary" onClick={confirmSlot}><Check className="size-4"/>Xác nhận vị trí</button></div>}</div>}</div></div>)}{loading && <div className="flex items-center gap-3 text-sm text-muted-foreground"><span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary"><Bot className="size-4" /></span>SmartPark AI đang tìm vị trí phù hợp...</div>}</div><div className="border-t p-4"><div className="mb-3 flex flex-wrap gap-2">{[quickPrompt, 'Đặt chỗ cho khách', 'Xe của tôi ở đâu?'].map((suggestion) => <button key={suggestion} className="filter-chip" onClick={() => { if (isElectricRequest(suggestion)) addElectricRequest(suggestion); else setDraft(suggestion) }}>{suggestion}</button>)}</div><form onSubmit={sendMessage} className="flex items-center gap-2 rounded-xl border bg-background p-2"><input aria-label="Tin nhắn cho SmartPark AI" className="min-h-0 flex-1 border-0 bg-transparent px-2 focus:ring-0" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Nhập yêu cầu của bạn..."/><button className="button-primary size-10 justify-center p-0" aria-label="Gửi tin nhắn" disabled={loading}><Send className="size-4"/></button></form></div></section></main></ResidentShell>
}

export default ResidentAssistantPage
