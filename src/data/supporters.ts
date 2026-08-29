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
