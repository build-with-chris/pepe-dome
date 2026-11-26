import Link from 'next/link'
import { redirect } from 'next/navigation'
import ContractForm from '@/components/admin/forms/ContractForm'
import { getUserRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { betraegeAus, VERTRAGSTYPEN, type Vertragstyp } from '@/lib/vertraege/validation'

export const dynamic = 'force-dynamic'

/**
 * Betragsfelder des zuletzt angelegten Vertrags je Typ. Gibt es noch keinen,
 * bleibt der Eintrag leer und das Formular startet ohne Beträge.
 */
async function ladeVorbelegung() {
  const vorbelegung: Partial<Record<Vertragstyp, Record<string, unknown>>> = {}
  for (const type of VERTRAGSTYPEN) {
    const letzter = await prisma.contract.findFirst({
      where: { type },
      orderBy: { createdAt: 'desc' },
      select: { data: true },
    })
    if (letzter) vorbelegung[type] = betraegeAus(type, letzter.data)
  }
  return vorbelegung
}

export default async function NewContractPage() {
  if ((await getUserRole()) !== ROLES.SUPER_ADMIN) {
    redirect('/admin')
  }

  const vorbelegung = await ladeVorbelegung()

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/contracts"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#016dca] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zurück zu Verträgen
        </Link>
        <h1 className="text-xl font-semibold text-white">Neuen Vertrag anlegen</h1>
        <p className="text-white/50 mt-1">
          Beträge sind aus dem letzten Vertrag desselben Typs vorbelegt. Nach dem Anlegen lässt
          sich das PDF herunterladen.
        </p>
      </div>

      <ContractForm mode="create" vorbelegung={vorbelegung} />
    </div>
  )
}
