/**
 * Zeichnet eine Bausteinliste als A4-PDF.
 *
 * Diese Datei kennt keine Vertragsinhalte. Sie weiß, wie eine Überschrift,
 * eine Tabelle oder ein Unterschriftsfeld aussieht, aber nicht, was drinsteht.
 * Texte und Reihenfolge kommen aus den Vorlagen (vorlage-*.ts) oder aus einem
 * eingefrorenen Snapshot.
 *
 * Schrift ist Inter, als Datei eingebettet (fonts/, SIL Open Font License).
 * Die in jedem PDF eingebaute Helvetica wäre ohne Datei ausgekommen, aber die
 * Bibliothek vermisst bei ihr das Eurozeichen und die deutschen
 * Anführungszeichen falsch: „120 € pauschal“ wurde zu „120 €pauschal“. Mit
 * eingebetteter Schrift sieht das PDF außerdem in jedem Betrachter gleich aus.
 *
 * Schrift und Logo werden zur Laufzeit von der Platte gelesen. Damit sie auf
 * Vercel neben der Funktion liegen, stehen beide in `outputFileTracingIncludes`
 * (next.config.ts).
 *
 * Läuft nur auf dem Server. `@react-pdf/renderer` steht dafür in
 * `serverExternalPackages` (next.config.ts).
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from '@react-pdf/renderer'
import type { Baustein, Dokument, Inhalt } from './dokument'

const mm = (wert: number) => wert * 2.8346

const SCHWARZ = '#000000'
const GRAU = '#555555'
const LINIE = '#CCCCCC'
const BLAU = '#1F6FD1'
const BLAU_HELL = '#EAF2FC'
const GELB_HELL = '#FFF4D6'
const GELB_RAND = '#E0B84A'

const SCHRIFT = 'Inter'
const schriftdatei = (name: string) =>
  path.join(process.cwd(), 'src', 'lib', 'vertraege', 'fonts', name)

Font.register({
  family: SCHRIFT,
  fonts: [
    { src: schriftdatei('Inter-Regular.ttf') },
    { src: schriftdatei('Inter-Bold.ttf'), fontWeight: 'bold' },
  ],
})

// Die eingebaute Silbentrennung ist englisch und trennt deutsche Wörter an
// falschen Stellen. Ohne Trennung bricht der Text nur an Leerzeichen um.
Font.registerHyphenationCallback((wort) => [wort])

const s = StyleSheet.create({
  seite: {
    paddingTop: mm(16),
    paddingBottom: mm(16),
    paddingHorizontal: mm(22),
    fontFamily: SCHRIFT,
    fontSize: 9.5,
    lineHeight: 1.35,
    color: SCHWARZ,
  },
  fett: { fontWeight: 'bold' },
  grau: { color: GRAU },
  durchgestrichen: { textDecoration: 'line-through' },

  kopfMitte: { marginBottom: 10 },
  kopfMitteTitel: { fontWeight: 'bold', fontSize: 16, lineHeight: 1.3, textAlign: 'center' },
  kopfMitteUntertitel: { fontSize: 10.5, textAlign: 'center', color: GRAU, marginTop: 3 },

  kopfLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.2,
    borderBottomColor: BLAU,
    paddingBottom: 8,
    marginBottom: 12,
  },
  kopfLogoText: { flex: 1, paddingRight: 12 },
  kopfLogoTitel: { fontWeight: 'bold', fontSize: 20, lineHeight: 1.2 },
  kopfLogoUntertitel: { fontSize: 10.5, color: GRAU, marginTop: 3 },

  h2: { fontWeight: 'bold', fontSize: 11.5, marginTop: 8, marginBottom: 2 },
  h2Akzent: { fontSize: 11.5, color: BLAU, marginTop: 11, marginBottom: 4 },
  h3: { fontWeight: 'bold', fontSize: 10.5, marginTop: 5, marginBottom: 2 },

  absatz: { marginBottom: 3 },
  klein: { fontSize: 8.5, color: GRAU },

  listenpunkt: { flexDirection: 'row', marginBottom: 1 },
  listenzeichen: { width: 12, paddingLeft: 2 },
  listentext: { flex: 1 },

  tabelle: { marginTop: 1, marginBottom: 4 },
  zeile: { flexDirection: 'row', alignItems: 'flex-start' },
  zeileLinie: { borderBottomWidth: 0.4, borderBottomColor: LINIE },
  zeileBetont: { backgroundColor: BLAU_HELL },
  zelle: { paddingVertical: 3, paddingHorizontal: 6 },
  zelleKompakt: { paddingVertical: 1, paddingHorizontal: 6 },
  rechts: { textAlign: 'right' },
  kaestchen: {
    width: 9,
    height: 9,
    borderWidth: 0.8,
    borderColor: SCHWARZ,
    marginTop: 4.5,
    marginLeft: 6,
  },

  hinweis: {
    backgroundColor: GELB_HELL,
    borderWidth: 0.8,
    borderColor: GELB_RAND,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 4,
  },

  unterschriftenZeile: { flexDirection: 'row', marginTop: 4 },
  unterschrift: { width: '50%', paddingRight: 16 },
  unterschriftRaum: { height: 26 },
  unterschriftLinie: { borderTopWidth: 0.7, borderTopColor: SCHWARZ, paddingTop: 2 },

  ausfuellen: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 5 },
  ausfuellLinie: {
    borderBottomWidth: 0.6,
    borderBottomColor: SCHWARZ,
    height: 11,
    marginHorizontal: 3,
    marginBottom: 2,
  },
})

/** Logo für den Dokumentkopf. Liegt unter public/, damit es eine einzige Quelle gibt. */
const LOGO_PFAD = ['public', 'vertraege', 'logo-pepe-dome.png']
const LOGO_BREITE = mm(42)

