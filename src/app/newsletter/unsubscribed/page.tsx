import type { Metadata } from 'next'
import UnsubscribedContent from '@/components/newsletter/UnsubscribedContent'

export const metadata: Metadata = {
  title: 'Abgemeldet | Pepe Dome Newsletter',
  description: 'Du wurdest erfolgreich vom Newsletter abgemeldet.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NewsletterUnsubscribedPage() {
  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      <UnsubscribedContent />
    </div>
  )
}
