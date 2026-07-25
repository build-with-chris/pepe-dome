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
        <h1 className="text-xl font-semibold text-white">Neuer Newsletter</h1>
        <p className="text-white/50 mt-1">
          Newsletter erstellen und Inhalte auswählen
        </p>
      </div>

      {/* Newsletter Form */}
      <NewsletterCreateForm />
    </div>
  )
}
