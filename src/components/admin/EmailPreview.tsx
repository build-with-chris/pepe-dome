'use client'

/**
 * Admin Email Preview Component
 * Clean, simple preview of newsletter email - ONLY the email content
 * All UI (test send, buttons) is handled by parent component
 */

import { useSearchParams } from 'next/navigation'

interface AdminEmailPreviewProps {
  newsletterId: string
}

export default function AdminEmailPreview({
  newsletterId,
}: AdminEmailPreviewProps) {
  // Re-render iframe when the page is navigated to (e.g. after saving)
  const searchParams = useSearchParams()
  const cacheBuster = searchParams.toString() || Date.now()

  return (
    <iframe
      key={cacheBuster}
      src={`/api/admin/newsletters/${newsletterId}/preview?t=${cacheBuster}`}
      title="E-Mail-Vorschau"
      className="w-full h-full border-none"
      style={{ minHeight: '500px' }}
      sandbox="allow-same-origin"
    />
  )
}
