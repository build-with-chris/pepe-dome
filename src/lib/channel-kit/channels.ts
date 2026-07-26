import type { ChannelDefinition } from './types'

/**
 * Kanal-Kit: die Kanäle und ihre Felder
 *
 * ── Warum die Limits hier stehen und nicht im Generator ────────────────────
 *
 * Portalanbieter ändern ihre Felder ohne Ankündigung. Deshalb steht jedes
 * Limit an genau einer Stelle, zusammen mit seiner Herkunft (`origin`, siehe
 * types.ts):
 *
 *   portal     am echten Formular abgelesen oder vom Anbieter dokumentiert
 *   redaktion  eigene Vorgabe, das Portal erlaubt mehr
 *   annahme    geschätzt, nie nachgemessen
 *
 * Die dritte Sorte ist die gefährliche: ein Generator, der falsche Limits
 * hartkodiert, erzeugt Texte, die beim Einfügen abgeschnitten werden, und
 * niemand merkt es. Das Panel markiert deshalb genau diese Felder.
 *
 * Rausgegangen und IN München sind am echten Formular abgelesen (26.07.2026).
 * Bei Instagram und Facebook gibt es überhaupt kein Formular mit Feldgrenzen,
 * dort ist die einzige sinnvolle Grenze die eigene.
 *
 * Reihenfolge: alphabetisch, bis aus der Klickmessung (utm_source je Kanal)
 * hervorgeht, welcher Kanal tatsächlich Tickets bringt.
 */

