import Link from 'next/link'
import Image from 'next/image'
import { getNewsletters } from '@/lib/newsletters'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Admin Newsletter Dashboard
 *
 * Features:
 * - Lists all newsletters with filtering and stats overview
 * - Status badges: draft (yellow), scheduled (blue), sent (green)
 * - Stats display
 */

async function getNewsletterStats() {
  const [totalSubscribers, recentNewsletter] = await Promise.all([
    prisma.subscriber.count({
      where: { status: 'ACTIVE' },
    }),
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
            ? (
                (recentNewsletter.stats.uniqueOpenCount /
                  recentNewsletter.recipientCount) *
                100
              ).toFixed(1)
            : '0',
          clickRate: recentNewsletter.stats
            ? (
                (recentNewsletter.stats.uniqueClickCount /
                  recentNewsletter.recipientCount) *
                100
              ).toFixed(1)
            : '0',
        }
      : null,
  }
}

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  SCHEDULED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  SENDING: 'bg-[#016dca]/20 text-[#016dca] border-[#016dca]/30',
  SENT: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Entwurf',
  SCHEDULED: 'Geplant',
  SENDING: 'Wird gesendet',
  SENT: 'Gesendet',
}

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Newsletter</h2>
          <p className="text-gray-400 mt-1">
            Newsletter erstellen, planen und versenden
          </p>
        </div>
        <Link href="/admin/newsletters/new">
          <Button variant="primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Neuer Newsletter
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="text-gray-400 text-sm mb-1">Aktive Subscribers</div>
          <div className="text-3xl font-bold text-[#016dca]">
            {stats.totalSubscribers.toLocaleString('de-DE')}
          </div>
        </div>

        {stats.lastNewsletter && (
          <>
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="text-gray-400 text-sm mb-1">
                Letzte Offnungsrate
              </div>
              <div className="text-3xl font-bold text-emerald-400">
                {stats.lastNewsletter.openRate}%
              </div>
              <div className="text-xs text-gray-500 mt-1 truncate">
                {stats.lastNewsletter.subject}
              </div>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="text-gray-400 text-sm mb-1">
                Letzte Klickrate
              </div>
              <div className="text-3xl font-bold text-blue-400">
                {stats.lastNewsletter.clickRate}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.lastNewsletter.recipientCount.toLocaleString('de-DE')} Empfanger
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-4">
        <FilterTab href="/admin/newsletters" label="Alle" active={!status} />
        <FilterTab href="/admin/newsletters?status=DRAFT" label="Entwurfe" active={status === 'DRAFT'} />
        <FilterTab href="/admin/newsletters?status=SCHEDULED" label="Geplant" active={status === 'SCHEDULED'} />
        <FilterTab href="/admin/newsletters?status=SENT" label="Gesendet" active={status === 'SENT'} />
      </div>

      {/* Newsletter List */}
      {newsletters.length === 0 ? (
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center shadow-xl">
          <p className="text-gray-400 mb-4">Keine Newsletter gefunden</p>
          <Link href="/admin/newsletters/new">
            <Button variant="primary">Ersten Newsletter erstellen</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {newsletters.map((newsletter) => (
            <NewsletterListItem key={newsletter.id} newsletter={newsletter} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <Link
                key={p}
                href={`/admin/newsletters?${new URLSearchParams({
                  ...(status && { status }),
                  page: p.toString(),
                })}`}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm transition-colors',
                  p === page
                    ? 'bg-[#016dca] text-black font-semibold'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                )}
              >
                {p}
              </Link>
            )
          )}
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
        'px-4 py-2 rounded-xl transition-colors text-sm',
        active
          ? 'bg-[#016dca] text-black font-semibold'
          : 'text-white/80 hover:bg-white/5'
      )}
    >
      {label}
    </Link>
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
    stats?: {
      uniqueOpenCount: number
      uniqueClickCount: number
    } | null
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

  const openRate = newsletter.stats
    ? newsletter.recipientCount > 0
      ? (
          (newsletter.stats.uniqueOpenCount / newsletter.recipientCount) *
          100
        ).toFixed(1)
      : '0'
    : null

  return (
    <Link href={`/admin/newsletters/${newsletter.id}/edit`}>
      <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-xl hover:bg-white/[0.05] hover:border-white/20 transition-all hover:-translate-y-0.5">
        <div className="flex items-start gap-5">
          {/* Thumbnail */}
          <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-white/5">
            {newsletter.heroImageUrl ? (
              <Image
                src={newsletter.heroImageUrl}
                alt={newsletter.subject}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white truncate">{newsletter.subject}</h3>
              <Badge
                variant="outline"
                className={cn('text-xs border flex-shrink-0', statusColors[newsletter.status])}
              >
                {statusLabels[newsletter.status] || newsletter.status}
              </Badge>
            </div>

            {newsletter.preheader && (
              <p className="text-gray-400 text-sm mb-2 line-clamp-1">{newsletter.preheader}</p>
            )}

            <div className="flex items-center gap-5 text-sm text-gray-400">
              <span>{formattedDate}</span>
              {newsletter.recipientCount > 0 && (
                <span>{newsletter.recipientCount.toLocaleString('de-DE')} Empfänger</span>
              )}
              {openRate && (
                <span className="text-[#016dca]">{openRate}% Öffnungsrate</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <Button variant="secondary" size="sm" className="flex-shrink-0">
            Bearbeiten
          </Button>
        </div>
      </div>
    </Link>
  )
}
