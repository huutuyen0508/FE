'use client'

import { usePathname } from 'next/navigation'
import { AdminDashboard, AnalyticsPage, ParkingMapPage } from './admin-core-pages'
import { ResidentsPage, VehiclesPage } from './admin-management-pages'
import { AlertsPage, ApprovalsPage, AssistantPage, NotificationsPage, SettingsPage } from './admin-tool-pages'
import { LoginPage } from './public-pages'
import { GuestParkingPage, MyVehiclesPage, RegisterVehiclePage, ResidentDashboard, ResidentMapPage } from './resident-pages'
import { ResidentAssistantPage } from './resident-assistant-page'

export function SmartParkRouter() {
  const path = usePathname()
  const pages: Record<string, React.ComponentType> = {
    '/login': LoginPage,
    '/admin': AdminDashboard,
    '/admin/map': ParkingMapPage,
    '/admin/vehicles': VehiclesPage,
    '/admin/residents': ResidentsPage,
    '/admin/analytics': AnalyticsPage,
    '/admin/alerts': AlertsPage,
    '/admin/notifications': NotificationsPage,
    '/admin/approvals': ApprovalsPage,
    '/admin/assistant': AssistantPage,
    '/admin/settings': SettingsPage,
    '/resident': ResidentDashboard,
    '/resident/map': ResidentMapPage,
    '/resident/assistant': ResidentAssistantPage,
    '/resident/vehicles': MyVehiclesPage,
    '/resident/vehicles/register': RegisterVehiclePage,
    '/resident/guest-parking': GuestParkingPage,
  }
  const Page = pages[path]
  if (!Page) return <main className="grid min-h-screen place-items-center"><div className="text-center"><p className="font-mono text-sm text-primary">404</p><h1 className="mt-2 text-3xl font-bold">Page not found</h1><a href="/" className="button-primary mt-6">Return home</a></div></main>
  return <Page />
}
