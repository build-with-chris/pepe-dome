import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import type { Contract } from '@prisma/client'
import ContractForm from '@/components/admin/forms/ContractForm'
import { getUserRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { TYP_LABEL } from '@/lib/vertraege/validation'
import { datumAlsEingabe } from '@/lib/vertraege/vorlage'
import ContractActions from './ContractActions'

export const dynamic = 'force-dynamic'

export default async function ContractPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  if ((await getUserRole()) !== ROLES.SUPER_ADMIN) {
    redirect('/admin')
  }

  const { id } = await params
  // Siehe src/lib/db-courses.ts: der exportierte prisma-Client ist als `any` typisiert.
  const contract = (await prisma.contract.findUnique({ where: { id } })) as Contract | null
  if (!contract) notFound()

  const gesperrt = contract.status !== 'ENTWURF'

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">{contract.title}</h1>
            <p className="text-white/50 mt-1">
              {TYP_LABEL[contract.type]}
              {contract.sentAt
                ? `, eingefroren am ${contract.sentAt.toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    timeZone: 'Europe/Berlin',
                  })}`
                : ''}
            </p>
          </div>
          <ContractActions contractId={contract.id} status={contract.status} titel={contract.title} />
        </div>
      </div>

      <ContractForm
        // Nach einem Statuswechsel neu aufbauen, damit das Formular den
        // gespeicherten Stand zeigt und nicht eine alte Eingabe.
        key={`${contract.id}-${contract.status}`}
        mode="edit"
        gesperrt={gesperrt}
        vertrag={{
          id: contract.id,
          type: contract.type,
          partnerName: contract.partnerName,
          partnerEmail: contract.partnerEmail,
          partnerPhone: contract.partnerPhone,
          partnerAddress: contract.partnerAddress,
          eventDate: datumAlsEingabe(contract.eventDate),
          data: contract.data,
        }}
      />
    </div>
  )
}
