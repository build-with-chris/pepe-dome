import type { Metadata } from 'next'
import { Suspense } from 'react'
import ConfirmContent from '@/components/newsletter/ConfirmContent'

export const metadata: Metadata = {
  title: 'Anmeldung bestätigen | Pepe Dome Newsletter',
  description: 'Bestätige deine Anmeldung zum Pepe Dome Newsletter.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NewsletterConfirmPage() {
  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-[var(--pepe-gold)] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        }
      >
        <ConfirmContent />
      </Suspense>
    </div>
  )
}
