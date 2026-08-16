'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { ParkingCircle, X } from 'lucide-react'
import { parkingFloors as seedFloors, type ParkingFloor, type ParkingSlot, type ParkingSlotStatus } from '@/lib/smartpark-data'

type ParkingMapMode = 'admin' | 'readonly'
type ParkingMapProps = { mode?: ParkingMapMode; compact?: boolean; variant?: 'default' | 'chat' }
type Listener = () => void

const STORAGE_KEY = 'smartpark-parking-floors'
const listeners = new Set<Listener>()
let floors: ParkingFloor[] = seedFloors
let hydrated = false

function emit() { listeners.forEach((listener) => listener()) }
function subscribe(listener: Listener) { listeners.add(listener); return () => listeners.delete(listener) }
function getSnapshot() { return floors }
function getServerSnapshot() { return seedFloors }
function hydrate() {
  if (hydrated || typeof window === 'undefined') return
  hydrated = true
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) floors = JSON.parse(stored) as ParkingFloor[]
  } catch { /* fall back to the typed seed data */ }
}
function updateSlot(floorId: ParkingFloor['id'], slotId: string, status: ParkingSlotStatus) {
  floors = floors.map((floor) => floor.id !== floorId ? floor : { ...floor, zones: floor.zones.map((zone) => ({ ...zone, slots: zone.slots.map((slot) => slot.id === slotId ? { ...slot, status } : slot) })) })
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(floors)) } catch { /* persistence is best effort for the frontend MVP */ }
  emit()
}

const statusLabel: Record<ParkingSlotStatus, string> = { available: 'Trống', occupied: 'Đã có xe', reserved: 'Đã đặt', out_of_service: 'Ngừng hoạt động' }
const statusOptions: { value: ParkingSlotStatus; label: string }[] = [
  { value: 'available', label: 'Trống' },
  { value: 'occupied', label: 'Đã có xe' },
  { value: 'reserved', label: 'Đã đặt' },
  { value: 'out_of_service', label: 'Ngừng hoạt động' },
]

