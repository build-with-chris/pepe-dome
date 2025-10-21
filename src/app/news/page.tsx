import { getAllNews, getCategories } from '@/lib/data'
import NewsTeaser from '@/components/news/NewsTeaser'

export default function NewsPage() {
  const allNews = getAllNews()
  const categories = getCategories().news

  return (
    <div className="section">
      <div className="stage-container">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="display-1 mb-4">News & Magazin</h1>
          <p className="lead text-pepe-t80 max-w-2xl mx-auto">
            Aktuelles aus dem Pepe Dome - Shows, Events, Hintergründe und mehr
          </p>
        </header>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          <button className="badge bg-pepe-gold text-pepe-black border-pepe-gold">
            Alle
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`badge bg-${cat.color}/10 text-${cat.color} border-${cat.color}/30 hover:bg-${cat.color}/20 transition-colors`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="bento-grid-3">
          {allNews.map(article => (
            <NewsTeaser key={article.id} article={article} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn btn-secondary btn-lg" disabled>
            Weitere Artikel laden
          </button>
        </div>
      </div>
    </div>
  )
}
