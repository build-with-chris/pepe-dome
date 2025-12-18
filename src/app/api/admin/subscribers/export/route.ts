/**
 * Export Subscribers as CSV
 * GET /api/admin/subscribers/export
 *
 * Exports all or filtered subscribers to CSV format
 * Requires Super Admin role
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isSuperAdmin } from '@/lib/roles.server'

export async function GET(request: NextRequest) {
  try {
    // Check Super Admin permission
    const isAdmin = await isSuperAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Keine Berechtigung' } },
        { status: 403 }
      )
    }

    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    // Build where clause
    const where: Record<string, unknown> = {}
    if (status) {
      where.status = status
    }

    // Fetch subscribers
    const subscribers = await prisma.subscriber.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        email: true,
        firstName: true,
        status: true,
        interests: true,
        confirmedAt: true,
        unsubscribedAt: true,
        createdAt: true,
        lastOpenAt: true,
        lastClickAt: true,
      },
    })

    // Generate CSV headers
    const headers = [
      'E-Mail',
      'Vorname',
      'Status',
      'Interessen',
      'Bestatigt am',
      'Abgemeldet am',
      'Registriert am',
      'Letzte Offnung',
      'Letzter Klick',
    ]

    // Generate CSV rows
    const rows = subscribers.map((subscriber) => {
      const interests = Array.isArray(subscriber.interests)
        ? (subscriber.interests as string[]).join('; ')
        : ''

      return [
        subscriber.email,
        subscriber.firstName || '',
        subscriber.status,
        interests,
        subscriber.confirmedAt
          ? new Date(subscriber.confirmedAt).toISOString()
          : '',
        subscriber.unsubscribedAt
          ? new Date(subscriber.unsubscribedAt).toISOString()
          : '',
        new Date(subscriber.createdAt).toISOString(),
        subscriber.lastOpenAt
          ? new Date(subscriber.lastOpenAt).toISOString()
          : '',
        subscriber.lastClickAt
          ? new Date(subscriber.lastClickAt).toISOString()
          : '',
      ]
    })

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n')

    // Add BOM for Excel UTF-8 compatibility
    const bom = '\uFEFF'

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `subscribers-${status || 'all'}-${timestamp}.csv`

    // Return CSV response
    return new NextResponse(bom + csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Export subscribers error:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Fehler beim Exportieren der Subscribers',
        },
      },
      { status: 500 }
    )
  }
}
