/**
 * TEMPORARY debug endpoint - DELETE after role issue is resolved
 * GET /api/admin/debug-role
 */

import { currentUser } from '@clerk/nextjs/server'

export async function GET() {
  const user = await currentUser()

  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return Response.json({
    userId: user.id,
    email: user.emailAddresses?.[0]?.emailAddress,
    publicMetadata: user.publicMetadata,
    publicMetadataRole: user.publicMetadata?.role,
    roleType: typeof user.publicMetadata?.role,
    privateMetadata: '(hidden)',
  })
}
