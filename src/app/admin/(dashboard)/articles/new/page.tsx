import Link from 'next/link'
import ArticleForm from '@/components/admin/forms/ArticleForm'
import { canEdit } from '@/lib/roles.server'
import { redirect } from 'next/navigation'

/**
 * Create Article Page
 *
 * Features:
 * - ArticleForm component for creating new articles
 * - Role check (Editor+ required)
 */

export default async function NewArticlePage() {
  // Check permissions
  const hasPermission = await canEdit()
  if (!hasPermission) {
    redirect('/admin/articles')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#016dca] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zurück zu Artikel
        </Link>
        <h1 className="text-xl font-semibold text-white">Neuen Artikel erstellen</h1>
        <p className="text-white/50 mt-1">
          Erstellen Sie einen neuen Artikel für den PEPE Dome.
        </p>
      </div>

      {/* Form */}
      <ArticleForm mode="create" />
    </div>
  )
}
