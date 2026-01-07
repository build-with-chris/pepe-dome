'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useUser, UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { getRoleFromMetadata, getRoleDisplayName, getRoleBadgeVariant, ROLES, type UserRole } from '@/lib/roles'

/**
 * AdminSidebar component
 *
 * Features:
 * - Navigation links with icons
 * - User info and role badge
 * - Role-based menu items filtering
 * - Responsive design with collapsible state
 */

interface NavItem {
  label: string
  href: string
  icon: ReactNode
  roles?: UserRole[] // If specified, only show for these roles
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
    roles: [ROLES.SUPER_ADMIN], // Only visible to super admins
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
    roles: [ROLES.SUPER_ADMIN],
  },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()

  // Get user role from Clerk metadata
  const userRole = getRoleFromMetadata(user?.publicMetadata as Record<string, unknown> | undefined)

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(userRole)
  })

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-[260px]',
          'bg-[#111111] border-r border-white/20',
          'transition-transform duration-300 ease-in-out',
          // Always visible on lg+, toggle on mobile
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
            <Image
              src="/PEPE_logos_dome.svg"
              alt="Pepe Dome Logo"
              width={120}
              height={36}
              className="h-10 w-auto"
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
        <nav className="p-4 space-y-1" role="navigation" aria-label="Admin navigation">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl',
                'text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-[#016dca]/15 text-[#016dca]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Info (visible on sidebar in mobile) */}
        <div className="absolute bottom-16 left-4 right-4 lg:hidden">
          {isLoaded && user && (
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                    userButtonTrigger: 'focus:shadow-none',
                  },
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.firstName || user.emailAddresses[0]?.emailAddress}
                </p>
                <Badge variant={getRoleBadgeVariant(userRole)} className="text-xs mt-0.5">
                  {getRoleDisplayName(userRole)}
                </Badge>
              </div>
            </div>
          )}
        </div>

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
    </>
  )
}
