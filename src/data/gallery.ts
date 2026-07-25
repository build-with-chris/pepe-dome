/**
 * Galerie-Bilder
 *
 * Neue Bilder hier eintragen, sonst nirgends. Die Seite unter
 * src/app/[lang]/galerie/page.tsx liest diese Liste, gruppiert sie nach
 * Kategorie und baut daraus Grid, Lightbox und das ImageGallery-JSON-LD.
 *
 * Warum Bildtexte hier und nicht im Dictionary:
 * Alt-Text und Bildunterschrift beschreiben *dieses eine Bild*. Lägen sie in
 * src/dictionaries/*.json, müsste man beim Nachlegen eines Fotos drei Dateien
 * anfassen und die Zuordnung über einen Key im Kopf behalten. Die UI-Texte der
 * Seite (Überschriften, Filter, Lightbox-Labels) liegen dagegen normal im
 * Dictionary unter `gallery`.
 *
 * ── Achtung bei den Dateinamen ─────────────────────────────────────────────
 * Die Namen im Repo beschreiben den Inhalt teils nicht. `dome-night-01.webp`
 * zeigt Leute, die tagsüber einen Balken tragen; `aerial-silk-01.jpg` ist
 * Partnerakrobatik im Freien und keine Tuchakrobatik; `carmen-jonas-duo.jpg`
 * ist ein Solo. Der Ordner `images/Aufbau/` enthält fast durchgehend Fotos vom
 * Bau der Kuppel, nicht vom fertigen Ort. Jeder Alt-Text hier wurde am Bild
 * selbst geprüft, nicht am Dateinamen. Beim Ergänzen bitte genauso vorgehen.
 *
 * ── Ein Bild hinzufügen ────────────────────────────────────────────────────
 *   1. Datei nach public/images/... legen (webp bevorzugt, lange Kante ~1600px)
 *   2. Breite und Höhe in Pixel eintragen. Nicht schätzen: die Zahlen
 *      reservieren im Layout den Platz, bevor das Bild geladen ist. Stimmen sie
 *      nicht, springt die Seite beim Laden (Layout Shift).
 *      Auslesen: `node -e "require('sharp')('pfad').metadata().then(m=>console.log(m.width,m.height))"`
 *   3. alt: was auf dem Bild zu sehen ist, in einem Satz. Das lesen
 *      Screenreader vor und Google nutzt es für die Bildersuche. Nicht
 *      "Foto von ..." und nicht der Bildtitel, sondern der Inhalt.
 *   4. caption ist optional und wird in der Lightbox unter dem Bild angezeigt.
 *   5. `featured: true` zieht das Bild an den Anfang seiner Kategorie.
 *      Sparsam nutzen: wenn alles vorne steht, steht nichts vorne.
 */

/**
 * Reihenfolge der Filter-Tabs.
 *
 * `training` gibt es bewusst *nicht*: im Repo liegt zwar ein Ordner
 * `images/Trainingsort/`, dessen Bilder zeigen aber Auftritte und Luftakrobatik,
 * kein Training. Eine Kategorie mit falsch einsortierten Bildern ist schlechter
 * als eine fehlende. Sobald echte Trainingsfotos da sind, hier ergänzen.
 */
export const GALLERY_CATEGORIES = ['dome', 'shows', 'aufbau', 'cafe'] as const

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]

export type GalleryImage = {
  src: string
  width: number
  height: number
  category: GalleryCategory
  alt: { de: string; en: string }
  caption?: { de: string; en: string }
  /** Wird innerhalb seiner Kategorie zuerst gezeigt. */
  featured?: boolean
}

