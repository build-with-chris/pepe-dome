import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isSuperAdmin } from '@/lib/roles.server'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { SubscriberStatus } from '@prisma/client'
import SubscribersClient from './SubscribersClient'

/**
 * Subscribers Admin Page
 *
 * Features:
 * - DataTable: Email, Name, Status, Date, Last Activity
 * - Filters: Status (Active, Pending, Unsubscribed)
 * - Search
 * - Role check: Super Admin only
 * - Export CSV functionality
 * - Subscriber detail view modal
 */

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
  UNSUBSCRIBED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  BOUNCED: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Ausstehend',
  ACTIVE: 'Aktiv',
  UNSUBSCRIBED: 'Abgemeldet',
  BOUNCED: 'Bounced',
}

async function getSubscribers(status?: SubscriberStatus, page = 1, limit = 50) {
  const where = status ? { status } : {}

  const [subscribers, total, stats] = await Promise.all([
    prisma.subscriber.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        status: true,
        interests: true,
        createdAt: true,
        confirmedAt: true,
        lastOpenAt: true,
        lastClickAt: true,
      },
    }),
    prisma.subscriber.count({ where }),
    prisma.subscriber.groupBy({
      by: ['status'],
      _count: true,
    }),
  ])

  return {
    subscribers: subscribers.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      confirmedAt: s.confirmedAt?.toISOString() || null,
      lastOpenAt: s.lastOpenAt?.toISOString() || null,
      lastClickAt: s.lastClickAt?.toISOString() || null,
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    stats,
  }
}

function isValidStatus(status: string | undefined): status is SubscriberStatus {
  return status !== undefined && ['PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'BOUNCED'].includes(status)
}

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>
}

export default async function SubscribersAdminPage({ searchParams }: PageProps) {
  // Super Admin only
  const isAdmin = await isSuperAdmin()
  if (!isAdmin) {
    redirect('/admin')
  }

  const params = await searchParams
  const statusParam = params.status
  const status = isValidStatus(statusParam) ? statusParam : undefined
  const page = parseInt(params.page || '1', 10)

  const { subscribers, pagination, stats } = await getSubscribers(status, page)

  const statsByStatus = stats.reduce((acc, s) => {
    acc[s.status] = s._count
    return acc
  }, {} as Record<string, number>)

  const totalSubscribers = Object.values(statsByStatus).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Subscribers</h1>
          <p className="text-white/50 mt-1">
            {totalSubscribers} Subscribers insgesamt
          </p>
        </div>
        <Link href="/api/admin/subscribers/export">
          <Button variant="secondary" size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV exportieren
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
          <p className="text-[11px] text-white/50 uppercase tracking-wider mb-2">Aktiv</p>
          <p className="text-2xl font-bold text-emerald-400">
            {statsByStatus.ACTIVE || 0}
          </p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
          <p className="text-[11px] text-white/50 uppercase tracking-wider mb-2">Ausstehend</p>
          <p className="text-2xl font-bold text-yellow-400">
            {statsByStatus.PENDING || 0}
          </p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
          <p className="text-[11px] text-white/50 uppercase tracking-wider mb-2">Abgemeldet</p>
          <p className="text-2xl font-bold text-white/40">
            {statsByStatus.UNSUBSCRIBED || 0}
          </p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
          <p className="text-[11px] text-white/50 uppercase tracking-wider mb-2">Bounced</p>
          <p className="text-2xl font-bold text-red-400">
            {statsByStatus.BOUNCED || 0}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <FilterTab href="/admin/subscribers" label="Alle" active={!status} />
        <FilterTab href="/admin/subscribers?status=ACTIVE" label="Aktiv" active={status === 'ACTIVE'} />
        <FilterTab href="/admin/subscribers?status=PENDING" label="Ausstehend" active={status === 'PENDING'} />
        <FilterTab href="/admin/subscribers?status=UNSUBSCRIBED" label="Abgemeldet" active={status === 'UNSUBSCRIBED'} />
      </div>

      {/* Subscribers Table with Detail Modal */}
      <SubscribersClient
        subscribers={subscribers}
        statusColors={statusColors}
        statusLabels={statusLabels}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/subscribers?${new URLSearchParams({
                ...(status && { status }),
                page: p.toString(),
              })}`}
              className={cn(
                'px-4 py-2 rounded-lg text-sm transition-colors',
                p === pagination.page
                  ? 'bg-[#016dca] text-white font-medium'
                  : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08]'
              )}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterTab({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
        active
          ? 'bg-[#016dca] text-white shadow-lg shadow-[#016dca]/20'
          : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10'
      )}
    >
      {label}
    </Link>
  )
}
