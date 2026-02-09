import Link from 'next/link'
import Image from 'next/image'
import { getNewsletters } from '@/lib/newsletters'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatsGrid, StatCard } from '@/components/admin/StatsGrid'
import { FilterTabs } from '@/components/admin/FilterTabs'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { AdminCard } from '@/components/admin/AdminCard'
import { cn } from '@/lib/utils'

/**
 * Admin Newsletter Dashboard
 */

async function getNewsletterStats() {
  const [totalSubscribers, recentNewsletter] = await Promise.all([
    prisma.subscriber.count({ where: { status: 'ACTIVE' } }),
    prisma.newsletter.findFirst({
      where: { status: 'SENT' },
      orderBy: { sentAt: 'desc' },
      include: { stats: true },
    }),
  ])

  return {
    totalSubscribers,
    lastNewsletter: recentNewsletter
      ? {
          subject: recentNewsletter.subject,
          sentAt: recentNewsletter.sentAt,
          recipientCount: recentNewsletter.recipientCount,
          openRate: recentNewsletter.stats
            ? ((recentNewsletter.stats.uniqueOpenCount / recentNewsletter.recipientCount) * 100).toFixed(1)
            : '0',
          clickRate: recentNewsletter.stats
            ? ((recentNewsletter.stats.uniqueClickCount / recentNewsletter.recipientCount) * 100).toFixed(1)
            : '0',
        }
      : null,
  }
}

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>
}

const filterItems = [
  { value: '', label: 'Alle' },
  { value: 'DRAFT', label: 'Entwürfe' },
  { value: 'SCHEDULED', label: 'Geplant' },
  { value: 'SENT', label: 'Gesendet' },
]

export default async function NewsletterDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const status = params.status as 'DRAFT' | 'SCHEDULED' | 'SENT' | undefined
  const page = parseInt(params.page || '1', 10)

  const [{ newsletters, pagination }, stats] = await Promise.all([
    getNewsletters({ page, limit: 20, status }),
    getNewsletterStats(),
  ])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Newsletter"
        description="Newsletter erstellen, planen und versenden"
        action={
          <Link href="/admin/newsletters/new">
            <Button variant="primary" size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Neuer Newsletter
            </Button>
          </Link>
        }
      />

      {/* Stats Overview */}
      <StatsGrid columns={3}>
        <StatCard
          label="Abonnenten"
          value={stats.totalSubscribers}
          variant="primary"
        />
        <StatCard
          label="Öffnungsrate"
          value={`${stats.lastNewsletter?.openRate || '—'}%`}
          variant="success"
        />
        <StatCard
          label="Klickrate"
          value={`${stats.lastNewsletter?.clickRate || '—'}%`}
          variant="default"
        />
      </StatsGrid>

      {/* Filter Tabs */}
      <FilterTabs
        items={filterItems}
        currentValue={status || ''}
        baseUrl="/admin/newsletters"
      />

      {/* Newsletter List */}
      {newsletters.length === 0 ? (
        <AdminCard padding="lg" className="text-center py-12">
          <p className="text-white/50 mb-4">Keine Newsletter gefunden</p>
          <Link href="/admin/newsletters/new">
            <Button variant="primary" size="sm">Ersten Newsletter erstellen</Button>
          </Link>
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {newsletters.map((newsletter: {
            id: string
            subject: string
            preheader: string | null
            heroImageUrl: string | null
            status: string
            sentAt: Date | null
            scheduledAt: Date | null
            createdAt: Date
            recipientCount: number
            stats?: { uniqueOpenCount: number; uniqueClickCount: number } | null
          }) => (
            <NewsletterListItem key={newsletter.id} newsletter={newsletter} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/newsletters?${new URLSearchParams({
                ...(status && { status }),
                page: p.toString(),
              })}`}
              className={cn(
                'px-4 py-2 rounded-lg text-sm transition-colors',
                p === page
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

function NewsletterListItem({
  newsletter,
}: {
  newsletter: {
    id: string
    subject: string
    preheader: string | null
    heroImageUrl: string | null
    status: string
    sentAt: Date | null
    scheduledAt: Date | null
    createdAt: Date
    recipientCount: number
    stats?: { uniqueOpenCount: number; uniqueClickCount: number } | null
  }
}) {
  const formattedDate = newsletter.sentAt
    ? new Date(newsletter.sentAt).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : newsletter.scheduledAt
    ? `Geplant: ${new Date(newsletter.scheduledAt).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}`
    : new Date(newsletter.createdAt).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

  const openRate = newsletter.stats && newsletter.recipientCount > 0
    ? ((newsletter.stats.uniqueOpenCount / newsletter.recipientCount) * 100).toFixed(1)
    : null

  return (
    <Link href={`/admin/newsletters/${newsletter.id}/edit`}>
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
        <div className="flex items-stretch gap-5">
          {/* Thumbnail */}
          <div className="relative w-16 flex-shrink-0 rounded-lg overflow-hidden bg-white/[0.04]">
            {newsletter.heroImageUrl ? (
              <Image
                src={newsletter.heroImageUrl}
                alt={newsletter.subject}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center min-h-[64px]">
                <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-medium text-white truncate">{newsletter.subject}</h3>
              <StatusBadge status={newsletter.status} />
            </div>

            {newsletter.preheader && (
              <p className="text-white/40 text-sm mt-1.5 line-clamp-1">{newsletter.preheader}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-white/40 mt-2">
              <span>{formattedDate}</span>
              {newsletter.recipientCount > 0 && (
                <span>{newsletter.recipientCount.toLocaleString('de-DE')} Empfänger</span>
              )}
              {openRate && (
                <span className="text-[#016dca]">{openRate}% geöffnet</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <Button variant="ghost" size="sm" className="flex-shrink-0 self-center">
            Bearbeiten
          </Button>
        </div>
      </div>
    </Link>
  )
}
