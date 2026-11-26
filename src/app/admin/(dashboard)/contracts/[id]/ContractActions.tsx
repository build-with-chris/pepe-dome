'use client'

/**
 * Kopfzeile der Vertragsseite: Status umschalten und PDF herunterladen.
 *
 * Nach einem Statuswechsel lädt die Seite neu, damit das Formular darunter
 * gesperrt oder wieder freigegeben wird.
 */

import { useRouter } from 'next/navigation'
import ContractStatusSelect from '@/components/admin/ContractStatusSelect'
import { Button } from '@/components/ui/Button'
import type { Vertragsstatus } from '@/lib/vertraege/validation'

export default function ContractActions({
  contractId,
  status,
  titel,
}: {
  contractId: string
  status: Vertragsstatus
  titel: string
}) {
  const router = useRouter()

  return (
    <div className="flex flex-wrap items-start gap-3">
      <ContractStatusSelect
        contractId={contractId}
        status={status}
        titel={titel}
        onGeaendert={() => router.refresh()}
      />
      <a href={`/api/admin/contracts/${contractId}/pdf`}>
        <Button variant="secondary" size="sm">
          PDF herunterladen
        </Button>
      </a>
    </div>
  )
}
