'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { ArrowRight, DoorOpen, ParkingCircle, X } from 'lucide-react'
import { parkingFloors as seedFloors, type ParkingFloor, type ParkingSlot, type ParkingSlotStatus } from '@/lib/smartpark-data'

type ParkingMapMode = 'admin' | 'readonly' | 'select'
type ParkingMapProps = { mode?: ParkingMapMode; compact?: boolean; variant?: 'default' | 'chat'; floorId?: ParkingFloor['id']; selectableSlotIds?: string[]; selectedSlotId?: string; onSelectSlot?: (slot: ParkingSlot) => void }
type Listener = () => void

const STORAGE_KEY = 'smartpark-parking-floors'
const listeners = new Set<Listener>()
let floors: ParkingFloor[] = seedFloors
let hydrated = false
function emit() { listeners.forEach((listener) => listener()) }
function subscribe(listener: Listener) { listeners.add(listener); return () => listeners.delete(listener) }
function getSnapshot() { return floors }
function getServerSnapshot() { return seedFloors }
function hydrate() { if (hydrated || typeof window === 'undefined') return; hydrated = true; try { const stored = window.localStorage.getItem(STORAGE_KEY); if (stored) floors = JSON.parse(stored) as ParkingFloor[] } catch {} }
function updateSlot(floorId: ParkingFloor['id'], slotId: string, status: ParkingSlotStatus) { floors = floors.map((floor) => floor.id !== floorId ? floor : { ...floor, zones: floor.zones.map((zone) => ({ ...zone, slots: zone.slots.map((slot) => slot.id === slotId ? { ...slot, status } : slot) })) }); try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(floors)) } catch {}; emit() }

const statusLabel: Record<ParkingSlotStatus, string> = { available: 'Còn trống', occupied: 'Đang đỗ', reserved: 'Đã đặt trước', special: 'Khác / Đặc biệt', out_of_service: 'Ngừng sử dụng' }
const statusOptions: { value: ParkingSlotStatus; label: string }[] = Object.entries(statusLabel).map(([value, label]) => ({ value: value as ParkingSlotStatus, label }))
const rowGroups = [['A', 'B'], ['E', 'F']] as const

function LiftBlock({ central = false }: { central?: boolean }) { return <div className={`floorplan-lift ${central ? 'floorplan-lift-central' : ''}`}><div className="floorplan-stairs" /><div className="floorplan-lift-label"><ParkingCircle className="size-4" /><span>Thang máy</span></div></div> }
function SlotButton({ slot, mode, selectableSlotIds, selectedSlotId, selected, onClick }: { slot: ParkingSlot; mode: ParkingMapMode; selectableSlotIds: string[]; selectedSlotId?: string; selected?: ParkingSlot | null; onClick: () => void }) { const selectable = mode !== 'select' || (slot.status === 'available' && selectableSlotIds.includes(slot.id)); return <button type="button" disabled={!selectable} aria-label={`${slot.id}, ${statusLabel[slot.status]}`} aria-pressed={(selectedSlotId ?? selected?.id) === slot.id} onClick={onClick} className={`floorplan-slot floorplan-slot-${slot.status} ${slot.isMine ? 'floorplan-slot-mine' : ''} ${(selectedSlotId ?? selected?.id) === slot.id ? 'floorplan-slot-selected' : ''} ${mode === 'select' && selectable ? 'floorplan-slot-recommended' : ''}`}><span>{slot.id}</span></button> }

