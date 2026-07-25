import 'server-only'

/**
 * Wer darf einen Newsletter in welchem Zustand noch verändern?
 *
 * Der Anlass ist eine Rechteausweitung, die sich aus zwei für sich harmlosen
 * Regeln ergab: Ein Editor darf Inhalte bearbeiten, aber nicht versenden. Der
 * Versand eines terminierten Newsletters läuft jedoch über den Cron, ohne dass
 * noch jemand hinsieht.
 *
 * Ein Super Admin terminiert also eine Ausgabe, ein Editor schreibt danach den
 * Inhalt um, und der Cron schickt den neuen Text an alle echten Abonnenten.
 * Der Editor hat damit erreicht, was ihm ausdrücklich verwehrt ist: an den
 * gesamten Verteiler zu senden.
 *
 * Deshalb: Sobald eine Ausgabe terminiert ist oder gerade verschickt wird,
 * darf nur noch ein Super Admin sie anfassen. Versendete Ausgaben sind für
 * alle zu.
 */

import { NextResponse } from 'next/server'
import { prisma } from './prisma'
import { ROLES, type UserRole } from './roles'

export async function guardNewsletterMutation(
  newsletterId: string,
  role: UserRole
): Promise<NextResponse | null> {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
    select: { status: true },
  })

  if (!newsletter) {
    return NextResponse.json(
      { error: 'NOT_FOUND', message: 'Newsletter nicht gefunden.' },
      { status: 404 }
    )
  }

  if (newsletter.status === 'SENT') {
    return NextResponse.json(
      {
        error: 'CANNOT_EDIT_SENT',
        message: 'Eine bereits versendete Ausgabe lässt sich nicht mehr ändern.',
      },
      { status: 403 }
    )
  }

  const istInVersandnaehe =
    newsletter.status === 'SCHEDULED' || newsletter.status === 'SENDING'

  if (istInVersandnaehe && role !== ROLES.SUPER_ADMIN) {
    return NextResponse.json(
      {
        error: 'NEWSLETTER_LOCKED',
        message:
          'Diese Ausgabe ist für den Versand vorgemerkt. Änderungen daran kann nur ein Super Admin vornehmen. Nimm sie zuerst aus der Planung, wenn du weiterarbeiten willst.',
      },
      { status: 403 }
    )
  }

  return null
}
