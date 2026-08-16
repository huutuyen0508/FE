'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell, CarFront, ChartNoAxesCombined, ChevronDown, ClipboardCheck, LayoutDashboard,
  LogOut, Map, Menu, Moon, ParkingCircle, Search, Settings, Sparkles, Sun, TriangleAlert, Users, X,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { nav } from '@/lib/smartpark-data'

const iconMap = { Bell, CarFront, ChartNoAxesCombined, ClipboardCheck, LayoutDashboard, Map, Settings, Sparkles, TriangleAlert, Users }

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight" aria-label="SmartPark AI home">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"><ParkingCircle className="size-5" /></span>
      {!compact && <span>SmartPark <span className="text-primary">AI</span></span>}
    </Link>
  )
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-18 items-center justify-between border-b px-5"><Logo /><button className="icon-button lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></button></div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Admin navigation">
          <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Workspace</p>
          {nav.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap]
            const active = pathname === item.href
            return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`nav-item ${active ? 'nav-item-active' : ''}`}><Icon />{item.label}{item.label === 'Approvals' && <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[11px] text-primary-foreground">3</span>}</Link>
          })}
        </nav>
        <div className="border-t p-3"><div className="flex items-center gap-3 rounded-xl p-2"><span className="avatar">AR</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">Alex Rivera</p><p className="truncate text-xs text-muted-foreground">Administrator</p></div><ChevronDown className="size-4 text-muted-foreground" /></div><Link href="/login" className="nav-item mt-1"><LogOut />Sign out</Link></div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation backdrop" />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md md:px-7">
          <div className="flex items-center gap-3"><button className="icon-button lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></button><button className="hidden items-center gap-2 rounded-xl border bg-muted/50 px-3 py-2 text-sm text-muted-foreground md:flex" onClick={() => setSearchOpen(!searchOpen)}><Search className="size-4" />Search anything <kbd className="rounded border bg-background px-1.5 font-mono text-[10px]">⌘K</kbd></button></div>
          <div className="flex items-center gap-2"><button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</button><Link className="icon-button relative" href="/admin/notifications" aria-label="Notifications"><Bell /><span className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background" /></Link><span className="avatar md:hidden">AR</span></div>
        </header>
        {searchOpen && <div className="border-b bg-background px-4 py-3 md:hidden"><label className="search-field"><Search /><input autoFocus placeholder="Search anything..." /></label></div>}
        <main className="mx-auto w-full max-w-[1500px] p-4 md:p-7">{children}</main>
      </div>
    </div>
  )
}

export function ResidentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const links = [
    ['/resident', 'Home', LayoutDashboard], ['/resident/assistant', 'Assistant', Sparkles], ['/resident/vehicles', 'My vehicles', CarFront], ['/resident/guest-parking', 'Guest parking', Users],
  ] as const
  return <div className="min-h-screen bg-muted/40"><header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur"><div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 md:px-7"><Logo /><nav className="hidden items-center gap-1 md:flex">{links.map(([href, label, Icon]) => <Link key={href} href={href} className={`top-nav ${pathname === href ? 'top-nav-active' : ''}`}><Icon />{label}</Link>)}</nav><div className="flex items-center gap-2"><button className="icon-button" aria-label="Notifications"><Bell /></button><span className="avatar">OM</span></div></div></header><main className="mx-auto max-w-7xl p-4 pb-24 md:p-7">{children}</main><nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t bg-background p-2 md:hidden">{links.map(([href, label, Icon]) => <Link key={href} href={href} className={`mobile-tab ${pathname === href ? 'text-primary' : ''}`}><Icon />{label}</Link>)}</nav></div>
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div>{eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[.18em] text-primary">{eyebrow}</p>}<h1 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">{title}</h1><p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p></div>{action}</div>
}

export function StatCard({ label, value, detail, icon: Icon, tone = 'primary' }: { label: string; value: string; detail: string; icon: typeof CarFront; tone?: string }) {
  return <article className="panel p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight">{value}</p></div><span className={`stat-icon stat-${tone}`}><Icon /></span></div><p className="mt-4 text-xs text-muted-foreground">{detail}</p></article>
}

export function Status({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }) {
  return <span className={`status status-${tone}`}>{children}</span>
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null
  return <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/35 p-4" role="presentation" onMouseDown={onClose}><section className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl border bg-background p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(e) => e.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 id="modal-title" className="text-lg font-semibold">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X /></button></div>{children}</section></div>
}
