import { notFound } from 'next/navigation'
import { getAllNews, getNewsBySlug } from '@/lib/data'
import ArticleLayout from '@/components/news/ArticleLayout'

export async function generateStaticParams() {
  const news = getAllNews()
  return news.map((article) => ({
    slug: article.slug,
  }))
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getNewsBySlug(slug)

  if (!article) {
    notFound()
  }

  return <ArticleLayout article={article} />
}
