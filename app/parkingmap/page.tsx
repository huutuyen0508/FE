export default function ParkingMapPage() {
  return (
    <main className="min-h-screen bg-background">
      <iframe
        src="/parkingmap-static.html"
        title="SmartPark Parking Map"
        className="h-screen w-full border-0"
      />
    </main>
  )
}
