import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'
import { LOCALES, DEFAULT_LOCALE, type Locale } from './i18n/config'

// Routes that require authentication (UI + API admin routes)
const isProtectedRoute = createRouteMatcher([
  '/admin',
  '/admin/events(.*)',
  '/admin/articles(.*)',
  '/admin/newsletters(.*)',
  '/admin/subscribers(.*)',
  '/api/admin(.*)',
])

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
 * Welche Pfade sollen unter /[lang]/... liegen?
 * Beim Migrieren einer neuen Seite hier ergänzen.
 */
const LOCALIZED_ROOT_PATHS: ReadonlySet<string> = new Set([
  '/',
  '/training',
])

/**
 * Wenn der User auf einen Pfad geht der bereits unter /[lang]/... liegt,
 * aber ohne Locale-Prefix — leiten wir auf die richtige Locale-URL um.
 */
function maybeRedirectToLocale(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl
  // Skip already-localized paths
  const firstSegment = pathname.split('/')[1]
  if ((LOCALES as readonly string[]).includes(firstSegment)) return null

  if (LOCALIZED_ROOT_PATHS.has(pathname)) {
    const locale = detectLocale(req)
    const url = req.nextUrl.clone()
    url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }
  return null
}

// ── Setup ───────────────────────────────────────────────────────────────

// Set NEXT_PUBLIC_DISABLE_CLERK_IN_DEV=true in .env to browse the frontend without login (avoids JWKS errors)
// This only applies in development; in production Clerk is always enabled.
const skipClerkInDev =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_DISABLE_CLERK_IN_DEV === 'true'

function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return response
}

export default skipClerkInDev
  ? function middleware(req: NextRequest) {
      const redirect = maybeRedirectToLocale(req)
      if (redirect) return redirect
      return applySecurityHeaders(NextResponse.next())
    }
  : clerkMiddleware(async (auth, req) => {
      // Locale-Redirect zuerst — vor Auth-Check, damit auch nicht-eingeloggte
      // User direkt auf die richtige Sprache landen
      const redirect = maybeRedirectToLocale(req)
      if (redirect) return redirect

      if (isProtectedRoute(req)) {
        const { userId } = await auth()
        if (!userId) {
          // API routes: return 401 instead of redirect
          if (req.nextUrl.pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
          }
          const signInUrl = new URL('/admin/sign-in', req.url)
          signInUrl.searchParams.set('redirect_url', req.url)
          return NextResponse.redirect(signInUrl)
        }
      }

      return applySecurityHeaders(NextResponse.next())
    })

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