type Logo = { daten: Buffer; breite: number; hoehe: number }

/**
 * Liest das Logo und seine Maße aus der Datei. Breite und Höhe stehen bei PNG
 * im IHDR-Block direkt hinter der Signatur, als zwei 32-Bit-Zahlen ab Byte 16.
 */
async function ladeLogo(): Promise<Logo> {
  const daten = await readFile(path.join(process.cwd(), ...LOGO_PFAD))
  return { daten, breite: daten.readUInt32BE(16), hoehe: daten.readUInt32BE(20) }
}

function brauchtLogo(bausteine: Baustein[]): boolean {
  return bausteine.some((baustein) =>
    baustein.art === 'gruppe'
      ? brauchtLogo(baustein.bausteine)
      : baustein.art === 'kopf' && baustein.logo === true
  )
}

function Laeufe({ inhalt }: { inhalt: Inhalt }) {
  const teile = Array.isArray(inhalt) ? inhalt : [inhalt]
  return (
    <>
      {teile.map((teil, index) => {
        if (typeof teil === 'string') return teil
        const stil = [
          ...(teil.fett ? [s.fett] : []),
          ...(teil.grau ? [s.grau] : []),
          ...(teil.durchgestrichen ? [s.durchgestrichen] : []),
        ]
        return (
          <Text key={index} style={stil}>
            {teil.text}
          </Text>
        )
      })}
    </>
  )
}