export const CHANNELS: ChannelDefinition[] = [
  {
    id: 'facebook',
    label: 'Facebook-Seite',
    distributionChannel: 'facebook_page',
    utmSource: 'facebook',
    utmMedium: 'social',
    formUrl: 'https://www.facebook.com/pepedome',
    fields: [
      {
        key: 'post',
        label: 'Beitragstext',
        // Facebook erlaubt ein Vielfaches davon. Die Grenze ist unsere: alles
        // nach den ersten Zeilen klappt Facebook hinter "Mehr anzeigen" weg.
        limit: { max: 600, origin: 'redaktion' },
        multiline: true,
        hint: 'Die ersten zwei Zeilen entscheiden. Alles danach klappt Facebook zusammen.',
      },
      {
        key: 'link',
        label: 'Link',
        limit: { max: null },
        hint: 'Als eigenes Feld einfügen, damit Facebook die Vorschaukarte baut.',
      },
      { key: 'imageNote', label: 'Bild', limit: { max: null } },
    ],
  },
  {
    id: 'google_business',
    label: 'Google Business Profile',
    distributionChannel: 'google_business_profile',
    utmSource: 'google_business',
    utmMedium: 'referral',
    formUrl: 'https://business.google.com/',
    /*
     * Beitragstyp "Veranstaltung". Die Felder stehen so in der Google-Hilfe
     * (support.google.com/business/answer/7342169): Titel sowie Start- und
     * Enddatum mit Uhrzeit sind Pflicht, Beschreibung, Foto oder Video und
     * eine Aktionsschaltfläche mit Link sind optional.
     *
     * Zeichenlimits nennt Google nirgends. Die Werte unten sind deshalb das,
     * was in der Oberfläche üblicherweise berichtet wird, und bleiben bis zu
     * einem Blick ins echte Formular Annahmen.
     */
    fields: [
      {
        key: 'title',
        label: 'Titel des Termins',
        limit: { max: 58, origin: 'annahme' },
        hint: 'Pflichtfeld. Google kürzt lange Titel in der Kachel.',
      },
      {
        key: 'datetime',
        label: 'Zeitraum',
        limit: { max: null },
        multiline: true,
        hint: 'Pflichtfeld. Start und Ende werden mit Datum und Uhrzeit getrennt abgefragt.',
      },
      {
        key: 'description',
        label: 'Beschreibung',
        limit: { max: 1500, origin: 'annahme' },
        multiline: true,
      },
      { key: 'imageNote', label: 'Foto', limit: { max: null } },
      {
        key: 'link',
        label: 'Button-Link',
        limit: { max: null },
        hint: 'Aktionsschaltfläche, für uns "Mehr erfahren".',
      },
    ],
  },
  {
    id: 'in_muenchen',
    label: 'IN München',
    distributionChannel: 'in_muenchen',
    utmSource: 'in_muenchen',
    utmMedium: 'referral',
    formUrl: 'https://www.in-muenchen.de/eintragsformular',
    // Felder und Limits am echten Formular abgelesen (Aufgabe 9.1, 26.07.2026).
    fields: [
      {
        key: 'title',
        label: 'Titel der Veranstaltung',
        // Steht als Hinweis im Feld und als maxlength im Formular.
        limit: { max: 60, origin: 'portal' },
        hint: 'Das Formular verlangt ausdrücklich keine Großbuchstaben-Schreibweise.',
      },
      {
        key: 'description',
        label: 'Beschreibung',
        // Ein Rich-Text-Editor ohne Zeichenlimit.
        limit: { max: null },
        multiline: true,
        hint: 'IN München bittet um dritte Person und keine werblichen Floskeln. Lobend beschreiben ist erwünscht.',
      },
      {
        key: 'datetime',
        label: 'Datum und Zeit',
        limit: { max: null },
        multiline: true,
        hint: 'Datum, Beginn und Ende sind eigene Felder. Für Serien gibt es "Serientermin angeben".',
      },
      { key: 'venueName', label: 'Locationname', limit: { max: null } },
      { key: 'street', label: 'Straße', limit: { max: null } },
      { key: 'cityLine', label: 'PLZ und Ort', limit: { max: null } },
      {
        key: 'price',
        label: 'Ticketpreis',
        limit: { max: null },
        hint: 'Im Formular zwei Zahlenfelder (von/bis) plus eine Checkbox "Eintritt frei". Hier steht der Wortlaut zum Übertragen.',
      },
      {
        key: 'ticketLink',
        label: 'Ticketlink',
        limit: { max: null },
        hint: 'Das Formular sagt: bitte wirklich nur Ticketlinks. Die eigene Seite gehört ins Feld Webseite.',
      },
      { key: 'link', label: 'Webseite', limit: { max: null } },
      {
        key: 'imageNote',
        label: 'Bild',
        limit: { max: null },
        hint: 'Pflichtfeld. Wird hochgeladen, nicht verlinkt, und braucht die Bestätigung der Bildrechte.',
      },
    ],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    distributionChannel: 'instagram_business',
    utmSource: 'instagram',
    utmMedium: 'social',
    formUrl: 'https://www.instagram.com/pepe_arts/',
    fields: [
      {
        key: 'caption',
        label: 'Caption',
        // Von Instagram dokumentiert. Praktisch liest niemand mehr als die
        // ersten Zeilen, deshalb ist die Caption ohnehin kurz gebaut und
        // stößt an diese Grenze nie an.
        limit: { max: 2200, origin: 'portal' },
        multiline: true,
        hint: 'Enthält bewusst keinen Link. In der Caption ist eine URL toter Text.',
      },
      {
        key: 'hashtags',
        label: 'Hashtags',
        limit: { max: null },
        multiline: true,
        hint: 'Getrennt, weil viele sie lieber in den ersten Kommentar setzen.',
      },
      {
        key: 'link',
        label: 'Link für die Bio',
        limit: { max: null },
        hint: 'Der einzige Ort auf Instagram, an dem ein Link klickbar ist.',
      },
      { key: 'imageNote', label: 'Bild', limit: { max: null } },
    ],
  },
  {
    id: 'presse',
    label: 'Presse',
    distributionChannel: 'presse',
    utmSource: 'presse',
    utmMedium: 'referral',
    fields: [
      {
        key: 'pressLead',
        label: 'Dreizeiler',
        // Kein Empfänger schreibt uns ein Limit vor. Länger gelesen wird es
        // trotzdem nicht.
        limit: { max: 400, origin: 'redaktion' },
        multiline: true,
        hint: 'Was, wann, wo. Der Rest steht im Link.',
      },
      { key: 'pressContact', label: 'Kontaktblock', limit: { max: null }, multiline: true },
      { key: 'link', label: 'Link', limit: { max: null } },
    ],
  },
  {
    id: 'rausgegangen',
    label: 'Rausgegangen',
    distributionChannel: 'rausgegangen_feed',
    utmSource: 'rausgegangen',
    utmMedium: 'referral',
    formUrl: 'https://zentrale.events/',
    // Felder und Limits am echten Formular abgelesen (Aufgabe 9.1, 26.07.2026).
    // Fünf Schritte: Titel, Zeit + Ort, Inhalte, Ticketing anlegen, Ticketing
    // erstellen. Eine Kurzbeschreibung gibt es dort nicht, ein Ticketlink-Feld
    // auch nicht: Rausgegangen ist selbst der Ticketshop.
    fields: [
      {
        key: 'title',
        label: 'Titel',
        // Zähler am Feld sagt 0/180.
        limit: { max: 180, origin: 'portal' },
        hint: 'Erscheint auf Übersichts- und Detailseiten der Plattform.',
      },
      {
        key: 'description',
        label: 'Beschreibung',
        // Rich-Text-Editor ohne Zähler.
        limit: { max: null },
        multiline: true,
        hint: 'Rich-Text-Editor. Nicht erlaubte Elemente entfernt er beim Einfügen von selbst.',
      },
      {
        key: 'datetime',
        label: 'Beginn und Ende',
        limit: { max: null },
        multiline: true,
        hint: 'Datumsfelder, kein Freitext. Für Serien gibt es "Serientermine generieren".',
      },
      {
        key: 'location',
        label: 'Ort',
        limit: { max: null },
        hint: 'Wird aus der Liste gewählt, nicht getippt. Der Pepe Dome ist dort angelegt, bitte keine zweite Location erstellen.',
      },
      {
        key: 'tags',
        label: 'Tags',
        limit: { max: null },
        hint: 'Schlagwörter einzeln eintippen und je mit Enter bestätigen.',
      },
      {
        key: 'price',
        label: 'Preis',
        limit: { max: null },
        hint: 'Im Formular erst in Schritt 4 als Ticketkategorie. Hier steht der Wortlaut als Vorgabe.',
      },
      {
        key: 'imageNote',
        label: 'Titelbild',
        limit: { max: null },
        hint: 'JPEG oder PNG, höchstens 5 MB, mindestens 1200 px breit, Zuschnitt auf 16:9. Das Feld "Bild Copyright" fasst 255 Zeichen und steht nicht am Event.',
      },
    ],
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    distributionChannel: 'whatsapp',
    utmSource: 'whatsapp',
    utmMedium: 'social',
    fields: [
      {
        key: 'message',
        label: 'Kurznachricht',
        // Der Kanal erlaubt deutlich mehr. Alles über vier Zeilen wird in
        // einer Nachrichtenliste weggeklappt und damit nicht gelesen.
        limit: { max: 400, origin: 'redaktion' },
        multiline: true,
        hint: 'Der Link steht am Ende, dort baut WhatsApp die Vorschau.',
      },
    ],
  },
]

export function channelById(id: string): ChannelDefinition | undefined {
  return CHANNELS.find((channel) => channel.id === id)
}

/** Die Kanäle, gegen die sich "auf wie vielen Kanälen steht das Event" rechnet. */
export const CHANNEL_COUNT = CHANNELS.length

/** Prisma-Enum-Werte aller Kit-Kanäle. Filter für die Verteilungs-Abfrage. */
export const KIT_DISTRIBUTION_CHANNELS = CHANNELS.map((c) => c.distributionChannel)
