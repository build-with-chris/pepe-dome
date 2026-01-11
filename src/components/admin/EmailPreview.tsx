'use client'

/**
 * Admin Email Preview Component
 * Clean, simple preview of newsletter email - ONLY the email content
 * All UI (test send, buttons) is handled by parent component
 */

interface AdminEmailPreviewProps {
  newsletterId: string
}

export default function AdminEmailPreview({
  newsletterId,
}: AdminEmailPreviewProps) {
  return (
    <iframe
      src={`/api/admin/newsletters/${newsletterId}/preview`}
      title="E-Mail-Vorschau"
      className="w-full h-full border-none"
      style={{ minHeight: '500px' }}
      sandbox="allow-same-origin"
    />
  )
}
