/**
 * Förderer und Unterstützer des Pepe Dome.
 *
 * Eine Quelle für beide Ausspielorte: die Über-uns-Seite und den Footer.
 * Kommt ein Förderer dazu, gehört er hierher und erscheint an beiden Stellen.
 *
 * Die Alt-Texte sind die Namen der Institutionen, so wie sie auf dem jeweiligen
 * Logo stehen. Sie bleiben in beiden Sprachen gleich: Eigennamen werden nicht
 * übersetzt.
 *
 * `width` und `height` sind die echten Pixelmasse der Dateien. Ohne sie kennt
 * der Browser das Seitenverhältnis erst nach dem Laden und das Layout springt.
 */
export type Supporter = {
  /** Pfad unterhalb von public/ */
  src: string
  width: number
  height: number
  alt: string
}

export const SUPPORTERS: readonly Supporter[] = [
  {
    /**
     * Die Leiste trug rechts das Stadtwappen mit "Landeshauptstadt München".
     * Das Kulturreferat hat um sein eigenes Logo gebeten, es sitzt jetzt an
     * genau dieser Stelle. Der Rest der Leiste ist unverändert.
     */
    src: '/images/foerderer/foerderleiste.png',
    width: 1400,
    height: 193,
    alt: 'Städtebauförderung von Bund, Ländern und Gemeinden, Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen, Bayerisches Staatsministerium für Wohnen, Bau und Verkehr, Landeshauptstadt München Kulturreferat',
  },
]

type Localized = { de: string; en: string }

export type Funder = {
  name: string
  /** Was der Förderer beiträgt. Nur, was belegt ist: Förderleiste und Über-uns-Text. */
  text: Localized
}

/**
 * Die Förderer einzeln, für die Großansicht hinter der Förderleiste.
 *
 * Die Texte stützen sich auf zwei Quellen und gehen nicht darüber hinaus: den
 * Pflichttext auf der Leiste selbst ("Dieses Projekt wird durch
 * Städtebauförderung in einem Bund-Länder-Programm mit Mitteln des Bundes und
 * des Freistaats Bayern gefördert sowie von der Landeshauptstadt München
 * kofinanziert.") und den Förderer-Absatz der Über-uns-Seite. Kreativ München
 * steht nicht auf der Leiste, fördert laut Über-uns-Text aber mit und gehört
 * deshalb in die Liste.
 */
export const FUNDERS: readonly Funder[] = [
  {
    name: 'Städtebauförderung von Bund, Ländern und Gemeinden',
    text: {
      de: 'Aus diesem Bund-Länder-Programm wird der Pepe Dome mit Mitteln des Bundes und des Freistaats Bayern gefördert. Die Landeshauptstadt München finanziert mit.',
      en: 'Pepe Dome is funded through this federal and state programme with money from the federal government and the Free State of Bavaria. The City of Munich co-finances it.',
    },
  },
  {
    name: 'Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen',
    text: {
      de: 'Steht auf Bundesseite hinter der Städtebauförderung und trägt den Anteil des Bundes.',
      en: 'Runs urban development funding at federal level and provides the federal share.',
    },
  },
  {
    name: 'Bayerisches Staatsministerium für Wohnen, Bau und Verkehr',
    text: {
      de: 'Trägt den Anteil des Freistaats Bayern an der Städtebauförderung.',
      en: 'Provides the Free State of Bavaria’s share of the urban development funding.',
    },
  },
  {
    name: 'Landeshauptstadt München, Kulturreferat',
    text: {
      de: 'Fördert den Pepe Dome als Kulturort. Die Landeshauptstadt finanziert außerdem die Städtebauförderung mit.',
      en: 'Funds Pepe Dome as a cultural venue. The City of Munich also co-finances the urban development funding.',
    },
  },
  {
    name: 'Kreativ München',
    text: {
      de: 'Fördert den Pepe Dome ebenfalls, unabhängig von der Städtebauförderung.',
      en: 'Also supports Pepe Dome, separately from the urban development funding.',
    },
  },
]
