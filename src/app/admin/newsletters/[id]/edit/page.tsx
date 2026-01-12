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
  SENDING: 'bg-[#016dca]/20 text-[#016dca] border-[#016dca]/30',
  SENT: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/newsletters"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#016dca] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zurück zu Newsletter
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-white truncate">
            {newsletter.subject}
          </h1>
          <Badge
            variant="outline"
            className={cn('text-[10px] border flex-shrink-0', statusColors[newsletter.status])}
          >
            {statusLabels[newsletter.status] || newsletter.status}
          </Badge>
        </div>
      </div>

      {/* Status Warning */}
      {newsletter.status === 'SENT' && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
          <p className="text-xs text-amber-400">
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
