/**
 * Google-Reviews (Places API New / v1)
 *
 * Holt die aktuellen Google-Bewertungen für das Café und gibt sie
 * normalisiert zurück. Serverseitig genutzt (Café-Seite), mit 1h-Cache.
 *
 * Konfiguration über Env:
 *   GOOGLE_PLACES_API_KEY  — API-Key mit aktivierter "Places API (New)"
 *   GOOGLE_PLACES_ID       — Place-ID des Cafés (Format: ChIJ...)
 *
 * Ohne diese beiden Werte liefert die Funktion null — die aufrufende
 * Seite fällt dann auf manuell gepflegte Reviews (Dictionary) zurück.
 * Google liefert über die API max. 5 Reviews; wir sortieren nach Datum,
 * damit die neuesten zuerst erscheinen.
 */

export type GoogleReview = {
  author: string
  text: string
  rating: number
  relativeTime: string
  profilePhoto?: string
  publishTime?: string
}

export type GoogleReviewsResult = {
  rating: number | null
  total: number | null
  reviews: GoogleReview[]
}

type PlacesReview = {
  rating?: number
  text?: { text?: string }
  originalText?: { text?: string }
  relativePublishTimeDescription?: string
  publishTime?: string
  authorAttribution?: { displayName?: string; photoUri?: string }
}

export async function getGoogleReviews(
  languageCode: 'de' | 'en' = 'de'
): Promise<GoogleReviewsResult | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACES_ID
  if (!apiKey || !placeId) {
    console.warn('[google-reviews] nicht konfiguriert', {
      hasKey: Boolean(apiKey),
      hasPlaceId: Boolean(placeId),
    })
    return null
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=${languageCode}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
        },
        // Reviews eine Stunde cachen — kein Live-Call bei jedem Seitenaufruf
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) {
      console.error('[google-reviews] Places API error:', res.status, await res.text())
      return null
    }

    const data = (await res.json()) as {
      rating?: number
      userRatingCount?: number
      reviews?: PlacesReview[]
    }

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName?.trim() || 'Google-Gast',
        text: (r.text?.text || r.originalText?.text || '').trim(),
        rating: r.rating ?? 5,
        relativeTime: r.relativePublishTimeDescription || '',
        profilePhoto: r.authorAttribution?.photoUri,
        publishTime: r.publishTime,
      }))
      .filter((r) => r.text.length > 0)
      .sort((a, b) => (b.publishTime || '').localeCompare(a.publishTime || ''))

    return {
      rating: data.rating ?? null,
      total: data.userRatingCount ?? null,
      reviews,
    }
  } catch (error) {
    console.error('[google-reviews] fetch failed:', error)
    return null
  }
}
