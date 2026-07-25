'use client'

/**
 * Meldet den Aufruf einer Eventdetailseite als ViewContent.
 *
 * Das ist die Grundlage für Retargeting: Wer sich eine konkrete Show
 * angesehen hat, ist warmes Publikum. Retargeting kostet im Kulturbereich
 * geschätzt 4 bis 12 Euro pro Abschluss gegenüber 12 bis 35 Euro im
 * Kaltpublikum. Ohne dieses Ereignis gibt es diese Zielgruppe nicht.
 *
 * Rendert nichts. Gehört in Server-Components, die selbst kein useEffect
 * benutzen können.
 */

import { useEffect } from 'react'
import { trackViewContent } from '@/lib/tracking'

interface EventViewTrackerProps {
  title: string
  slug?: string
  category?: string
}

export default function EventViewTracker({ title, slug, category }: EventViewTrackerProps) {
  useEffect(() => {
    trackViewContent({
      contentName: title,
      contentId: slug,
      contentCategory: category,
    })
  }, [title, slug, category])

  return null
}