export function ParkingMap({ mode = 'readonly', compact = false, variant = 'default' }: ParkingMapProps) {
  const sharedFloors = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [floorId, setFloorId] = useState<ParkingFloor['id']>('B1')
  const [selected, setSelected] = useState<ParkingSlot | null>(null)
  const [editing, setEditing] = useState(false)
  const floor = sharedFloors.find((item) => item.id === floorId) ?? sharedFloors[0]
  const allSlots = floor.zones.flatMap((zone) => zone.slots)
  const counts = useMemo(() => ({ available: allSlots.filter((slot) => slot.status === 'available').length, occupied: allSlots.filter((slot) => slot.status === 'occupied').length, reserved: allSlots.filter((slot) => slot.status === 'reserved').length, out_of_service: allSlots.filter((slot) => slot.status === 'out_of_service').length }), [allSlots])

  useEffect(() => { hydrate(); emit() }, [])
  useEffect(() => { if (selected) setSelected(floor.zones.flatMap((zone) => zone.slots).find((slot) => slot.id === selected.id) ?? null) }, [floor])

  function selectSlot(slot: ParkingSlot) { setSelected(slot); if (mode === 'admin') setEditing(true) }

  return <div className={compact ? 'min-w-0' : 'mx-auto max-w-6xl'}>
    <div className="flex justify-center border-b"><div className="flex gap-2" role="tablist" aria-label="Parking floors">{sharedFloors.map((item) => <button key={item.id} role="tab" aria-selected={floorId === item.id} onClick={() => { setFloorId(item.id); setSelected(null); setEditing(false) }} className={`floor-tab ${floorId === item.id ? 'floor-tab-active' : ''}`}>{item.label}</button>)}</div></div>
    <section className={`mt-4 min-w-0 max-w-full ${variant === 'chat' ? '' : 'grid gap-4 ' + (compact ? '2xl:grid-cols-[minmax(0,1fr)_280px]' : 'lg:grid-cols-[minmax(0,1fr)_240px]')}`}>
      <article className={`map-card min-w-0 max-w-full overflow-x-auto p-3 sm:p-4 ${variant === 'chat' ? 'map-card-chat' : ''}`}><div className="parking-map-canvas"><div className="parking-zone-grid">{floor.zones.map((zone) => <div key={zone.id} className={`parking-zone parking-zone-${zone.id}`}><span className="zone-letter" aria-hidden="true">{zone.id}</span><div className="relative z-10 flex items-center justify-between"><div><h2 className="text-sm font-semibold">{zone.name}</h2><p className="mt-1 text-[11px] text-muted-foreground">{zone.slots.length} slots</p></div><span className="rounded-md bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground">{zone.slots.filter((slot) => slot.status === 'available').length} free</span></div><div className="parking-slots">{zone.slots.map((slot) => <button key={slot.id} type="button" aria-label={`${slot.id}, ${statusLabel[slot.status]}`} aria-pressed={selected?.id === slot.id} onClick={() => selectSlot(slot)} className={`parking-slot parking-slot-${slot.status} ${selected?.id === slot.id ? 'parking-slot-selected' : ''}`}><span>{slot.id}</span></button>)}</div></div>)}</div><div className="parking-lane parking-lane-horizontal" aria-hidden="true" /><div className="parking-lane parking-lane-vertical" aria-hidden="true" /></div></article>
      {variant !== 'chat' && <aside className="map-legend self-start p-5"><h2 className="text-xs font-bold uppercase tracking-[.18em]">Chú giải</h2><div className="mt-5 flex flex-col gap-3 text-sm">{statusOptions.map(({ value, label }) => <div key={value} className="flex items-center gap-3"><span className={`legend-swatch legend-swatch-${value}`} /><span>{label}</span></div>)}</div><div className="mt-7 border-t pt-5"><div className="flex items-end justify-between"><div><p className="text-xs text-muted-foreground">Tổng sức chứa</p><p className="mt-1 text-2xl font-bold">{allSlots.length}</p></div><ParkingCircle className="size-5 text-primary" /></div><div className="mt-5 flex items-end justify-between"><div><p className="text-xs text-muted-foreground">Trống hiện tại</p><p className="mt-1 text-2xl font-bold text-success">{counts.available}</p></div><span className="text-xs text-muted-foreground">{counts.occupied + counts.reserved} in use</span></div></div>{selected && mode === 'readonly' && <div className="mt-6 rounded-xl bg-primary/5 p-3"><p className="text-xs text-muted-foreground">Selected slot</p><p className="mt-1 font-mono font-semibold text-primary">{selected.id}</p><p className="mt-1 text-xs">{statusLabel[selected.status]}</p></div>}</aside>}
    </section>
    {mode === 'admin' && editing && selected && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(false) }}><section className="w-full max-w-sm rounded-2xl border bg-card p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="slot-dialog-title"><div className="flex items-start justify-between"><div><p className="section-kicker">Admin edit</p><h2 id="slot-dialog-title" className="mt-2 text-xl font-bold">Slot {selected.id}</h2><p className="mt-1 text-sm text-muted-foreground">Current: {statusLabel[selected.status]}</p></div><button className="icon-button" aria-label="Close edit dialog" onClick={() => setEditing(false)}><X /></button></div><div className="mt-5 grid gap-2">{statusOptions.map(({ value, label }) => <button key={value} type="button" onClick={() => { updateSlot(floor.id, selected.id, value); setEditing(false) }} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition hover:border-primary ${selected.status === value ? 'border-primary bg-primary/5 text-primary' : ''}`}><span>{label}</span><span className={`legend-swatch legend-swatch-${value}`} /></button>)}</div></section></div>}
  </div>
}

export function resetParkingMapState() { floors = seedFloors; hydrated = false; if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY); emit() }
export type { ParkingMapMode }
