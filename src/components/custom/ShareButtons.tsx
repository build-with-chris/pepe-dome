'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  url?: string
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'noopener,noreferrer')
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        className="flex-1 px-4 py-2 rounded-lg bg-[var(--pepe-surface)] text-[var(--pepe-t80)] text-sm hover:bg-[var(--pepe-line)] transition-colors"
        onClick={handleTwitterShare}
        aria-label="Auf Twitter teilen"
      >
        Twitter
      </button>
      <button
        type="button"
        className="flex-1 px-4 py-2 rounded-lg bg-[var(--pepe-surface)] text-[var(--pepe-t80)] text-sm hover:bg-[var(--pepe-line)] transition-colors"
        onClick={handleFacebookShare}
        aria-label="Auf Facebook teilen"
      >
        Facebook
      </button>
      <button
        type="button"
        className="flex-1 px-4 py-2 rounded-lg bg-[var(--pepe-surface)] text-[var(--pepe-t80)] text-sm hover:bg-[var(--pepe-line)] transition-colors"
        onClick={handleCopyLink}
        aria-label="Link kopieren"
      >
        {copied ? 'Kopiert!' : 'Link'}
      </button>
    </div>
  )
}
