import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getNewsletterWithContent } from '@/lib/newsletters'
import { canEdit, canSendNewsletter, canTestSendNewsletter } from '@/lib/roles.server'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import NewsletterEditClient from './NewsletterEditClient'

/**
 * Edit Newsletter Page
 * Admin page for editing existing newsletters with preview and send options
 */

const statusColors: Record<string, string> = {
  DRAFT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  SCHEDULED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  SENDING: 'bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border-[var(--pepe-gold)]/30',
  SENT: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Entwurf',
  SCHEDULED: 'Geplant',
  SENDING: 'Wird gesendet',
  SENT: 'Gesendet',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditNewsletterPage({ params }: PageProps) {
  const { id } = await params

  // Check if user can edit (Editor+)
  const hasEditPermission = await canEdit()
  if (!hasEditPermission) {
    redirect('/admin')
  }

  // Get permission levels for send functionality
  const [canSend, canTestSend] = await Promise.all([
    canSendNewsletter(),
    canTestSendNewsletter(),
  ])

  // Fetch newsletter
  const newsletter = await getNewsletterWithContent(id)

  if (!newsletter) {
    notFound()
  }

  const canEditNewsletter = newsletter.status === 'DRAFT' || newsletter.status === 'SCHEDULED'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/newsletters"
            className="text-[var(--pepe-t64)] hover:text-[var(--pepe-white)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[var(--pepe-white)]">
                Newsletter bearbeiten
              </h2>
              <Badge
                variant="outline"
                className={cn('text-xs border', statusColors[newsletter.status])}
              >
                {statusLabels[newsletter.status] || newsletter.status}
              </Badge>
            </div>
            <p className="text-[var(--pepe-t64)] mt-1">
              {newsletter.subject}
            </p>
          </div>
        </div>
      </div>

      {/* Status Warning */}
      {newsletter.status === 'SENT' && (
        <div className="bg-[var(--pepe-warning)]/10 border border-[var(--pepe-warning)]/30 rounded-lg p-4">
          <p className="text-[var(--pepe-warning)]">
            Dieser Newsletter wurde bereits versendet und kann nicht mehr bearbeitet werden.
          </p>
        </div>
      )}

      {/* Edit Form */}
      <NewsletterEditClient
        newsletter={newsletter}
        canEdit={canEditNewsletter}
        canSend={canSend}
        canTestSend={canTestSend}
      />
    </div>
  )
}
