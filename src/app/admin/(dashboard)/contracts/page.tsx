import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import { ladeStandardpreise } from '@/lib/vertraege/einstellungen'
import ContractsList from './ContractsList'
import StandardpreiseCard from './StandardpreiseCard'

/**
 * Verträge im Admin: Mietvereinbarungen und Angebote.
 *
 * Das Gate der Route-Group lässt auch Editor und Viewer durch. Verträge
 * enthalten Namen, Anschriften und Preise, deshalb kommt hier die
 * Einschränkung auf Super Admin dazu, wie bei den Freigaben. Die Daten selbst
 * schützt requireApiRole in den Routen unter /api/admin/contracts.
 */

export const dynamic = 'force-dynamic'

export default async function ContractsPage() {
  if ((await getUserRole()) !== ROLES.SUPER_ADMIN) {
    redirect('/admin')
  }

  const standardpreise = await ladeStandardpreise()

  return (
    <div className="space-y-10">
      <ContractsList />
      <StandardpreiseCard initial={standardpreise} />
    </div>
  )
}
