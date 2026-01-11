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
 * Consistent spacing system:
 * - Section gaps: space-y-8 (32px)
 * - Card internal: p-6 (24px)
 * - Grid gaps: gap-4 (16px)
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Newsletter</h1>
          <p className="text-white/50 mt-1">Newsletter erstellen, planen und versenden</p>
        </div>
        <Link href="/admin/newsletters/new">
          <Button variant="primary" size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Neuer Newsletter
          </Button>
        </Link>
      </div>

      {/* Stats Overview - always in row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
          <div className="text-white/50 text-[11px] uppercase tracking-wider mb-2">Abonnenten</div>
          <div className="text-2xl font-bold text-[#016dca]">
            {stats.totalSubscribers.toLocaleString('de-DE')}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
          <div className="text-white/50 text-[11px] uppercase tracking-wider mb-2">Öffnungsrate</div>
          <div className="text-2xl font-bold text-emerald-400">
            {stats.lastNewsletter?.openRate || '—'}%
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
          <div className="text-white/50 text-[11px] uppercase tracking-wider mb-2">Klickrate</div>
          <div className="text-2xl font-bold text-blue-400">
            {stats.lastNewsletter?.clickRate || '—'}%
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <FilterTab href="/admin/newsletters" label="Alle" active={!status} />
        <FilterTab href="/admin/newsletters?status=DRAFT" label="Entwürfe" active={status === 'DRAFT'} />
        <FilterTab href="/admin/newsletters?status=SCHEDULED" label="Geplant" active={status === 'SCHEDULED'} />
        <FilterTab href="/admin/newsletters?status=SENT" label="Gesendet" active={status === 'SENT'} />
      </div>

      {/* Newsletter List */}
      {newsletters.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-12 text-center">
          <p className="text-white/50 mb-4">Keine Newsletter gefunden</p>
          <Link href="/admin/newsletters/new">
            <Button variant="primary" size="sm">Ersten Newsletter erstellen</Button>
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

function FilterTab({ href, label, active }: { href: string; label: string; active: boolean }) {
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
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
        <div className="flex items-stretch gap-4">
          {/* Thumbnail - full height */}
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
              <div className="w-full h-full flex items-center justify-center min-h-[60px]">
                <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2.5">
              <h3 className="text-[13px] font-medium text-white truncate leading-tight">{newsletter.subject}</h3>
              <Badge variant="outline" className={cn('text-[10px] border flex-shrink-0 px-2', statusColors[newsletter.status])}>
                {statusLabels[newsletter.status] || newsletter.status}
              </Badge>
            </div>

            {newsletter.preheader && (
              <p className="text-white/40 text-xs mt-1 line-clamp-1 leading-tight">{newsletter.preheader}</p>
            )}

            <div className="flex items-center gap-3 text-[11px] text-white/40 mt-1.5">
              <span>{formattedDate}</span>
              {newsletter.recipientCount > 0 && (
                <span>{newsletter.recipientCount.toLocaleString('de-DE')} Empfänger</span>
              )}
              {openRate && (
                <span className="text-[#016dca]">{openRate}%</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <Button variant="ghost" size="xs" className="flex-shrink-0 self-center">
            Bearbeiten
          </Button>
        </div>
      </div>
    </Link>
  )
}
