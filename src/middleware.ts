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

export default clerkMiddleware(async (auth, req) => {
  // Protect admin routes - redirect to sign-in if not authenticated
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
