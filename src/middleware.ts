import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Routes that require authentication (exclude sign-in/sign-up)
const isProtectedRoute = createRouteMatcher([
  '/admin',
  '/admin/events(.*)',
  '/admin/articles(.*)',
  '/admin/newsletters(.*)',
  '/admin/subscribers(.*)',
])

// Set NEXT_PUBLIC_DISABLE_CLERK_IN_DEV=true in .env to browse the frontend without login (avoids JWKS errors)
// This only applies in development; in production Clerk is always enabled.
const skipClerkInDev =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_DISABLE_CLERK_IN_DEV === 'true'

export default skipClerkInDev
  ? function middleware() {
      return NextResponse.next()
    }
  : clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        const { userId } = await auth()
        if (!userId) {
          const signInUrl = new URL('/admin/sign-in', req.url)
          signInUrl.searchParams.set('redirect_url', req.url)
          return NextResponse.redirect(signInUrl)
        }
      }
    })

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
