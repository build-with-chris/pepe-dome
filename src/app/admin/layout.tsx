'use client'

import { ReactNode, useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { getRoleFromMetadata, getRoleDisplayName, getRoleBadgeVariant } from '@/lib/roles'
import { cn } from '@/lib/utils'

/**
 * Admin Layout
 *
 * Protected by Clerk middleware.
 * Features:
 * - Collapsible sidebar navigation
 * - Header with user info and role badge
 * - Responsive design
 * - Role-based access
 */

interface AdminLayoutProps {
  children: ReactNode
}

// Page title mapping
const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/events': 'Events',
  '/admin/events/new': 'New Event',
  '/admin/articles': 'Articles',
  '/admin/articles/new': 'New Article',
  '/admin/newsletters': 'Newsletters',
  '/admin/newsletters/new': 'New Newsletter',
  '/admin/subscribers': 'Subscribers',
  '/admin/settings': 'Settings',
}

function getPageTitle(pathname: string): string {
  // Check for exact match first
  if (pageTitles[pathname]) {
    return pageTitles[pathname]
  }

  // Check for edit pages
  if (pathname.includes('/edit')) {
    if (pathname.includes('/events/')) return 'Edit Event'
    if (pathname.includes('/articles/')) return 'Edit Article'
    if (pathname.includes('/newsletters/')) return 'Edit Newsletter'
  }

  // Default titles based on path
  if (pathname.startsWith('/admin/events')) return 'Events'
  if (pathname.startsWith('/admin/articles')) return 'Articles'
  if (pathname.startsWith('/admin/newsletters')) return 'Newsletters'
  if (pathname.startsWith('/admin/subscribers')) return 'Subscribers'
  if (pathname.startsWith('/admin/settings')) return 'Settings'

  return 'Admin Dashboard'
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

  // Get user role from Clerk metadata
  const userRole = getRoleFromMetadata(user?.publicMetadata as Record<string, unknown> | undefined)
  const pageTitle = getPageTitle(pathname)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-[260px]">
        {/* Top Header */}
        <header className="h-16 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
          <div className="h-full px-6 lg:px-8 flex items-center justify-between">
            {/* Left side: Mobile menu + Page title */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>

              {/* Page Title */}
              <h1 className="text-lg font-semibold text-[var(--pepe-white)]">
                {pageTitle}
              </h1>
            </div>

            {/* Right side: User Info */}
            <div className="flex items-center gap-4">
              {isLoaded && user && (
                <>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-[var(--pepe-white)]">
                      {user.firstName || user.emailAddresses[0]?.emailAddress}
                    </span>
                    <Badge
                      variant={getRoleBadgeVariant(userRole)}
                      className={cn(
                        'text-xs',
                        userRole === 'super_admin' && 'bg-[var(--pepe-gold)]/10 text-[var(--pepe-gold)] border-[var(--pepe-gold)]/30'
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
                        userButtonTrigger: 'focus:shadow-none',
                      },
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8 lg:px-8 lg:py-10 min-h-[calc(100vh-4rem)]">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
