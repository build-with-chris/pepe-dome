import Image from 'next/image'
import Link from 'next/link'
import { NewsArticle, formatDate, getCategoryColor, getRecentNews } from '@/lib/data'
import { getReadingTime } from '@/lib/utils'
import NewsTeaser from './NewsTeaser'

interface ArticleLayoutProps {
  article: NewsArticle
}

export default function ArticleLayout({ article }: ArticleLayoutProps) {
  const categoryColor = getCategoryColor(article.category, 'news')
  const readingTime = getReadingTime(article.content)
  const relatedArticles = getRecentNews(4).filter(a => a.id !== article.id).slice(0, 3)

  return (
    <div className="section">
      <div className="stage-container">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-pepe-t64 mb-8">
          <Link href="/" className="hover:text-pepe-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/news" className="hover:text-pepe-white transition-colors">
            News
          </Link>
          <span>/</span>
          <span className="text-pepe-white">{article.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          {/* Main Article */}
          <article>
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`badge bg-${categoryColor}/20 text-${categoryColor} border-${categoryColor}/40`}>
                  {article.category}
                </span>
                <span className="text-sm text-pepe-t64">
                  {readingTime} Min. Lesezeit
                </span>
              </div>

              <h1 className="display-1 mb-4">{article.title}</h1>

              <p className="lead text-pepe-t80 mb-6">
                {article.excerpt}
              </p>

              <div className="flex items-center gap-6 text-sm text-pepe-t64 border-b border-pepe-line pb-6">
                <div>
                  <span className="text-pepe-t48">Von </span>
                  <span className="text-pepe-white font-medium">{article.author}</span>
                </div>
                <div>
                  {formatDate(article.publishedAt)}
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden bg-pepe-surface">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="body-lg mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-pepe-line">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="badge bg-pepe-surface text-pepe-t64 border-pepe-line">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="card p-6">
                <h3 className="h4 mb-6">Weitere Artikel</h3>
                <div className="space-y-4">
                  {relatedArticles.map(article => (
                    <NewsTeaser key={article.id} article={article} variant="compact" />
                  ))}
                </div>
                <Link
                  href="/news"
                  className="btn btn-secondary btn-sm w-full mt-6"
                >
                  Alle News anzeigen
                </Link>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="card p-6 bg-gradient-to-br from-pepe-gold/10 to-pepe-bronze/5 border-pepe-gold/20">
              <h3 className="h4 mb-3">Newsletter</h3>
              <p className="body-sm text-pepe-t64 mb-4">
                Verpasse keine News mehr! Abonniere unseren Newsletter.
              </p>
              <Link href="/newsletter" className="btn btn-primary btn-sm w-full">
                Jetzt anmelden
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
