/**
 * Kanal-Kit: Typen
 *
 * Das Kit erzeugt keine Veröffentlichung, sondern den Text dafür. Pro Zielkanal
 * steht am Ende genau das, was dessen Formular verlangt: feldweise, zeichengenau,
 * zum Kopieren. Nichts davon wird gespeichert, alles entsteht bei jedem Aufruf
 * frisch aus dem Event (siehe agent-os/specs/kanal-kit.md, Abschnitt 5.1).
 */

/**
 * Werte des Prisma-Enums `DistributionChannel`.
 *
 * Bewusst als String-Union und nicht als Import aus `@prisma/client`: dieses
 * Modul ist reine Textverarbeitung und läuft in den Tests ohne Datenbank und
 * ohne generierten Client.
 */
export type DistributionChannelValue =
  | 'eventbrite'
  | 'facebook_page'
  | 'instagram_business'
  | 'google_business_profile'
  | 'rausgegangen_feed'
  | 'jsonld_website'
  | 'in_muenchen'
  | 'whatsapp'
  | 'presse'

export type ChannelId =
  | 'facebook'
  | 'google_business'
  | 'in_muenchen'
  | 'instagram'
  | 'presse'
  | 'rausgegangen'
  | 'whatsapp'

/** Welchen Inhalt trägt ein Feld? Der Bauer entscheidet daran, was er einsetzt. */
export type FieldSource =
  | 'title'
  | 'description'
  | 'datetime'
  | 'location'
  // Portale, die Ort und Anschrift getrennt abfragen, bekommen sie getrennt.
  | 'venueName'
  | 'street'
  | 'cityLine'
  | 'price'
  | 'link'
  /** Nur ein echter Ticketshop. Portale, die das ausdrücklich verlangen. */
  | 'ticketLink'
  | 'caption'
  | 'hashtags'
  /** Schlagwörter ohne Rautezeichen, für Portale mit echtem Tag-Feld. */
  | 'tags'
  | 'imageNote'
  | 'post'
  | 'message'
  | 'pressLead'
  | 'pressContact'

/**
 * Woher stammt ein Zeichenlimit?
 *
 * Die Unterscheidung ist der Kern von Abschnitt 6.1 der Spec. Ein Zähler ist
 * nur so viel wert wie das Wissen dahinter, und "geraten" ist etwas anderes
 * als "bewusst selbst gesetzt":
 *
 *   portal     Am echten Formular abgelesen oder vom Anbieter dokumentiert.
 *              Wer mehr einträgt, verliert Text.
 *   redaktion  Eigene Vorgabe. Das Portal erlaubt mehr, aber längerer Text
 *              wird dort zusammengeklappt und damit nicht gelesen.
 *              Überschreiten kostet Wirkung, nicht Inhalt.
 *   annahme    Plausibel geschätzt, nie nachgemessen. Das Panel weist darauf
 *              hin, damit niemand einem Zähler vertraut, den keiner geprüft hat.
 */
export type LimitOrigin = 'portal' | 'redaktion' | 'annahme'

/**
 * Ohne Limit gibt es auch keine Herkunft. Als Union, damit gar nicht erst ein
 * Feld entstehen kann, das ein Limit ohne Angabe seiner Quelle trägt.
 */
export type FieldLimit = { max: null } | { max: number; origin: LimitOrigin }

export interface ChannelFieldDefinition {
  key: FieldSource
  label: string
  limit: FieldLimit
  /** Mehrzeilige Felder bekommen im Panel eine höhere Box. */
  multiline?: boolean
  /** Erklärung unter dem Feld, etwa wo der Text im Portal landet. */
  hint?: string
}

export interface ChannelDefinition {
  id: ChannelId
  label: string
  /** Zeile, die beim Häkchen "eingetragen" in `event_distributions` entsteht. */
  distributionChannel: DistributionChannelValue
  /** Wert für `utm_source`, damit sich später Klicks je Kanal zuordnen lassen. */
  utmSource: string
  /** Wert für `utm_medium`. Portale sind `referral`, Netzwerke `social`. */
  utmMedium: string
  /** Wo trägt die Redaktion das ein? Steht als Hilfe über den Feldern. */
  formUrl?: string
  fields: ChannelFieldDefinition[]
}

export interface KitField {
  key: FieldSource
  label: string
  value: string
  max: number | null
  /** Herkunft des Limits, `null` wenn es keines gibt. */
  limitOrigin: LimitOrigin | null
  length: number
  /** Auch nach dem Kürzen zu lang. Das Panel markiert das rot. */
  overLimit: boolean
  /** An der Wortgrenze gekürzt. */
  truncated: boolean
  multiline: boolean
  /**
   * Gesetzt, wenn das Event die Daten für dieses Feld nicht hergibt.
   * Dann steht hier, was fehlt, und `value` bleibt leer. Erfunden wird nichts.
   */
  missing: string | null
  hint: string | null
}

export interface ChannelKit {
  id: ChannelId
  label: string
  distributionChannel: DistributionChannelValue
  formUrl: string | null
  fields: KitField[]
  /** Alle Felder als ein Block, für Formulare, die man in einem Rutsch ausfüllt. */
  copyAll: string
  /** Enthält mindestens ein Feld ein bloß angenommenes Limit? */
  hasAssumedLimits: boolean
  /** Klartext zu allem, was diesem Kanal fehlt. */
  warnings: string[]
}

/** Warum es für ein Event kein Kit gibt. */
export type KitUnavailableReason = 'BUSINESS' | 'CHILD_EVENT'

export interface EventChannelKit {
  available: boolean
  reason: KitUnavailableReason | null
  /** Bei einem Serientermin: das Elternevent, das das Kit trägt. */
  parentEventId: string | null
  channels: ChannelKit[]
}
