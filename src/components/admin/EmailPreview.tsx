'use client'

/**
 * Admin Email Preview Component
 * Fetches rendered newsletter HTML and displays it via srcdoc (no iframe sandbox issues).
 * Pass refreshKey to trigger a re-fetch (e.g. after saving).
 */

import { useEffect, useState } from 'react'

interface AdminEmailPreviewProps {
  newsletterId: string
  /** Increment to trigger a preview refresh */
  refreshKey?: number
}

export default function AdminEmailPreview({
  newsletterId,
  refreshKey = 0,
}: AdminEmailPreviewProps) {
  const [html, setHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetch(`/api/admin/newsletters/${newsletterId}/preview?t=${Date.now()}`)
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) {
          setHtml(text)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHtml('<p style="padding:2rem;color:#999;">Vorschau konnte nicht geladen werden.</p>')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [newsletterId, refreshKey])

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '500px' }}>
        <span className="text-white/40 text-sm">Vorschau wird geladen...</span>
      </div>
    )
  }

  return (
    <iframe
      srcDoc={html}
      title="E-Mail-Vorschau"
      className="w-full h-full border-none"
      style={{ minHeight: '500px' }}
      sandbox=""
    />
  )
}