export const GALLERY_IMAGES: GalleryImage[] = [
  // ── Der Ort ──────────────────────────────────────────────────────────────
  {
    src: '/images/Kategorien/Location.webp',
    width: 1574,
    height: 885,
    category: 'dome',
    featured: true,
    alt: {
      de: 'Die Kuppel des Pepe Dome bei Nacht, von innen warm orange erleuchtet, darüber ein dunkler Himmel',
      en: 'The Pepe Dome at night, lit warm orange from inside, under a dark sky',
    },
    caption: {
      de: 'Abends leuchtet die Kuppel von innen heraus',
      en: 'In the evening the dome glows from within',
    },
  },
  {
    src: '/images/Aufbau/dome-interior.jpg',
    width: 1080,
    height: 810,
    category: 'dome',
    alt: {
      de: 'Innenraum der Kuppel mit Holztragwerk, blauer Bespannung und Girlanden, davor eine Bühne mit dunklem Vorhang und Stuhlreihen',
      en: 'Interior of the dome with its wooden framework, blue canopy and bunting, a stage with a dark curtain and rows of chairs',
    },
    caption: {
      de: 'Bühne und Bestuhlung, hier für einen Abend mit Vorhang',
      en: 'Stage and seating, set up here with a curtain for the evening',
    },
  },
  {
    src: '/images/Aufbau/dome-audience-01.webp',
    width: 810,
    height: 1080,
    category: 'dome',
    alt: {
      de: 'Blick von unten in die Kuppel: das Holztragwerk aus Dreiecken vor gelb-oranger Bespannung',
      en: 'View up into the dome: the triangular wooden framework against a yellow and orange canopy',
    },
    caption: {
      de: 'Die Geodät-Konstruktion trägt sich ohne Stützen im Raum',
      en: 'The geodesic structure spans the room without any interior supports',
    },
  },
  {
    src: '/GeodomeEvening.webp',
    width: 1440,
    height: 1080,
    category: 'dome',
    alt: {
      de: 'Die erleuchtete Kuppel in der Dämmerung zwischen dunklen Bäumen, darüber zieht eine Wolke auf',
      en: 'The illuminated dome at dusk between dark trees, a cloud drifting overhead',
    },
  },
  {
    src: '/images/Kategorien/Community.webp',
    width: 2276,
    height: 1280,
    category: 'dome',
    alt: {
      de: 'Publikum sitzt im Kreis auf dem blauen Boden der Kuppel um einen Tisch herum, im Gespräch',
      en: 'An audience sitting in a circle on the blue floor of the dome around a table, in conversation',
    },
    caption: {
      de: 'Nicht immer Bühne: der Raum lässt sich auch als Runde stellen',
      en: 'Not always a stage: the room also works as a circle',
    },
  },

  // ── Shows ────────────────────────────────────────────────────────────────
  {
    src: '/images/shows/aerial-silk-02.jpg',
    width: 1920,
    height: 2886,
    category: 'shows',
    featured: true,
    alt: {
      de: 'Drei Artisten in einer aufeinander gestapelten Akrobatikfigur unter der Kuppel, farbiges Bühnenlicht, davor das Publikum',
      en: 'Three artists in a stacked acrobatic figure under the dome in coloured stage light, the audience in front',
    },
    caption: {
      de: 'Menschenpyramide unter der Kuppel',
      en: 'Human pyramid under the dome',
    },
  },
  {
    src: '/images/shows/jawad-performance.jpg',
    width: 1920,
    height: 1280,
    category: 'shows',
    alt: {
      de: 'Artist steht im Cyr-Wheel und hält die Arme über dem Kopf zusammen, dunkle Bühne',
      en: 'Artist standing inside a Cyr wheel with hands joined above the head on a dark stage',
    },
    caption: {
      de: 'Cyr-Wheel, ein Rad und ein Körper',
      en: 'Cyr wheel: one hoop, one body',
    },
  },
  {
    src: '/images/shows/carmen-jonas-acro.jpg',
    width: 1920,
    height: 1280,
    category: 'shows',
    alt: {
      de: 'Zwei Artistinnen in Schwarz in einer Duo-Figur: eine hält den Spagat, während die andere sie trägt',
      en: 'Two artists in black in a duo figure: one holds a split while the other carries her',
    },
  },
  {
    src: '/images/shows/carmen-jonas-duo.jpg',
    width: 1920,
    height: 1280,
    category: 'shows',
    alt: {
      de: 'Artist in orangener Hose und gestreiften Stulpen hält eine waagerechte Stützfigur auf dem Bühnenboden',
      en: 'Artist in orange trousers and striped legwarmers holding a horizontal planche on the stage floor',
    },
  },
  {
    src: '/images/shows/jonas-acrobatics.jpg',
    width: 1920,
    height: 1280,
    category: 'shows',
    alt: {
      de: 'Artist hält sich waagerecht an einer Chinese Pole, violett ausgeleuchteter Hintergrund',
      en: 'Artist holding a horizontal position on a Chinese pole against a purple lit backdrop',
    },
  },
  {
    src: '/images/Trainingsort/DSC_7519_batcheditor_fotor.webp',
    width: 1364,
    height: 1920,
    category: 'shows',
    alt: {
      de: 'Zwei Artistinnen an einem hängenden Luftgerät in blauem Licht über einer dunklen Bühne',
      en: 'Two artists on a hanging aerial apparatus in blue light above a dark stage',
    },
    caption: {
      de: 'Luftakrobatik, eingehängt an der Kuppelspitze',
      en: 'Aerial work, rigged from the apex of the dome',
    },
  },
  {
    src: '/images/shows/sophie-artist.jpg',
    width: 1920,
    height: 1280,
    category: 'shows',
    alt: {
      de: 'Tänzerin im weißen Hemd im Sprung mit gestrecktem Bein auf schwarzer Bühne',
      en: 'Dancer in a white shirt mid leap with an extended leg on a black stage',
    },
  },
  {
    src: '/images/shows/said-performer.jpg',
    width: 1920,
    height: 1920,
    category: 'shows',
    alt: {
      de: 'Artist im Sprung vor rotem Hintergrund, die Bewegung in rotem und türkisem Licht doppelt sichtbar',
      en: 'Artist mid jump against a red backdrop, the movement traced in red and turquoise light',
    },
  },
  {
    src: '/images/shows/aerial-silk-01.jpg',
    width: 1920,
    height: 2886,
    category: 'shows',
    alt: {
      de: 'Partnerakrobatik im Freien: ein Artist hält eine Artistin im Handstand über dem Kopf, dahinter Girlanden und Publikum',
      en: 'Partner acrobatics outdoors: an artist holds a partner overhead in a handstand, bunting and an audience behind',
    },
    caption: {
      de: 'Nicht alles findet unter der Kuppel statt',
      en: 'Not everything happens under the dome',
    },
  },
  {
    src: '/images/Trainingsort/DSC_6555_batcheditor_fotor.webp',
    width: 1278,
    height: 1920,
    category: 'shows',
    alt: {
      de: 'Artist im Handstand auf einer Stuhllehne vor einem weiß-blauen Zelt im Freien',
      en: 'Artist in a handstand on the back of a chair in front of a blue and white marquee outdoors',
    },
  },
  {
    src: '/images/shows/thomas-dietz.jpg',
    width: 1920,
    height: 1280,
    category: 'shows',
    alt: {
      de: 'Jongleur mit fünf Bällen in der Luft an einem Flussufer, im Hintergrund eine Altstadt mit Kirchtürmen',
      en: 'Juggler with five balls in the air on a riverbank, an old town with church spires behind',
    },
  },
  {
    src: '/images/Kategorien/Training.webp',
    width: 3773,
    height: 2122,
    category: 'shows',
    alt: {
      de: 'Artist im schwarzen Shirt streckt den Arm nach oben, hart von der Seite angeleuchtet',
      en: 'Artist in a black shirt reaching upward, lit hard from the side',
    },
  },

  // ── Entstehung ───────────────────────────────────────────────────────────
  {
    src: '/images/Aufbau/dome-aerial-01.webp',
    width: 810,
    height: 1080,
    category: 'aufbau',
    featured: true,
    alt: {
      de: 'Das halb aufgebaute Holztragwerk der Kuppel im Theatron im Ostpark, daneben zwei Hebebühnen und ein Kran, Arbeiter auf der Bühne',
      en: 'The half assembled wooden framework of the dome in the Theatron in the Ostpark, with two lifts, a crane and workers on the platform',
    },
    caption: {
      de: 'Aufbau im Theatron, das Tragwerk wächst Feld für Feld',
      en: 'Assembly in the Theatron, the frame growing panel by panel',
    },
  },
  {
    src: '/images/Aufbau/dome-outdoor-hero.webp',
    width: 1080,
    height: 607,
    category: 'aufbau',
    alt: {
      de: 'Nahaufnahme der Holzknoten des Kuppelgerüsts während des Aufbaus, dahinter Bäume und eine Hebebühne',
      en: 'Close view of the timber joints of the dome frame during construction, trees and a lift behind',
    },
    caption: {
      de: 'Jeder Knoten wird einzeln gesetzt',
      en: 'Every joint is placed by hand',
    },
  },
  {
    src: '/images/Aufbau/dome-night-01.webp',
    width: 810,
    height: 1080,
    category: 'aufbau',
    alt: {
      de: 'Vier Personen tragen gemeinsam einen langen Holzbalken über das Pflaster zur Baustelle',
      en: 'Four people carrying a long wooden beam together across the paving to the build site',
    },
    caption: {
      de: 'Gebaut wurde von Hand, mit vielen Händen',
      en: 'Built by hand, with a lot of hands',
    },
  },
  {
    src: '/images/Aufbau/dome-exterior.webp',
    width: 1080,
    height: 810,
    category: 'aufbau',
    alt: {
      de: 'Blick von unten auf das Gerüst, auf dem die ersten weißen und blauen Bahnen der Kuppelhaut liegen',
      en: 'View up at the frame with the first white and blue panels of the dome skin in place',
    },
  },
  {
    src: '/images/Aufbau/dome-event-01.webp',
    width: 810,
    height: 1080,
    category: 'aufbau',
    alt: {
      de: 'Das Kuppelgerüst unter bedecktem Himmel, am Fuß sitzt eine Person in violetter Jacke',
      en: 'The dome frame under an overcast sky, a person in a purple jacket sitting at its base',
    },
  },
  {
    src: '/images/Aufbau/dome-night-02.webp',
    width: 810,
    height: 1080,
    category: 'aufbau',
    alt: {
      de: 'Zwei Personen stehen im leeren Theatron und besprechen die auf dem Boden ausgelegten Bauteile',
      en: 'Two people standing in the empty Theatron discussing the parts laid out on the ground',
    },
  },
  {
    src: '/images/Aufbau/dome-performance-01.webp',
    width: 810,
    height: 1080,
    category: 'aufbau',
    alt: {
      de: 'Ein beladener Tieflader mit Material und Gerüstteilen auf dem Platz am Ostpark',
      en: 'A loaded flatbed truck with material and frame parts on the paved area by the Ostpark',
    },
    caption: {
      de: 'Ein Dome kommt auf einem Lastwagen an',
      en: 'A dome arrives on a truck',
    },
  },

  // ── Café ─────────────────────────────────────────────────────────────────
  {
    src: '/images/cafe/cafe-hero.webp',
    width: 1448,
    height: 1086,
    category: 'cafe',
    featured: true,
    alt: {
      de: 'Tische, Stühle und Sonnenschirme auf der Wiese vor dem Café, dahinter die weiße Kuppel im Abendlicht',
      en: 'Tables, chairs and parasols on the lawn outside the café, the white dome behind in evening light',
    },
    caption: {
      de: 'Kaffee direkt neben der Kuppel, auch ohne Ticket',
      en: 'Coffee right next to the dome, no ticket needed',
    },
  },
  {
    src: '/Coffee.png',
    width: 1672,
    height: 941,
    category: 'cafe',
    alt: {
      de: 'Ein Gast sitzt am Tisch vor dem Café, aus dem Ausgabefenster lehnt sich ein Mitarbeiter mit Hut heraus',
      en: 'A guest sitting at a table outside the café while a staff member in a hat leans out of the serving window',
    },
  },
  {
    src: '/images/cafe/cafe-atmosphere-1.webp',
    width: 765,
    height: 1020,
    category: 'cafe',
    alt: {
      de: 'Gedeckter Cafétisch mit Flasche und Glas, dahinter ein roter Sonnenschirm und die Wiese im Ostpark',
      en: 'A café table with a bottle and glass, a red parasol and the Ostpark lawn behind',
    },
  },
]

/** Bilder einer Kategorie, in der Reihenfolge dieser Datei. */
export function imagesByCategory(category: GalleryCategory): GalleryImage[] {
  return GALLERY_IMAGES.filter((image) => image.category === category)
}

/** Nur Kategorien, die tatsächlich Bilder haben — verhindert leere Filter-Tabs. */
export function usedCategories(): GalleryCategory[] {
  return GALLERY_CATEGORIES.filter((category) =>
    GALLERY_IMAGES.some((image) => image.category === category)
  )
}
