'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="de">
      <body style={{ margin: 0, fontFamily: 'system-ui', background: '#0a0a0a', color: '#fff', padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Fehler beim Laden</h1>
        <p style={{ color: '#999', marginBottom: '1.5rem', maxWidth: '28rem', textAlign: 'center' }}>
          {error.message || 'Ein schwerwiegender Fehler ist aufgetreten.'}
        </p>
        <button
          type="button"
          onClick={reset}
          style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#c9a227', color: '#000', fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          Nochmal versuchen
        </button>
      </body>
    </html>
  )
}
