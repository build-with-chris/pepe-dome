import Link from 'next/link'
import Image from 'next/image'
import { NewsArticle } from '@/lib/data'
import { formatDate, getCategoryColor } from '@/lib/data'
import { cn } from '@/lib/utils'

interface NewsTeaserProps {
  article: NewsArticle
  featured?: boolean
  variant?: 'default' | 'compact'
}

export default function NewsTeaser({ article, featured = false, variant = 'default' }: NewsTeaserProps) {
  const categoryColor = getCategoryColor(article.category, 'news')

  if (variant === 'compact') {
    return (
      <Link href={`/news/${article.slug}`} className="group block">
        <article className="card card-interactive p-4">
          <div className="flex gap-4">
            {article.imageUrl && (
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-pepe-surface">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="96px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className={`badge mb-2 bg-${categoryColor}/10 text-${categoryColor} border-${categoryColor}/30`}>
                {article.category}
              </span>
              <h3 className="h5 mb-1 line-clamp-2 group-hover:text-pepe-gold transition-colors">
                {article.title}
              </h3>
              <p className="text-xs text-pepe-t64">
                {formatDate(article.publishedAt)}
              </p>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <article className={cn(
        'card card-interactive overflow-hidden',
        featured && 'bento-item-wide'
      )}>
        {article.imageUrl && (
          <div className={cn(
            'relative w-full overflow-hidden bg-pepe-surface',
            featured ? 'h-80' : 'h-48'
          )}>
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes={featured ? '(max-width: 768px) 100vw, 800px' : '(max-width: 768px) 100vw, 400px'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pepe-black via-transparent to-transparent opacity-60" />

            <span className={cn(
              'badge absolute top-4 left-4',
              `bg-${categoryColor}/20 text-${categoryColor} border-${categoryColor}/40 backdrop-blur-sm`
            )}>
              {article.category}
            </span>
          </div>
        )}

        <div className={cn('p-6', featured && 'p-8')}>
          <h3 className={cn(
            'font-display font-bold mb-3 group-hover:text-pepe-gold transition-colors',
            featured ? 'text-3xl' : 'text-xl'
          )}>
            {article.title}
          </h3>

          <p className={cn(
            'text-pepe-t64 mb-4',
            featured ? 'text-lg line-clamp-3' : 'text-base line-clamp-2'
          )}>
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between text-sm">
            <span className="text-pepe-t48">
              {article.author}
            </span>
            <span className="text-pepe-t48">
              {formatDate(article.publishedAt)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
