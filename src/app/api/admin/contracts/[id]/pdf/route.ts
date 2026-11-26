/**
 * PDF eines Vertrags zum Herunterladen. Nur für `super_admin`.
 *
 * Gibt es einen Snapshot, wird genau der gezeichnet. Sonst entsteht das
 * Dokument frisch aus den Formularwerten und der Vorlage im Code.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { istDokument } from '@/lib/vertraege/dokument'
import { pdfAntwort } from '@/lib/vertraege/pdf'
import { dokumentAusZeile } from '@/lib/vertraege/vorlage'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  const { id } = await params
  const contract = await prisma.contract.findUnique({ where: { id } })
  if (!contract) {
    return NextResponse.json({ error: 'Vertrag nicht gefunden' }, { status: 404 })
  }

  try {
    const dokument = istDokument(contract.snapshot) ? contract.snapshot : dokumentAusZeile(contract)
    return await pdfAntwort(dokument)
  } catch (error) {
    console.error('PDF für Vertrag fehlgeschlagen:', error)
    return NextResponse.json(
      { error: 'Das PDF ließ sich nicht erzeugen. Bitte den Vertrag öffnen und speichern.' },
      { status: 500 }
    )
  }
}
