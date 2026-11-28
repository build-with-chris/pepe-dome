/**
 * PDF-Probe: zeichnet ein festes Testdokument mit jedem Baustein.
 *
 * Die Route beantwortet eine einzige Frage: Läuft die PDF-Bibliothek in dieser
 * Umgebung? Sie braucht keine Datenbank und keine Vertragsdaten. Gedacht für
 * den ersten Aufruf auf einem Vercel-Preview und für später, wenn die
 * Bibliothek oder Next ein Update bekommt.
 */

import { NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import { fett, linie, type Dokument } from '@/lib/vertraege/dokument'
import { pdfAntwort } from '@/lib/vertraege/pdf'

export const dynamic = 'force-dynamic'

const PROBE: Dokument = {
  titel: 'PDF-Probe Vertragstool',
  akzent: true,
  bausteine: [
    { art: 'kopf', titel: 'PDF-Probe', untertitel: 'Testdokument, kein Vertrag', logo: true },
    {
      art: 'absatz',
      text: [
        'Umlaute und Sonderzeichen: ä ö ü Ä Ö Ü ß, „Anführungszeichen“, ',
        fett('fett gesetzt'),
        ', Eurozeichen: 12,50 €.',
      ],
    },
    { art: 'ueberschrift', text: '1. Liste' },
    {
      art: 'liste',
      punkte: ['Erster Punkt mit Größenangabe.', [fett('Zweiter Punkt'), ' mit Hervorhebung.']],
    },
    { art: 'ueberschrift', text: '2. Tabelle' },
    {
      art: 'tabelle',
      linien: true,
      rechts: true,
      betont: [1],
      breiten: [72, 28],
      zeilen: [
        ['Beispielzeile regulär', [{ text: '99 €', durchgestrichen: true }]],
        [fett('Beispielzeile hervorgehoben'), fett('77 €')],
        ['Beispielzeile Text', 'nach Verbrauch'],
      ],
    },
    { art: 'ueberschrift', text: '3. Hinweisbox' },
    { art: 'hinweis', text: 'Dieser Kasten hebt eine Regel hervor. Über mehrere Zeilen bleibt er zusammen.' },
    { art: 'ueberschrift', text: '4. Zum Ausfüllen' },
    { art: 'ausfuellen', teile: ['Name:', linie(3), 'Telefon:', linie(2)] },
    {
      art: 'gruppe',
      bausteine: [
        { art: 'ueberschrift', text: 'Unterschriften' },
        { art: 'unterschriften', felder: [['Ort, Datum\nPepe Dome', 'Ort, Datum\nGegenseite']] },
      ],
    },
  ],
}

export async function GET() {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  try {
    return await pdfAntwort(PROBE)
  } catch (error) {
    console.error('PDF-Probe fehlgeschlagen:', error)
    // Der Sinn der Probe ist die Diagnose, also die Ursache im Klartext.
    return NextResponse.json(
      {
        error: 'Die PDF-Probe ist fehlgeschlagen.',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
