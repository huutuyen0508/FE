export type Vehicle = {
  plate: string
  owner: string
  unit: string
  type: string
  status: 'Parked' | 'Away' | 'Pending'
  spot: string
}

export type Resident = {
  name: string
  initials: string
  email: string
  unit: string
  vehicles: number
  status: 'Active' | 'Pending' | 'Suspended'
}

export const vehicles: Vehicle[] = [
  { plate: '8ABC123', owner: 'Olivia Martin', unit: 'A-1204', type: 'Tesla Model 3', status: 'Parked', spot: 'A-024' },
  { plate: '7XYZ890', owner: 'Noah Williams', unit: 'B-0806', type: 'BMW X5', status: 'Away', spot: 'B-118' },
  { plate: '5KLM456', owner: 'Emma Davis', unit: 'A-0412', type: 'Honda Civic', status: 'Parked', spot: 'A-067' },
  { plate: '9QRS218', owner: 'Liam Wilson', unit: 'C-1018', type: 'Audi Q4', status: 'Pending', spot: '—' },
  { plate: '6DEF742', owner: 'Ava Thompson', unit: 'B-0309', type: 'Toyota RAV4', status: 'Away', spot: 'B-044' },
]

export const residents: Resident[] = [
  { name: 'Olivia Martin', initials: 'OM', email: 'olivia@example.com', unit: 'A-1204', vehicles: 2, status: 'Active' },
  { name: 'Noah Williams', initials: 'NW', email: 'noah@example.com', unit: 'B-0806', vehicles: 1, status: 'Active' },
  { name: 'Emma Davis', initials: 'ED', email: 'emma@example.com', unit: 'A-0412', vehicles: 1, status: 'Active' },
  { name: 'Liam Wilson', initials: 'LW', email: 'liam@example.com', unit: 'C-1018', vehicles: 1, status: 'Pending' },
  { name: 'Ava Thompson', initials: 'AT', email: 'ava@example.com', unit: 'B-0309', vehicles: 2, status: 'Suspended' },
]

export const activity = [
  ['Vehicle entered', '8ABC123 · Main entrance', '2 min ago'],
  ['Guest pass created', 'Unit A-1204 · Sarah Miller', '14 min ago'],
  ['Space assignment updated', 'B-118 assigned to Noah Williams', '38 min ago'],
  ['Vehicle exited', '5KLM456 · North gate', '1 hr ago'],
]

export const alerts = [
  { id: 1, severity: 'Critical', title: 'Unauthorized vehicle detected', text: 'Vehicle 4JKL928 entered through the north gate without an active permit.', time: '4 min ago' },
  { id: 2, severity: 'Warning', title: 'Occupancy nearing capacity', text: 'Level B2 is currently at 92% capacity.', time: '18 min ago' },
  { id: 3, severity: 'Info', title: 'Camera maintenance scheduled', text: 'Camera C-14 will be unavailable tonight from 1:00–1:30 AM.', time: '2 hr ago' },
]

export const notifications = [
  { id: 1, title: 'New resident registration', text: 'Liam Wilson submitted a resident access request.', time: '5 minutes ago', unread: true },
  { id: 2, title: 'Parking space released', text: 'Space A-084 is now available.', time: '23 minutes ago', unread: true },
  { id: 3, title: 'Monthly report is ready', text: 'Your July occupancy report can now be exported.', time: 'Yesterday', unread: false },
  { id: 4, title: 'Guest pass expiring', text: 'Pass GP-2094 expires in 30 minutes.', time: 'Yesterday', unread: false },
]

export const approvals = [
  { id: 'REQ-1048', person: 'Liam Wilson', kind: 'Resident access', detail: 'Unit C-1018 · 1 vehicle', submitted: '12 min ago', status: 'Pending' },
  { id: 'REQ-1047', person: 'Sophia Anderson', kind: 'Vehicle registration', detail: 'Unit A-0711 · 2 vehicles', submitted: '46 min ago', status: 'Pending' },
  { id: 'REQ-1046', person: 'James Thomas', kind: 'Guest extension', detail: 'Unit B-0302 · +6 hours', submitted: '2 hr ago', status: 'Pending' },
]

export type ParkingRowId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type ParkingSlotStatus = 'available' | 'occupied' | 'reserved' | 'out_of_service'
export type ParkingSlot = { id: string; floorId: 'B1' | 'B2' | 'B3'; row: ParkingRowId; status: ParkingSlotStatus; isMine?: boolean }
export type ParkingZone = { id: ParkingRowId; name: string; slots: ParkingSlot[] }
export type ParkingFloor = { id: 'B1' | 'B2' | 'B3'; label: string; zones: ParkingZone[] }

const zoneNames = ['A', 'B', 'C', 'D', 'E', 'F'] as const
const rowLengths = [25, 25, 20, 20, 25, 25] as const
const slotStatus = (floorIndex: number, zoneIndex: number, slotIndex: number): ParkingSlotStatus => {
  const value = (floorIndex * 11 + zoneIndex * 5 + slotIndex) % 12
  return value < 4 ? 'available' : value < 7 ? 'occupied' : value < 9 ? 'reserved' : value === 9 ? 'out_of_service' : 'available'
}

export const parkingFloors: ParkingFloor[] = (['B1', 'B2', 'B3'] as const).map((id, floorIndex) => ({
  id,
  label: `${id} Floor`,
  zones: zoneNames.map((zone, zoneIndex) => ({
    id: zone,
    name: `Row ${zone}`,
    slots: Array.from({ length: rowLengths[zoneIndex] }, (_, slotIndex) => ({ id: `${zone}${String(slotIndex + 1).padStart(2, '0')}`, floorId: id, row: zone, status: slotStatus(floorIndex, zoneIndex, slotIndex), isMine: (id === 'B1' && zone === 'A' && slotIndex === 3) || (id === 'B1' && zone === 'E' && slotIndex === 1) })),
  })),
}))

export const parkingSpaces = parkingFloors[0].zones.flatMap((zone) => zone.slots)

export const nav = [
  { href: '/admin', label: 'Overview', icon: 'LayoutDashboard' },
  { href: '/admin/map', label: 'Parking map', icon: 'Map' },
  { href: '/admin/vehicles', label: 'Vehicles', icon: 'CarFront' },
  { href: '/admin/residents', label: 'Residents', icon: 'Users' },
  { href: '/admin/settings', label: 'Settings', icon: 'Settings' },
]
