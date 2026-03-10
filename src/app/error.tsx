'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[var(--pepe-black)] text-[var(--pepe-white)] p-8">
      <h1 className="text-2xl font-bold mb-4">Etwas ist schiefgelaufen</h1>
      <p className="text-[var(--pepe-t80)] mb-6 max-w-md text-center">
        {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-[var(--pepe-gold)] text-black font-medium hover:opacity-90"
        >
          Nochmal versuchen
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg border border-[var(--pepe-gold)] text-[var(--pepe-gold)] font-medium hover:bg-[var(--pepe-gold)]/10"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  )
}
