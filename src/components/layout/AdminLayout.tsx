'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useUser, UserButton } from '@clerk/nextjs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'

/**
 * AdminLayout component following PEPE Dome design system
 *
 * Features:
 * - Sidebar navigation with icons
 * - Header with user info and role badge
 * - Responsive (collapsible sidebar on mobile)
 * - Role-based menu items
 */

interface AdminLayoutProps {
  children: ReactNode
}

interface NavItem {
  label: string
  href: string
  icon: ReactNode
  roles?: string[] // If specified, only show for these roles
}

// Navigation items with icons
const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    label: 'Events',
    href: '/admin/events',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    label: 'Articles',
    href: '/admin/articles',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    ),
  },
  {
    label: 'Newsletters',
    href: '/admin/newsletters',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    label: 'Subscribers',
    href: '/admin/subscribers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    roles: ['super_admin'], // Only visible to super admins
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    roles: ['super_admin'],
  },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, isLoaded } = useUser()

  // Get user role from Clerk metadata (simplified - in production, use proper role checking)
  const userRole = (user?.publicMetadata?.role as string) || 'viewer'

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'default' // Gold/primary
      case 'editor':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'editor':
        return 'Editor'
      default:
        return 'Viewer'
    }
  }

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(userRole) || userRole === 'super_admin'
  })

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-[260px]',
          'bg-[#111111] border-r border-white/10',
          'transition-transform duration-300',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/PEPE_logos_dome.svg"
              alt="Pepe Dome Logo"
              width={120}
              height={36}
              className="h-8 w-auto"
            />
            <Badge
              variant="outline"
              className="text-xs bg-[#016dca]/10 text-[#016dca] border-[#016dca]/30"
            >
              Admin
            </Badge>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl',
                'text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-[#016dca]/15 text-[#016dca]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer - Back to Site */}
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl',
              'text-sm font-medium text-gray-400',
              'hover:text-white hover:bg-white/5',
              'transition-all duration-200'
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Zur Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-[260px]">
        {/* Top Header */}
        <header className="h-16 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
          <div className="h-full px-6 lg:px-8 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
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

            {/* Page Title (could be dynamic) */}
            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold text-white">
                Admin Dashboard
              </h1>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              {isLoaded && user && (
                <>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-white">
                      {user.firstName || user.emailAddresses[0]?.emailAddress}
                    </span>
                    <Badge
                      variant={getRoleBadgeVariant(userRole)}
                      className="text-xs"
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
        <main className="px-6 py-8 lg:px-10 lg:py-10 min-h-[calc(100vh-4rem)]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
