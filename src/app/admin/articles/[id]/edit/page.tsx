import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ArticleForm from '@/components/admin/forms/ArticleForm'
import { canEdit } from '@/lib/roles.server'

/**
 * Edit Article Page
 *
 * Features:
 * - Load existing article data
 * - ArticleForm component pre-filled with article data
 * - Role check (Editor+ required)
 */

interface PageProps {
  params: Promise<{ id: string }>
}

async function getArticle(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
  })

  if (!article) return null

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    author: article.author,
    imageUrl: article.imageUrl,
    tags: (article.tags as string[]) || [],
    featured: article.featured,
    status: article.status,
  }
}

export default async function EditArticlePage({ params }: PageProps) {
  // Check permissions
  const hasPermission = await canEdit()
  if (!hasPermission) {
    redirect('/admin/articles')
  }

  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-sm text-[var(--pepe-t64)] hover:text-[var(--pepe-gold)] mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zuruck zu Artikel
        </Link>
        <h2 className="text-2xl font-bold text-[var(--pepe-white)]">Artikel bearbeiten</h2>
        <p className="text-[var(--pepe-t64)] mt-1">
          Bearbeiten Sie den Artikel &quot;{article.title}&quot;.
        </p>
      </div>

      {/* Form */}
      <ArticleForm article={article} mode="edit" />
    </div>
  )
}
