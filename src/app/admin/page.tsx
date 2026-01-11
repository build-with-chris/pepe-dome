import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isSuperAdmin, canEdit } from '@/lib/roles.server'
import StatsCard, { StatsIcons } from '@/components/admin/StatsCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Admin Dashboard
 *
 * Consistent spacing system:
 * - Section gaps: space-y-8 (32px)
 * - Card internal: p-6 (24px)
 * - Grid gaps: gap-6 (24px)
 * - Small gaps: gap-4 (16px)
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

const statusColors: Record<string, string> = {
  DRAFT: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  PUBLISHED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  ARCHIVED: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  SENT: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  SCHEDULED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
}

const categoryLabels: Record<string, string> = {
  SHOW: 'Show',
  PREMIERE: 'Premiere',
  FESTIVAL: 'Festival',
  WORKSHOP: 'Workshop',
  OPEN_TRAINING: 'Training',
  KINDERTRAINING: 'Kinder',
  BUSINESS: 'Business',
  OPEN_AIR: 'Open Air',
  EVENT: 'Event',
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
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-white/50 mt-1">
          Übersicht über Events, Artikel und Newsletter
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin && (
          <StatsCard
            icon={StatsIcons.subscribers}
            value={stats.subscribers.active}
            label="Aktive Abonnenten"
            description={`${stats.subscribers.total} gesamt`}
            variant="gold"
            href="/admin/subscribers"
          />
        )}
        <StatsCard
          icon={StatsIcons.events}
          value={stats.events.upcoming}
          label="Kommende Events"
          description={`${stats.events.total} gesamt`}
          href="/admin/events"
        />
        <StatsCard
          icon={StatsIcons.articles}
          value={stats.articles.published}
          label="Veröffentlichte Artikel"
          description={`${stats.articles.total - stats.articles.published} Entwürfe`}
          href="/admin/articles"
        />
        <StatsCard
          icon={StatsIcons.newsletters}
          value={stats.newsletters.sent}
          label="Gesendete Newsletter"
          description={openRate ? `${openRate}% Öffnungsrate` : 'Noch keine gesendet'}
          href="/admin/newsletters"
        />
      </div>

      {/* Quick Actions */}
      {canCreate && (
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-5">Schnellaktionen</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/events/new">
              <Button variant="primary" size="sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Neues Event
              </Button>
            </Link>
            <Link href="/admin/articles/new">
              <Button variant="primary" size="sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Neuer Artikel
              </Button>
            </Link>
            <Link href="/admin/newsletters/new">
              <Button variant="secondary" size="sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Neuer Newsletter
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Letzte Events</h2>
            <Link href="/admin/events" className="text-xs text-[#016dca] hover:underline">
              Alle anzeigen
            </Link>
          </div>

          {stats.recentEvents.length === 0 ? (
            <p className="text-white/40 text-[13px]">Keine Events vorhanden</p>
          ) : (
            <div className="space-y-3">
              {stats.recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}/edit`}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-white truncate">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/40">
                        {new Date(event.date).toLocaleDateString('de-DE')}
                      </span>
                      <span className="text-xs text-white/40">
                        {categoryLabels[event.category] || event.category}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn('text-[10px] border ml-3', statusColors[event.status])}>
                    {event.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Articles */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Letzte Artikel</h2>
            <Link href="/admin/articles" className="text-xs text-[#016dca] hover:underline">
              Alle anzeigen
            </Link>
          </div>

          {stats.recentArticles.length === 0 ? (
            <p className="text-white/40 text-[13px]">Keine Artikel vorhanden</p>
          ) : (
            <div className="space-y-3">
              {stats.recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}/edit`}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-white truncate">{article.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/40">{article.author}</span>
                      <span className="text-xs text-white/40">{article.category}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn('text-[10px] border ml-3', statusColors[article.status])}>
                    {article.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Stats */}
      {isAdmin && stats.lastNewsletter && (
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Letzter Newsletter</h2>
            <Link href="/admin/newsletters" className="text-xs text-[#016dca] hover:underline">
              Alle anzeigen
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <p className="text-[15px] font-medium text-white">{stats.lastNewsletter.subject}</p>
              <p className="text-[13px] text-white/40 mt-1.5">
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
        </div>
      )}
    </div>
  )
}
