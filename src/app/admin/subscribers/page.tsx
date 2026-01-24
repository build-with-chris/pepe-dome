import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isSuperAdmin } from '@/lib/roles.server'

export const dynamic = 'force-dynamic'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatsGrid, StatCard } from '@/components/admin/StatsGrid'
import { FilterTabs } from '@/components/admin/FilterTabs'
import { cn } from '@/lib/utils'
import { SubscriberStatus } from '@prisma/client'
import {
  SUBSCRIBER_STATUS_COLORS,
  SUBSCRIBER_STATUS_LABELS,
} from '@/lib/admin-constants'
import SubscribersClient from './SubscribersClient'

/**
 * Subscribers Admin Page
 */

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

const filterItems = [
  { value: '', label: 'Alle' },
  { value: 'ACTIVE', label: 'Aktiv' },
  { value: 'PENDING', label: 'Ausstehend' },
  { value: 'UNSUBSCRIBED', label: 'Abgemeldet' },
]

export default async function SubscribersAdminPage({ searchParams }: PageProps) {
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
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Abonnenten"
        description={`${totalSubscribers} Abonnenten insgesamt`}
      />

      {/* Stats Cards */}
      <StatsGrid columns={4}>
        <StatCard label="Aktiv" value={statsByStatus.ACTIVE || 0} variant="success" />
        <StatCard label="Ausstehend" value={statsByStatus.PENDING || 0} variant="warning" />
        <StatCard label="Abgemeldet" value={statsByStatus.UNSUBSCRIBED || 0} variant="muted" />
        <StatCard label="Bounced" value={statsByStatus.BOUNCED || 0} variant="error" />
      </StatsGrid>

      {/* Filter Tabs + Export */}
      <div className="flex items-center justify-between gap-4">
        <FilterTabs
          items={filterItems}
          currentValue={status || ''}
          baseUrl="/admin/subscribers"
        />
        <Link href="/api/admin/subscribers/export">
          <Button variant="secondary" size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV Export
          </Button>
        </Link>
      </div>

      {/* Subscribers Table with Detail Modal */}
      <SubscribersClient
        subscribers={subscribers}
        statusColors={SUBSCRIBER_STATUS_COLORS}
        statusLabels={SUBSCRIBER_STATUS_LABELS}
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
