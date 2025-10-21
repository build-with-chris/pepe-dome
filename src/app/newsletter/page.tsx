import Link from 'next/link'
import { getAllNewsletters, getNewsletterContent } from '@/lib/data'
import NewsletterSignup from '@/components/newsletter/NewsletterSignup'
import Card from '@/components/ui/Card'

export default function NewsletterPage() {
  const newsletters = getAllNewsletters()
  const content = getNewsletterContent()

  return (
    <div className="section">
      <div className="stage-container">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="display-1 mb-4">Newsletter</h1>
          <p className="lead text-pepe-t80 max-w-2xl mx-auto">
            {content.signup.description}
          </p>
        </header>

        {/* Signup Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <NewsletterSignup />
        </div>

        {/* Archive */}
        <div className="mb-12">
          <h2 className="h2 mb-2">{content.archive.title}</h2>
          <p className="text-pepe-t64">{content.archive.description}</p>
        </div>

        {/* Newsletter Archive Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsletters.map(newsletter => (
            <Link key={newsletter.id} href={`/newsletter/${newsletter.id}`} className="group">
              <Card variant="interactive" className="p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="badge bg-pepe-gold/20 text-pepe-gold border-pepe-gold/40">
                    {new Date(newsletter.publishedAt).toLocaleDateString('de-DE', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                  {newsletter.sentAt && (
                    <span className="text-xs text-pepe-t48">
                      Versendet
                    </span>
                  )}
                </div>

                <h3 className="h4 mb-3 group-hover:text-pepe-gold transition-colors">
                  {newsletter.title}
                </h3>

                <p className="text-pepe-t64 text-sm mb-4 line-clamp-2">
                  {newsletter.intro}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-pepe-t48">
                    {newsletter.events.length} Events
                  </span>
                  {newsletter.sentCount && (
                    <span className="text-pepe-t48">
                      {newsletter.sentCount} Empfänger
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
