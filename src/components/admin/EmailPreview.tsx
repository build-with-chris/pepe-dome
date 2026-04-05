'use client'

/**
 * Admin Email Preview Component
 * Fetches rendered newsletter HTML and displays it via srcdoc (no iframe sandbox issues).
 * Pass refreshKey to trigger a re-fetch (e.g. after saving).
 */

import { useEffect, useState, useCallback } from 'react'

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

  const fetchPreview = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/admin/newsletters/${newsletterId}/preview?t=${Date.now()}&k=${refreshKey}`,
        { cache: 'no-store' }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      setHtml(text)
    } catch {
      setHtml('<p style="padding:2rem;color:#999;">Vorschau konnte nicht geladen werden.</p>')
    } finally {
      setLoading(false)
    }
  }, [newsletterId, refreshKey])

  useEffect(() => {
    fetchPreview()
  }, [fetchPreview])

  return (
    <div style={{ minHeight: '500px' }}>
      {loading ? (
        <div className="flex items-center justify-center h-full" style={{ minHeight: '500px' }}>
          <span className="text-white/40 text-sm">Vorschau wird geladen...</span>
        </div>
      ) : (
        <iframe
          srcDoc={html}
          title="E-Mail-Vorschau"
          className="w-full h-full border-none"
          style={{ minHeight: '500px' }}
          sandbox=""
        />
      )}
    </div>
  )
}