function Stueck({
  baustein,
  akzent,
  logo,
}: {
  baustein: Baustein
  akzent: boolean
  logo: Logo | null
}) {
  switch (baustein.art) {
    case 'kopf':
      if (baustein.logo && logo) {
        return (
          <View style={s.kopfLogo}>
            <View style={s.kopfLogoText}>
              <Text style={s.kopfLogoTitel}>{baustein.titel}</Text>
              {baustein.untertitel ? (
                <Text style={s.kopfLogoUntertitel}>{baustein.untertitel}</Text>
              ) : null}
            </View>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- PDF-Bild, kein HTML-img */}
            <Image
              src={{ data: logo.daten, format: 'png' }}
              style={{ width: LOGO_BREITE, height: (LOGO_BREITE * logo.hoehe) / logo.breite }}
            />
          </View>
        )
      }
      return (
        <View style={s.kopfMitte}>
          <Text style={s.kopfMitteTitel}>{baustein.titel}</Text>
          {baustein.untertitel ? (
            <Text style={s.kopfMitteUntertitel}>{baustein.untertitel}</Text>
          ) : null}
        </View>
      )

    case 'ueberschrift':
      // minPresenceAhead hält die Überschrift bei dem, was auf sie folgt.
      return (
        <Text
          style={baustein.ebene === 3 ? s.h3 : akzent ? [s.h2, s.h2Akzent] : s.h2}
          minPresenceAhead={36}
        >
          {baustein.text}
        </Text>
      )

    case 'absatz':
      return (
        <Text style={baustein.klein ? [s.absatz, s.klein] : s.absatz}>
          <Laeufe inhalt={baustein.text} />
        </Text>
      )

    case 'liste':
      return (
        <View>
          {baustein.punkte.map((punkt, index) => (
            <View key={index} style={s.listenpunkt} wrap={false}>
              <Text style={s.listenzeichen}>•</Text>
              <Text style={s.listentext}>
                <Laeufe inhalt={punkt} />
              </Text>
            </View>
          ))}
        </View>
      )

    case 'tabelle': {
      const spalten = Math.max(...baustein.zeilen.map((zeile) => zeile.length), 1)
      const breite = (spalte: number) =>
        `${baustein.breiten?.[spalte] ?? 100 / spalten}%` as `${number}%`
      const letzteZeile = baustein.zeilen.length - 1
      return (
        <View style={s.tabelle}>
          {baustein.zeilen.map((zeile, zeilenIndex) => (
            <View
              key={zeilenIndex}
              wrap={false}
              style={[
                s.zeile,
                ...(baustein.linien && zeilenIndex < letzteZeile ? [s.zeileLinie] : []),
                ...(baustein.betont?.includes(zeilenIndex) ? [s.zeileBetont] : []),
              ]}
            >
              {baustein.ankreuzen ? <View style={s.kaestchen} /> : null}
              <View style={{ flex: 1, flexDirection: 'row' }}>
                {zeile.map((zelle, spalte) => (
                  <Text
                    key={spalte}
                    style={[
                      baustein.kompakt ? s.zelleKompakt : s.zelle,
                      { width: breite(spalte) },
                      ...(baustein.rechts && spalte === zeile.length - 1 ? [s.rechts] : []),
                    ]}
                  >
                    <Laeufe inhalt={zelle} />
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      )
    }

    case 'hinweis':
      return (
        <View style={s.hinweis} wrap={false}>
          <Text>
            <Laeufe inhalt={baustein.text} />
          </Text>
        </View>
      )

    case 'unterschriften':
      return (
        <View>
          {baustein.felder.map((zeile, zeilenIndex) => (
            <View key={zeilenIndex} style={s.unterschriftenZeile} wrap={false}>
              {zeile.map((feld, index) => (
                <View key={index} style={s.unterschrift}>
                  <View style={s.unterschriftRaum} />
                  <Text style={[s.unterschriftLinie, s.klein]}>{feld}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )

    case 'ausfuellen':
      return (
        <View style={s.ausfuellen} wrap={false}>
          {baustein.teile.map((teil, index) =>
            typeof teil === 'string' ? (
              <Text key={index}>{teil}</Text>
            ) : (
              <View key={index} style={[s.ausfuellLinie, { flexGrow: teil.linie, flexBasis: 0 }]} />
            )
          )}
        </View>
      )

    case 'abstand':
      return <View style={{ height: baustein.hoehe }} />

    case 'gruppe':
      return (
        <View wrap={false}>
          {baustein.bausteine.map((kind, index) => (
            <Stueck key={index} baustein={kind} akzent={akzent} logo={logo} />
          ))}
        </View>
      )
  }
}

export async function dokumentAlsPdf(dokument: Dokument): Promise<Buffer> {
  const logo = brauchtLogo(dokument.bausteine) ? await ladeLogo() : null
  const akzent = dokument.akzent === true

  return renderToBuffer(
    <Document title={dokument.titel} author="Pepe Dome" language="de">
      <Page size="A4" style={s.seite}>
        {dokument.bausteine.map((baustein, index) => (
          <Stueck key={index} baustein={baustein} akzent={akzent} logo={logo} />
        ))}
      </Page>
    </Document>
  )
}

/** Dateiname für den Download: ohne Umlaute und Sonderzeichen, damit jeder Browser ihn annimmt. */
export function pdfDateiname(titel: string): string {
  const basis = titel
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return `${basis || 'Vertrag'}.pdf`
}

/** Fertige Antwort für eine Route, die ein PDF zum Herunterladen liefert. */
export async function pdfAntwort(dokument: Dokument): Promise<Response> {
  const pdf = await dokumentAlsPdf(dokument)
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${pdfDateiname(dokument.titel)}"`,
      // Verträge enthalten Namen und Anschriften: nirgends zwischenspeichern.
      'Cache-Control': 'private, no-store',
    },
  })
}
