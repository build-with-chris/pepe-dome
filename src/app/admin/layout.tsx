'use client'

import { ReactNode, useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getRoleFromMetadata, getRoleDisplayName, ROLES, type UserRole } from '@/lib/roles'

/**
 * Admin Layout - Fully isolated from public site styles
 * Uses CSS Grid for a clean sidebar + content layout
 */

interface AdminLayoutProps {
  children: ReactNode
}

interface NavItem {
  label: string
  href: string
  icon: ReactNode
  roles?: UserRole[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Events',
    href: '/admin/events',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Artikel',
    href: '/admin/articles',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    label: 'Newsletter',
    href: '/admin/newsletters',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Abonnenten',
    href: '/admin/subscribers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    label: 'Test-Empfänger',
    href: '/admin/test-recipients',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    roles: [ROLES.SUPER_ADMIN],
  },
]

// Sidebar width constant
const SIDEBAR_WIDTH = 240 // 60 * 4 = 240px (w-60)

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isLoaded } = useUser()
  const pathname = usePathname()

  if (pathname.includes('/sign-in') || pathname.includes('/sign-up')) {
    return <>{children}</>
  }

  const userRole = getRoleFromMetadata(user?.publicMetadata as Record<string, unknown> | undefined)

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(userRole)
  })

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    // Root container - full viewport, isolate from any external styles
    <div
      className="admin-layout-root"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        background: '#09090b',
        overflow: 'hidden',
      }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 40,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          background: '#0c0c0e',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/PEPE_logos_dome.svg"
              alt="Pepe Dome"
              width={144}
              height={38}
              className="h-[38px] w-auto"
            />
            <span className="text-[9px] font-semibold text-[#016dca]/90 bg-[#016dca]/8 px-2 py-1 rounded-md uppercase tracking-widest">
              Admin
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            padding: '12px 10px',
            overflowY: 'auto',
          }}
        >
          <div className="space-y-0.5">
            {filteredNavItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-[12px] font-medium tracking-wide transition-all duration-150',
                    active
                      ? 'bg-white/[0.06] text-white'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                  )}
                >
                  <span className={cn(
                    'transition-colors',
                    active ? 'text-[#016dca]' : 'text-white/30'
                  )}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User */}
        {isLoaded && user && (
          <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-white/[0.03] transition-colors cursor-pointer">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: { avatarBox: 'w-7 h-7' },
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-white/80 truncate tracking-wide">
                  {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
                </p>
                <p className="text-[10px] text-white/30 tracking-wide">{getRoleDisplayName(userRole)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Back link */}
        <div style={{ padding: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[11px] font-medium text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-all duration-150 tracking-wide"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zur Website
          </Link>
        </div>
      </aside>

      {/* Main area - positioned next to sidebar */}
      <div
        className="lg:ml-[240px] ml-0"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100vh',
        }}
      >
        {/* Top bar - sticky within main area */}
        <header
          style={{
            height: 44,
            minHeight: 44,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: '#0a0a0c',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
          }}
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 -ml-1 mr-3 text-white/40 hover:text-white/70 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div style={{ flex: 1 }} />

          {/* User on desktop - minimal */}
          {isLoaded && user && (
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[11px] text-white/40 tracking-wide">
                {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
              </span>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: { avatarBox: 'w-6 h-6' },
                }}
              />
            </div>
          )}
        </header>

        {/* Page content - scrollable */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 20,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
