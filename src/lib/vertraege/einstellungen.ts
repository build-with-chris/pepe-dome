/**
 * Einstellungen des Vertragstools aus der Datenbank lesen. Nur für den Server.
 */

import prisma from '@/lib/prisma'
import {
  leseStandardpreise,
  STANDARDPREISE_SCHLUESSEL,
  type Standardpreise,
} from './validation'

/** Standardpreise für halben und ganzen Tag. Nicht gepflegte Werte sind null. */
export async function ladeStandardpreise(): Promise<Standardpreise> {
  const zeile = await prisma.contractSetting.findUnique({
    where: { key: STANDARDPREISE_SCHLUESSEL },
  })
  return leseStandardpreise(zeile?.value)
}
