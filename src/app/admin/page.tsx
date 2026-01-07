import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getUserRole, isSuperAdmin, canEdit } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import StatsCard, { StatsIcons } from '@/components/admin/StatsCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Admin Dashboard
 *
 * Features:
 * - Stats overview (subscribers, events, articles)
 * - Role-based stat visibility (subscribers = Super Admin only)
 * - Recent activity section
 * - Quick actions section (hidden from Viewer)
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
    // Recent events
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
    // Recent articles
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
    // Last sent newsletter
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
  const [stats, userRole, isAdmin, canCreate] = await Promise.all([
    getDashboardStats(),
    getUserRole(),
    isSuperAdmin(),
    canEdit(),
  ])

  // Calculate newsletter open rate
  const openRate = stats.lastNewsletter?.stats && stats.lastNewsletter.recipientCount > 0
    ? ((stats.lastNewsletter.stats.uniqueOpenCount / stats.lastNewsletter.recipientCount) * 100).toFixed(1)
    : null

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Willkommen im Admin-Bereich
        </h2>
        <p className="text-gray-400 mt-1">
          Verwalten Sie Events, Artikel und Newsletter fur den PEPE Dome.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subscribers - Super Admin only */}
        {isAdmin && (
          <StatsCard
            icon={StatsIcons.subscribers}
            value={stats.subscribers.active}
            label="Active Subscribers"
            description={`${stats.subscribers.total} total subscribers`}
            variant="gold"
            href="/admin/subscribers"
          />
        )}

        {/* Events */}
        <StatsCard
          icon={StatsIcons.events}
          value={stats.events.upcoming}
          label="Upcoming Events"
          description={`${stats.events.total} total events`}
          href="/admin/events"
        />

        {/* Articles */}
        <StatsCard
          icon={StatsIcons.articles}
          value={stats.articles.published}
          label="Published Articles"
          description={`${stats.articles.total - stats.articles.published} drafts`}
          href="/admin/articles"
        />

        {/* Newsletters */}
        <StatsCard
          icon={StatsIcons.newsletters}
          value={stats.newsletters.sent}
          label="Sent Newsletters"
          description={openRate ? `${openRate}% avg. open rate` : 'No newsletters sent yet'}
          href="/admin/newsletters"
        />
      </div>

      {/* Quick Actions - Hidden from Viewer */}
      {canCreate && (
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4">
            Schnellaktionen
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/events/new">
              <Button variant="primary" size="md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Neues Event
              </Button>
            </Link>
            <Link href="/admin/articles/new">
              <Button variant="primary" size="md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Neuer Artikel
              </Button>
            </Link>
            <Link href="/admin/newsletters/new">
              <Button variant="secondary" size="md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Neuer Newsletter
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Letzte Events
            </h3>
            <Link href="/admin/events" className="text-sm text-[#016dca] hover:underline">
              Alle anzeigen
            </Link>
          </div>

          {stats.recentEvents.length === 0 ? (
            <p className="text-gray-400 text-sm">Keine Events vorhanden</p>
          ) : (
            <div className="space-y-3">
              {stats.recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}/edit`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString('de-DE')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {categoryLabels[event.category] || event.category}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn('text-xs border', statusColors[event.status])}
                  >
                    {event.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Articles */}
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Letzte Artikel
            </h3>
            <Link href="/admin/articles" className="text-sm text-[#016dca] hover:underline">
              Alle anzeigen
            </Link>
          </div>

          {stats.recentArticles.length === 0 ? (
            <p className="text-gray-400 text-sm">Keine Artikel vorhanden</p>
          ) : (
            <div className="space-y-3">
              {stats.recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}/edit`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {article.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn('text-xs border', statusColors[article.status])}
                  >
                    {article.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Stats - Super Admin only */}
      {isAdmin && stats.lastNewsletter && (
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Letzter Newsletter
            </h3>
            <Link href="/admin/newsletters" className="text-sm text-[#016dca] hover:underline">
              Alle anzeigen
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <p className="font-medium text-white">
                {stats.lastNewsletter.subject}
              </p>
              <p className="text-sm text-gray-400 mt-1">
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
              <div className="flex gap-6">
                <div>
                  <p className="text-2xl font-bold text-[#016dca]">
                    {stats.lastNewsletter.recipientCount.toLocaleString('de-DE')}
                  </p>
                  <p className="text-xs text-gray-400">Empfanger</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">
                    {stats.lastNewsletter.recipientCount > 0
                      ? ((stats.lastNewsletter.stats.uniqueOpenCount / stats.lastNewsletter.recipientCount) * 100).toFixed(1)
                      : '0'}%
                  </p>
                  <p className="text-xs text-gray-400">Offnungsrate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {stats.lastNewsletter.recipientCount > 0
                      ? ((stats.lastNewsletter.stats.uniqueClickCount / stats.lastNewsletter.recipientCount) * 100).toFixed(1)
                      : '0'}%
                  </p>
                  <p className="text-xs text-gray-400">Klickrate</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
