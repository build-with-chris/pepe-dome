'use client'

import { ReactNode, useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { getRoleFromMetadata, getRoleDisplayName, getRoleBadgeVariant, ROLES, type UserRole } from '@/lib/roles'

/**
 * Admin Layout - styled after pepe-shows DashboardLayout
 */

interface AdminLayoutProps {
  children: ReactNode
}

// Sidebar width constant
const SIDEBAR_WIDTH = 260

interface NavItem {
  label: string
  href: string
  icon: ReactNode
  roles?: UserRole[]
}

// Navigation items with icons
const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Events',
    href: '/admin/events',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Articles',
    href: '/admin/articles',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    label: 'Newsletters',
    href: '/admin/newsletters',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Subscribers',
    href: '/admin/subscribers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    roles: [ROLES.SUPER_ADMIN],
  },
]

// Page title mapping
const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/events': 'Events',
  '/admin/events/new': 'Neues Event',
  '/admin/articles': 'Artikel',
  '/admin/articles/new': 'Neuer Artikel',
  '/admin/newsletters': 'Newsletters',
  '/admin/newsletters/new': 'Neuer Newsletter',
  '/admin/subscribers': 'Abonnenten',
  '/admin/settings': 'Einstellungen',
}

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname]
  if (pathname.includes('/edit')) {
    if (pathname.includes('/events/')) return 'Event bearbeiten'
    if (pathname.includes('/articles/')) return 'Artikel bearbeiten'
    if (pathname.includes('/newsletters/')) return 'Newsletter bearbeiten'
  }
  if (pathname.startsWith('/admin/events')) return 'Events'
  if (pathname.startsWith('/admin/articles')) return 'Artikel'
  if (pathname.startsWith('/admin/newsletters')) return 'Newsletters'
  if (pathname.startsWith('/admin/subscribers')) return 'Abonnenten'
  if (pathname.startsWith('/admin/settings')) return 'Einstellungen'
  return 'Dashboard'
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isLoaded } = useUser()
  const pathname = usePathname()

  // Skip layout for auth pages
  const isAuthPage = pathname.includes('/sign-in') || pathname.includes('/sign-up')
  if (isAuthPage) {
    return <>{children}</>
  }

  const userRole = getRoleFromMetadata(user?.publicMetadata as Record<string, unknown> | undefined)
  const pageTitle = getPageTitle(pathname)

  // Filter nav items based on role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(userRole)
  })

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-[#111111] border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ width: SIDEBAR_WIDTH }}
      >
        {/* Sidebar Header - Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/PEPE_logos_dome.svg"
              alt="Pepe Dome Logo"
              width={120}
              height={36}
              className="h-10 w-auto"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-8 space-y-2">
          {/* Section Label */}
          <div className="mb-6 pb-4 border-b border-white/5">
            <span className="px-4 text-xs font-semibold text-[#016dca] uppercase tracking-wider">
              Admin Bereich
            </span>
          </div>

          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-[#016dca]/10 text-[#016dca]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <span className={cn('flex-shrink-0', isActive(item.href) && 'text-[#016dca]')}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-5 border-t border-white/5 bg-[#111111]">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Zur Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area - offset by sidebar width on lg screens */}
      <div className="admin-main-content">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between h-full px-6 lg:px-12">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-medium text-gray-200">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-4">
              {isLoaded && user && (
                <>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-white">
                      {user.firstName || user.emailAddresses[0]?.emailAddress}
                    </span>
                    <Badge
                      variant={getRoleBadgeVariant(userRole)}
                      className={cn(
                        'text-xs',
                        userRole === 'super_admin' && 'bg-[#016dca]/10 text-[#016dca] border-[#016dca]/30'
                      )}
                    >
                      {getRoleDisplayName(userRole)}
                    </Badge>
                  </div>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'w-9 h-9',
                        userButtonPopoverCard: 'bg-[#1A1A1A] border border-white/10',
                        userButtonPopoverActionButton: 'text-white hover:bg-white/10',
                        userButtonPopoverActionButtonText: 'text-white',
                        userButtonPopoverFooter: 'hidden',
                      },
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-12 lg:py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
