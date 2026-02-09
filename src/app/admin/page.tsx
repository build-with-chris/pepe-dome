import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { isSuperAdmin, canEdit } from '@/lib/roles.server'
import StatsCard, { StatsIcons } from '@/components/admin/StatsCard'
import { AdminCard } from '@/components/admin/AdminCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/Button'
import { CATEGORY_LABELS } from '@/lib/admin-constants'

/**
 * Admin Dashboard
 *
 * Consistent spacing system:
 * - Section gaps: space-y-6
 * - Card internal: p-6
 * - Grid gaps: gap-5
 */

async function getDashboardStats() {
  const [
    eventCount,
    upcomingEventCount,
    articleCount,
    publishedArticleCount,
    newsletterCount,
    sentNewsletterCount,
    subscriberCount,
    activeSubscriberCount,
    recentEvents,
    recentArticles,
    lastNewsletter,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({
      where: {
        date: { gte: new Date() },
        status: 'PUBLISHED',
      },
    }),
    prisma.article.count(),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.newsletter.count(),
    prisma.newsletter.count({ where: { status: 'SENT' } }),
    prisma.subscriber.count(),
    prisma.subscriber.count({ where: { status: 'ACTIVE' } }),
    prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        date: true,
        category: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        category: true,
        author: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.newsletter.findFirst({
      where: { status: 'SENT' },
      orderBy: { sentAt: 'desc' },
      include: { stats: true },
    }),
  ])

  return {
    events: { total: eventCount, upcoming: upcomingEventCount },
    articles: { total: articleCount, published: publishedArticleCount },
    newsletters: { total: newsletterCount, sent: sentNewsletterCount },
    subscribers: { total: subscriberCount, active: activeSubscriberCount },
    recentEvents,
    recentArticles,
    lastNewsletter,
  }
}

export default async function AdminDashboard() {
  const [stats, isAdmin, canCreate] = await Promise.all([
    getDashboardStats(),
    isSuperAdmin(),
    canEdit(),
  ])

  const openRate = stats.lastNewsletter?.stats && stats.lastNewsletter.recipientCount > 0
    ? ((stats.lastNewsletter.stats.uniqueOpenCount / stats.lastNewsletter.recipientCount) * 100).toFixed(1)
    : null

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {isAdmin && (
          <StatsCard
            icon={StatsIcons.subscribers}
            value={stats.subscribers.active}
            label="Abonnenten"
            description={`${stats.subscribers.total} gesamt`}
            variant="gold"
            href="/admin/subscribers"
            compact
          />
        )}
        <StatsCard
          icon={StatsIcons.events}
          value={stats.events.upcoming}
          label="Events"
          description={`${stats.events.total} gesamt`}
          href="/admin/events"
          compact
        />
        <StatsCard
          icon={StatsIcons.articles}
          value={stats.articles.published}
          label="Artikel"
          description={`${stats.articles.total - stats.articles.published} Entwürfe`}
          href="/admin/articles"
          compact
        />
        <StatsCard
          icon={StatsIcons.newsletters}
          value={stats.newsletters.sent}
          label="Newsletter"
          description={openRate ? `${openRate}% Öffnung` : 'Keine gesendet'}
          href="/admin/newsletters"
          compact
        />
      </div>

      {/* Quick Actions */}
      {canCreate && (
        <AdminCard title="Schnellaktionen" padding="md">
          <div className="flex gap-3 -mt-2">
            <Link href="/admin/events/new">
              <Button variant="primary" size="sm">+ Event</Button>
            </Link>
            <Link href="/admin/articles/new">
              <Button variant="primary" size="sm">+ Artikel</Button>
            </Link>
            <Link href="/admin/newsletters/new">
              <Button variant="secondary" size="sm">+ Newsletter</Button>
            </Link>
          </div>
        </AdminCard>
      )}

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <AdminCard
          title="Letzte Events"
          action={
            <Link href="/admin/events" className="text-xs text-[#016dca] hover:underline">
              Alle →
            </Link>
          }
        >
          {stats.recentEvents.length === 0 ? (
            <p className="text-white/40 text-sm">Keine Events</p>
          ) : (
            <div className="space-y-2">
              {stats.recentEvents.map((event: {
                id: string
                title: string
                date: Date
                category: string
                status: string
                createdAt: Date
              }) => (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}/edit`}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{event.title}</p>
                    <span className="text-xs text-white/40">
                      {new Date(event.date).toLocaleDateString('de-DE')} · {CATEGORY_LABELS[event.category] || event.category}
                    </span>
                  </div>
                  <StatusBadge status={event.status} className="ml-3" />
                </Link>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Recent Articles */}
        <AdminCard
          title="Letzte Artikel"
          action={
            <Link href="/admin/articles" className="text-xs text-[#016dca] hover:underline">
              Alle →
            </Link>
          }
        >
          {stats.recentArticles.length === 0 ? (
            <p className="text-white/40 text-sm">Keine Artikel</p>
          ) : (
            <div className="space-y-2">
              {stats.recentArticles.map((article: {
                id: string
                title: string
                category: string
                author: string
                status: string
                createdAt: Date
              }) => (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}/edit`}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{article.title}</p>
                    <span className="text-xs text-white/40">
                      {article.author} · {article.category}
                    </span>
                  </div>
                  <StatusBadge status={article.status} className="ml-3" />
                </Link>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Newsletter Stats */}
      {isAdmin && stats.lastNewsletter && (
        <AdminCard
          title="Letzter Newsletter"
          action={
            <Link href="/admin/newsletters" className="text-xs text-[#016dca] hover:underline">
              Alle anzeigen
            </Link>
          }
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <p className="text-base font-medium text-white">{stats.lastNewsletter.subject}</p>
              <p className="text-sm text-white/40 mt-1">
                Gesendet am{' '}
                {stats.lastNewsletter.sentAt
                  ? new Date(stats.lastNewsletter.sentAt).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>

            {stats.lastNewsletter.stats && (
              <div className="flex gap-8">
                <div>
                  <p className="text-2xl font-bold text-[#016dca]">
                    {stats.lastNewsletter.recipientCount.toLocaleString('de-DE')}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Empfänger</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">
                    {stats.lastNewsletter.recipientCount > 0
                      ? ((stats.lastNewsletter.stats.uniqueOpenCount / stats.lastNewsletter.recipientCount) * 100).toFixed(1)
                      : '0'}%
                  </p>
                  <p className="text-xs text-white/40 mt-1">Öffnungsrate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {stats.lastNewsletter.recipientCount > 0
                      ? ((stats.lastNewsletter.stats.uniqueClickCount / stats.lastNewsletter.recipientCount) * 100).toFixed(1)
                      : '0'}%
                  </p>
                  <p className="text-xs text-white/40 mt-1">Klickrate</p>
                </div>
              </div>
            )}
          </div>
        </AdminCard>
      )}
    </div>
  )
}
