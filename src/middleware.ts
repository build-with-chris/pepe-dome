import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'
import { LOCALES, DEFAULT_LOCALE, matchLocalizedPath, type Locale } from './i18n/config'
import { requiresAuth } from './lib/admin-routes'

// ── i18n helpers ────────────────────────────────────────────────────────

/** Reads the preferred locale from `Accept-Language`, falls back to default. */
function detectLocale(req: NextRequest): Locale {
  const header = req.headers.get('accept-language') || ''
  for (const part of header.split(',')) {
    const tag = part.split(';')[0].trim().toLowerCase()
    if (tag.startsWith('de')) return 'de'
    if (tag.startsWith('en')) return 'en'
  }
  return DEFAULT_LOCALE
}

/**
 * Wenn der User auf einen Pfad geht der bereits unter /[lang]/... liegt,
 * aber ohne Locale-Prefix — leiten wir auf die richtige Locale-URL um.
 *
 * Welche Pfade das sind, steht ausschliesslich in LOCALIZED_PATHS
 * (src/i18n/config.ts). Diese Datei hatte die Liste früher ein zweites Mal,
 * und die zwei Fassungen waren nicht deckungsgleich — `/cafe` und `/spenden`
 * fehlten hier und liefen deshalb in einen 404 statt in die Weiterleitung.
 */
function maybeRedirectToLocale(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl
  // Skip already-localized paths
  const firstSegment = pathname.split('/')[1]
  if ((LOCALES as readonly string[]).includes(firstSegment)) return null

  if (matchLocalizedPath(pathname) !== null) {
    const locale = detectLocale(req)
    const url = req.nextUrl.clone()
    url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }
  return null
}

/**
 * Locale aus dem URL-Prefix, für den Durchlauf ans Root-Layout.
 *
 * Das Root-Layout rendert <html> und kann den [lang]-Parameter nicht sehen. Damit
 * `<html lang>` schon serverseitig stimmt (wichtig für KI-Crawler ohne JS auf
 * /en-Seiten), reicht die Middleware die erkannte Locale als Request-Header durch.
 */
function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/')[1]
  return (LOCALES as readonly string[]).includes(first) ? (first as Locale) : DEFAULT_LOCALE
}

/** Durchgereichte Antwort mit x-locale-Header für das Root-Layout. */
function passThrough(req: NextRequest): NextResponse {
  const headers = new Headers(req.headers)
  headers.set('x-locale', localeFromPath(req.nextUrl.pathname))
  return NextResponse.next({ request: { headers } })
}

// ── Setup ───────────────────────────────────────────────────────────────

// Set NEXT_PUBLIC_DISABLE_CLERK_IN_DEV=true in .env to browse the frontend without login (avoids JWKS errors)
// This only applies in development; in production Clerk is always enabled.
const skipClerkInDev =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_DISABLE_CLERK_IN_DEV === 'true'

/**
 * Content-Security-Policy — bewusst ohne script-src.
 *
 * Eine Einschränkung von script-src wäre der stärkste Schutz, bräuchte aber
 * Nonces für die Inline-Skripte von Next selbst plus eine vollständige Liste
 * aller Fremdquellen (Clerk, Analytics, eingebettete Inhalte). Ein Fehler darin
 * legt die Seite still lahm: Skripte werden blockiert, die Seite bleibt weiß.
 * Das gehört einmal im Report-Only-Modus beobachtet, bevor es scharf geschaltet
 * wird — Anleitung dazu in SECURITY.md.
 *
 * Die Direktiven hier schränken kein einziges Skript ein und können deshalb
 * nichts kaputtmachen, blockieren aber echte Angriffswege:
 *
 *   base-uri     Ohne das kann ein eingeschleustes <base href="//evil.tld">
 *                sämtliche relativen Skriptpfade der Seite umbiegen. Aus einer
 *                kleinen HTML-Injection wird so die Übernahme der ganzen Seite.
 *   form-action  Verhindert, dass ein eingeschleustes Formular Eingaben an
 *                einen fremden Server schickt.
 *   object-src   <object> und <embed> sind ein alter, immer noch funktionierender
 *                Weg, aktive Inhalte einzubetten. Hier braucht sie niemand.
 *   frame-ancestors  Der moderne Ersatz für X-Frame-Options gegen Clickjacking.
 *                X-Frame-Options bleibt zusätzlich stehen, für ältere Browser.
 */
const CONTENT_SECURITY_POLICY = [
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ')

function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY)

  // HSTS: Der Browser merkt sich für ein Jahr, diese Domain nur noch über
  // HTTPS aufzurufen. Das schliesst das Zeitfenster beim allerersten Aufruf
  // über http://, in dem ein Angreifer im selben Netz die Verbindung umbiegen
  // kann, bevor die Weiterleitung auf HTTPS greift.
  //
  // Bewusst ohne "preload": Ein Preload-Eintrag ist in Browsern fest verdrahtet
  // und nur über Monate wieder loszuwerden. Diese Entscheidung soll bewusst
  // fallen, nicht als Nebenwirkung eines Sicherheitsupdates.
  //
  // Nur in Produktion — sonst zwingt der Browser auch localhost auf HTTPS und
  // die lokale Entwicklung wird unbenutzbar.
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    )
  }

  return response
}

/**
 * Jede Antwort geht durch applySecurityHeaders, auch die vorzeitigen.
 *
 * Vorher trugen nur die durchgereichten Antworten die Header. Locale-Redirects
 * und der Sign-in-Redirect gingen ohne CSP und ohne HSTS hinaus — also
 * ausgerechnet die allererste Antwort, die ein Besucher bekommt. Genau dort
 * ist HSTS am wichtigsten, weil es das Zeitfenster vor dem Wechsel auf HTTPS
 * schliesst.
 */
export default skipClerkInDev
  ? function middleware(req: NextRequest) {
      const redirect = maybeRedirectToLocale(req)
      if (redirect) return applySecurityHeaders(redirect)
      return applySecurityHeaders(passThrough(req))
    }
  : clerkMiddleware(async (auth, req) => {
      // Locale-Redirect zuerst — vor Auth-Check, damit auch nicht-eingeloggte
      // User direkt auf die richtige Sprache landen
      const redirect = maybeRedirectToLocale(req)
      if (redirect) return applySecurityHeaders(redirect)

      if (requiresAuth(req)) {
        const { userId } = await auth()
        if (!userId) {
          // API routes: return 401 instead of redirect
          if (req.nextUrl.pathname.startsWith('/api/')) {
            return applySecurityHeaders(
              NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            )
          }
          const signInUrl = new URL('/admin/sign-in', req.url)
          signInUrl.searchParams.set('redirect_url', req.url)
          return applySecurityHeaders(NextResponse.redirect(signInUrl))
        }
      }

      return applySecurityHeaders(passThrough(req))
    })

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
