import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { isSuperAdmin } from '@/lib/roles.server'
import TestRecipientsClient from './TestRecipientsClient'

/**
 * Test Recipients Admin Page
 *
 * Manage email addresses used for testing newsletter sending
 */

async function getTestRecipients() {
  return prisma.testRecipient.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function TestRecipientsAdminPage() {
  const isAdmin = await isSuperAdmin()
  if (!isAdmin) {
    redirect('/admin')
  }

  const testRecipients = await getTestRecipients()

  const serializedRecipients = testRecipients.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-white">Test-Empfänger</h1>
        <p className="text-white/50 mt-1">
          E-Mail-Adressen für Newsletter-Tests verwalten
        </p>
      </div>

      <TestRecipientsClient initialRecipients={serializedRecipients} />
    </div>
  )
}
