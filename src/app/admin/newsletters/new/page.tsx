import Link from 'next/link'
import { redirect } from 'next/navigation'
import { canEdit } from '@/lib/roles.server'
import NewsletterCreateForm from './NewsletterCreateForm'

/**
 * Create New Newsletter Page
 * Admin page for creating new newsletters with content selection
 */

export default async function NewNewsletterPage() {
  // Check if user can edit (Editor+)
  const hasPermission = await canEdit()
  if (!hasPermission) {
    redirect('/admin')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/newsletters"
          className="text-[var(--pepe-t64)] hover:text-[var(--pepe-white)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[var(--pepe-white)]">Neuer Newsletter</h2>
          <p className="text-[var(--pepe-t64)] mt-1">
            Newsletter erstellen und Inhalte auswahlen
          </p>
        </div>
      </div>

      {/* Newsletter Form */}
      <NewsletterCreateForm />
    </div>
  )
}