export function ParkingMap({ mode = 'readonly', compact = false, variant = 'default', floorId: initialFloorId = 'B1', selectableSlotIds = [], selectedSlotId, onSelectSlot }: ParkingMapProps) {
  const sharedFloors = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [floorId, setFloorId] = useState<ParkingFloor['id']>(initialFloorId)
  const [selected, setSelected] = useState<ParkingSlot | null>(null)
  const [editing, setEditing] = useState(false)
  const floor = sharedFloors.find((item) => item.id === floorId) ?? sharedFloors[0]
  const allSlots = floor.zones.flatMap((zone) => zone.slots)
  const counts = useMemo(() => ({ available: allSlots.filter((slot) => slot.status === 'available').length, occupied: allSlots.filter((slot) => slot.status === 'occupied').length, reserved: allSlots.filter((slot) => slot.status === 'reserved').length }), [allSlots])
  useEffect(() => { hydrate(); emit() }, [])
  useEffect(() => { if (selected) setSelected(floor.zones.flatMap((zone) => zone.slots).find((slot) => slot.id === selected.id) ?? null) }, [floor])
  function selectSlot(slot: ParkingSlot) { if (mode === 'select') { if (slot.status === 'available' && selectableSlotIds.includes(slot.id)) { setSelected(slot); onSelectSlot?.(slot) }; return }; setSelected(slot); if (mode === 'admin') setEditing(true) }

  return <div className={compact ? 'min-w-0' : 'mx-auto max-w-[1440px]'}>
    <div className="flex justify-center border-b"><div className="flex gap-2" role="tablist" aria-label="Các tầng đỗ xe">{sharedFloors.map((item) => <button key={item.id} role="tab" aria-selected={floorId === item.id} onClick={() => { setFloorId(item.id); setSelected(null); setEditing(false) }} className={`floor-tab ${floorId === item.id ? 'floor-tab-active' : ''}`}>{item.label}</button>)}</div></div>
    {variant !== 'chat' && <div className="floorplan-header"><div><h1>Sơ đồ tầng trệt</h1><p>Trạng thái chỗ đỗ và phân khu theo thời gian thực.</p></div><div className="floorplan-legend">{statusOptions.filter(({ value }) => value !== 'out_of_service').map(({ value, label }) => <span key={value}><i className={`legend-swatch legend-swatch-${value}`} />{value === 'special' ? 'Khác / Đặc biệt' : label}</span>)}<span><i className="legend-swatch legend-swatch-mine" />Xe của bạn</span></div></div>}
    <section className={`floorplan-card ${variant === 'chat' ? 'floorplan-card-chat' : ''}`}><div className="floorplan-scroll"><div className="floorplan-shell">
      <aside className="floorplan-left"><div className="floorplan-infra"><div className="floorplan-stairs tall" /><LiftBlock /></div><div className="floorplan-entry"><strong>ENTRY</strong><span><DoorOpen /></span></div><div className="floorplan-infra"><div className="floorplan-stairs tall" /><LiftBlock /></div></aside>
      <div className="floorplan-main"><div className="floorplan-row-group">{rowGroups[0].map((row) => <div key={row} className="floorplan-row">{floor.zones.find((zone) => zone.id === row)?.slots.map((slot) => <SlotButton key={slot.id} slot={slot} mode={mode} selectableSlotIds={selectableSlotIds} selectedSlotId={selectedSlotId} selected={selected} onClick={() => selectSlot(slot)} />)}</div>)}<div className="floorplan-divider" /></div><div className="floorplan-middle"><div className="floorplan-row-split"><div className="floorplan-row">{floor.zones.find((zone) => zone.id === 'C')?.slots.slice(0, 10).map((slot) => <SlotButton key={slot.id} slot={slot} mode={mode} selectableSlotIds={selectableSlotIds} selectedSlotId={selectedSlotId} selected={selected} onClick={() => selectSlot(slot)} />)}</div><LiftBlock central /><div className="floorplan-row">{floor.zones.find((zone) => zone.id === 'C')?.slots.slice(10).map((slot) => <SlotButton key={slot.id} slot={slot} mode={mode} selectableSlotIds={selectableSlotIds} selectedSlotId={selectedSlotId} selected={selected} onClick={() => selectSlot(slot)} />)}</div></div><div className="floorplan-aisle"><ArrowRight /><ArrowRight /></div><div className="floorplan-row-split"><div className="floorplan-row">{floor.zones.find((zone) => zone.id === 'D')?.slots.slice(0, 10).map((slot) => <SlotButton key={slot.id} slot={slot} mode={mode} selectableSlotIds={selectableSlotIds} selectedSlotId={selectedSlotId} selected={selected} onClick={() => selectSlot(slot)} />)}</div><LiftBlock central /><div className="floorplan-row">{floor.zones.find((zone) => zone.id === 'D')?.slots.slice(10).map((slot) => <SlotButton key={slot.id} slot={slot} mode={mode} selectableSlotIds={selectableSlotIds} selectedSlotId={selectedSlotId} selected={selected} onClick={() => selectSlot(slot)} />)}</div></div></div><div className="floorplan-divider" />{rowGroups[1].map((row) => <div key={row} className="floorplan-row">{floor.zones.find((zone) => zone.id === row)?.slots.map((slot) => <SlotButton key={slot.id} slot={slot} mode={mode} selectableSlotIds={selectableSlotIds} selectedSlotId={selectedSlotId} selected={selected} onClick={() => selectSlot(slot)} />)}</div>)}</div>
      <aside className="floorplan-exit"><strong>EXIT</strong><span><DoorOpen /></span></aside>
    </div></div></section>
    {variant !== 'chat' && <div className="mt-4 flex items-center justify-end gap-4 text-xs text-muted-foreground"><ParkingCircle className="size-4 text-primary" />{counts.available} chỗ trống · {counts.occupied} đang đỗ · {counts.reserved} đã đặt trước · {allSlots.length} total</div>}
    {mode === 'admin' && editing && selected && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(false) }}><section className="w-full max-w-sm rounded-2xl border bg-card p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="slot-dialog-title"><div className="flex items-start justify-between"><div><p className="section-kicker">Chỉnh sửa quản trị</p><h2 id="slot-dialog-title" className="mt-2 text-xl font-bold">Slot {selected.id}</h2><p className="mt-1 text-sm text-muted-foreground">Hiện tại: {statusLabel[selected.status]}</p></div><button className="icon-button" aria-label="Close edit dialog" onClick={() => setEditing(false)}><X /></button></div><div className="mt-5 grid gap-2">{statusOptions.map(({ value, label }) => <button key={value} type="button" onClick={() => { updateSlot(floor.id, selected.id, value); setEditing(false) }} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition hover:border-primary ${selected.status === value ? 'border-primary bg-primary/5 text-primary' : ''}`}><span>{label}</span><span className={`legend-swatch legend-swatch-${value}`} /></button>)}</div></section></div>}
  </div>
}

export function resetParkingMapState() { floors = seedFloors; hydrated = false; if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY); emit() }
export function getParkingFloorsSnapshot() { hydrate(); return floors }
export type { ParkingMapMode }
