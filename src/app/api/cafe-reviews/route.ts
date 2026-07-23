import { NextRequest, NextResponse } from 'next/server'
import { getGoogleReviews } from '@/lib/google-reviews'

/**
 * GET /api/cafe-reviews?lang=de
 *
 * Liefert die Google-Bewertungen des Cafés zur Laufzeit (mit 1h-Cache).
 * Bewusst als API-Route statt Build-Zeit-Fetch: so greifen Konfigurations-
 * änderungen (Env-Variablen) sofort, ohne dass die statische Café-Seite
 * neu gebaut werden muss.
 */

// Route-Antwort 1h cachen; darunter cached getGoogleReviews den Places-Call.
export const revalidate = 3600

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get('lang') === 'en' ? 'en' : 'de'
  const result = await getGoogleReviews(lang)

  // Diagnose-Header (keine Secrets): zeigt, ob Konfiguration greift
  const configured = Boolean(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACES_ID)

  return NextResponse.json(
    {
      configured,
      rating: result?.rating ?? null,
      total: result?.total ?? null,
      reviews: result?.reviews ?? [],
    },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
  )
}
