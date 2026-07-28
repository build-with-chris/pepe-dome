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
 *   1. Datei nach public/images/... legen (webp bevorzugt, lange Kante ~1600px).
 *      Kommt das Bild direkt aus der Kamera, gehört der Ordner mit den
 *      Originalen in die .gitignore und die Umrechnung ins Manifest von
 *      scripts/optimize-gallery-images.mjs. Ein 30-MB-JPEG unter public/ wird
 *      sonst genau so ausgeliefert, wie es aus der Kamera kam.
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
export const GALLERY_CATEGORIES = ['dome', 'shows', 'festival', 'aufbau', 'cafe'] as const

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
  {
    src: '/images/dome/flower-partnerakrobatik.webp',
    width: 1800,
    height: 1200,
    category: 'dome',
    alt: {
      de: 'Partnerakrobatik auf einem hellen Tanzteppich unter der Kuppel, ringsum sitzt das Publikum dicht an dicht',
      en: 'Partner acrobatics on a pale dance floor under the dome, the audience seated close all around',
    },
    caption: {
      de: 'Tagsüber reicht das Licht, das durch die Kuppelhaut fällt',
      en: 'By day the light coming through the canopy is enough',
    },
  },
  {
    src: '/images/dome/flower-publikum-kuppel.webp',
    width: 1800,
    height: 1200,
    category: 'dome',
    alt: {
      de: 'Volle Zuschauerreihen in der Kuppel an einem Sommertag, viele Gäste tragen Blumen im Haar',
      en: 'Full rows of spectators inside the dome on a summer day, many guests wearing flowers in their hair',
    },
  },
  {
    src: '/images/dome/flower-cyr-wheel-buehne.webp',
    width: 1800,
    height: 1200,
    category: 'dome',
    alt: {
      de: 'Artist steht breitbeinig im Cyr-Wheel auf der Bühne, dahinter die blaue Bespannung der Kuppel und das Publikum',
      en: 'Artist standing wide-legged inside a Cyr wheel on stage, the blue canopy of the dome and the audience behind',
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

  // Circus and Poetry, eine abendfüllende Show. Die Bilder stammen aus einer
  // Vorstellung, deshalb stehen sie hier zusammen und nicht verstreut.
  {
    src: '/images/circus-poetry/cyr-wheel-handstand.webp',
    width: 1200,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Artist im Handstand im Cyr-Wheel, das Rad steht schräg über dem violett ausgeleuchteten Bühnenboden',
      en: 'Artist in a handstand inside a Cyr wheel, the hoop tilted above a purple lit stage floor',
    },
    caption: {
      de: 'Aus der Show Circus and Poetry',
      en: 'From the show Circus and Poetry',
    },
  },
  {
    src: '/images/circus-poetry/luftring-kugel.webp',
    width: 1200,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Artistin hängt kopfüber in einem Luftgerät aus zwei gekreuzten Ringen, das lange Haar fällt nach unten',
      en: 'Artist hanging upside down in an aerial apparatus of two crossed hoops, long hair falling downward',
    },
  },
  {
    src: '/images/circus-poetry/clown-hut.webp',
    width: 1200,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Ein Clown im grauen Sakko schaut zu einer Schiebermütze hoch, die über ihm in der Luft hängt',
      en: 'A clown in a grey jacket looking up at a flat cap hanging in the air above him',
    },
  },
  {
    src: '/images/circus-poetry/musiker-gitarre.webp',
    width: 1197,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Musiker mit Stirnband spielt eine selbstgebaute Gitarre, deren Korpus aus einem Olivenölkanister besteht',
      en: 'Musician wearing a headscarf playing a homemade guitar built from an olive oil tin',
    },
    caption: {
      de: 'Die Musik entsteht live auf der Bühne',
      en: 'The music is played live on stage',
    },
  },
  {
    src: '/images/circus-poetry/luftring-kopfueber.webp',
    width: 1197,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Artistin im hellen Kleid hängt kopfüber im Luftring über der dunklen Bühne',
      en: 'Artist in a pale dress hanging upside down from an aerial hoop above the dark stage',
    },
  },
  {
    src: '/images/circus-poetry/balance-holzbohle.webp',
    width: 1197,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Artist in weißer Latzhose hält eine senkrecht aufgestellte Holzbohle im Gleichgewicht und schaut an ihr hinauf',
      en: 'Artist in white dungarees balancing an upright wooden plank and looking up along it',
    },
  },
  {
    src: '/images/circus-poetry/cyr-wheel-einarmig.webp',
    width: 1197,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Artist stützt sich einarmig im Cyr-Wheel ab und streckt die Beine nach oben',
      en: 'Artist supporting himself on one arm inside a Cyr wheel with his legs stretched upward',
    },
  },
  {
    src: '/images/circus-poetry/taenzerin-boden.webp',
    width: 1197,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Tänzerin im hellen Kleid kniet auf der Bühne und beugt den Oberkörper weit nach hinten',
      en: 'Dancer in a pale dress kneeling on stage, bending far backwards',
    },
  },
  {
    src: '/images/circus-poetry/handstand-holzgeruest.webp',
    width: 1200,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Artist steht kopfüber auf einer schräg gestellten Holzbohle, daneben sitzt eine Person auf einem Klappstuhl',
      en: 'Artist upside down on a tilted wooden plank, a person sitting on a folding chair beside him',
    },
  },
  {
    src: '/images/circus-poetry/kugel-portrait.webp',
    width: 1200,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Frau im schwarzen Kleid steht in einem Gerät aus zwei gekreuzten Ringen und streckt die Arme zur Seite',
      en: 'Woman in a black dress standing inside an apparatus of two crossed hoops, arms stretched out sideways',
    },
  },
  {
    src: '/images/circus-poetry/clown-marienkaefer.webp',
    width: 1197,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Der Clown drückt einen roten Stoffmarienkäfer an sich und lächelt mit geschlossenen Augen',
      en: 'The clown hugging a red fabric ladybird, smiling with his eyes closed',
    },
  },
  {
    src: '/images/circus-poetry/musiker-mikrofon.webp',
    width: 1197,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Musiker im rot-blau gestreiften Hemd singt dicht in ein Handmikrofon',
      en: 'Musician in a red and blue striped shirt singing close into a handheld microphone',
    },
  },
  {
    src: '/images/circus-poetry/ringelstulpen-tisch.webp',
    width: 1200,
    height: 1800,
    category: 'shows',
    alt: {
      de: 'Zwei Beine in bunt geringelten Stulpen liegen auf einer Tischkante, der Rest der Bühne bleibt dunkel',
      en: 'Two legs in brightly striped legwarmers resting on the edge of a table, the rest of the stage dark',
    },
  },
  {
    src: '/images/circus-poetry/schlussapplaus.webp',
    width: 1800,
    height: 1200,
    category: 'shows',
    alt: {
      de: 'Vier Mitwirkende stehen zum Schlussapplaus nebeneinander und heben die Hände',
      en: 'Four performers standing side by side for the final applause with their hands raised',
    },
    caption: {
      de: 'Schlussapplaus, vier Menschen für einen ganzen Abend',
      en: 'Curtain call: four people for a whole evening',
    },
  },

  // ── Festivals ────────────────────────────────────────────────────────────
  // Zwei Festivals in einer Kategorie: das Freeman Festival im November und
  // das Flower Festival im Sommer. Beide zeigen dasselbe Muster, nämlich
  // mehrere Tage Programm mit allem, was drumherum passiert.
  {
    src: '/images/festival/freeman-kuppel-herbst.webp',
    width: 1800,
    height: 1198,
    category: 'festival',
    featured: true,
    alt: {
      de: 'Die weiß-blaue Kuppel im Park hinter einem Weg voller Herbstlaub, an den Bäumen hängt eine Wimpelkette',
      en: 'The white and blue dome in the park behind a path covered in autumn leaves, bunting strung between the trees',
    },
    caption: {
      de: 'Freeman Festival im November, draußen Laub und drinnen Programm',
      en: 'Freeman Festival in November: leaves outside, programme inside',
    },
  },
  {
    src: '/images/festival/freeman-handstand-stuhl.webp',
    width: 1198,
    height: 1800,
    category: 'festival',
    alt: {
      de: 'Artist im Handstand auf einer Stuhllehne vor der beleuchteten Kuppel, im Gras stehen Windlichter',
      en: 'Artist in a handstand on the back of a chair in front of the lit dome, lanterns standing in the grass',
    },
  },
  {
    src: '/images/festival/freeman-cyr-wheel-park.webp',
    width: 1800,
    height: 1512,
    category: 'festival',
    alt: {
      de: 'Artist dreht ein Cyr-Wheel auf einem Weg im Park, dahinter geht die Sonne über der Wiese unter',
      en: 'Artist spinning a Cyr wheel on a path in the park, the sun setting over the meadow behind',
    },
    caption: {
      de: 'Geprobt wird auch draußen, solange es hell ist',
      en: 'Rehearsals happen outdoors too, as long as there is light',
    },
  },
  {
    src: '/images/festival/freeman-sitzkreis.webp',
    width: 1800,
    height: 1198,
    category: 'festival',
    alt: {
      de: 'Rund zwanzig Menschen sitzen im Kreis auf dem Boden der Kuppel, in der Mitte ein kleiner Tisch mit Kerzen',
      en: 'About twenty people sitting in a circle on the floor of the dome, a small table with candles in the middle',
    },
    caption: {
      de: 'Zwischen den Vorstellungen wird geredet, nicht gespielt',
      en: 'Between the shows there is talking, not performing',
    },
  },
  {
    src: '/images/festival/freeman-publikum-lachen.webp',
    width: 1800,
    height: 1210,
    category: 'festival',
    alt: {
      de: 'Ein Mann sitzt lachend am Boden zwischen anderen Gästen und hebt den Zeigefinger',
      en: 'A man sitting on the floor among other guests, laughing and raising a finger',
    },
  },
  {
    src: '/images/festival/freeman-kerze.webp',
    width: 1800,
    height: 1198,
    category: 'festival',
    alt: {
      de: 'Eine junge Frau hält eine brennende Kerze in beiden Händen, um sie herum stehen weitere Gäste',
      en: 'A young woman holding a lit candle in both hands, other guests standing around her',
    },
  },
  {
    src: '/images/festival/freeman-popcorn.webp',
    width: 1800,
    height: 1202,
    category: 'festival',
    alt: {
      de: 'Zwei Personen an einer beleuchteten Popcornmaschine, eine von ihnen filmt mit dem Handy',
      en: 'Two people at a lit popcorn machine, one of them filming with a phone',
    },
  },
  {
    src: '/images/festival/freeman-buehne-getraenkekisten.webp',
    width: 1800,
    height: 1198,
    category: 'festival',
    alt: {
      de: 'Drei Personen stehen auf einer Bühne aus Getränkekisten und sprechen ins Mikrofon, davor sitzt das Publikum im blauen Licht',
      en: 'Three people standing on a stage built from drinks crates speaking into microphones, the audience seated in blue light',
    },
  },
  {
    src: '/images/festival/freeman-jonglage-keulen.webp',
    width: 1201,
    height: 1800,
    category: 'festival',
    alt: {
      de: 'Jongleur wirft Keulen in die Luft, hinter ihm die blaue Bespannung und das Holztragwerk der Kuppel',
      en: 'Juggler throwing clubs in the air, the blue canopy and wooden framework of the dome behind him',
    },
  },
  {
    src: '/images/festival/freeman-rollschuhe-gruppe.webp',
    width: 1800,
    height: 1246,
    category: 'festival',
    alt: {
      de: 'Fünf Artistinnen und Artisten auf Rollschuhen stehen nebeneinander im rosa Nebel, davor das Publikum',
      en: 'Five artists on roller skates standing side by side in pink haze, the audience in front',
    },
  },
  {
    src: '/images/festival/freeman-rollschuhe-solo.webp',
    width: 1202,
    height: 1800,
    category: 'festival',
    alt: {
      de: 'Artist auf Rollschuhen gleitet mit ausgebreiteten Armen durch magentafarbenes Licht',
      en: 'Artist on roller skates gliding through magenta light with arms spread wide',
    },
  },
  {
    src: '/images/festival/freeman-buehnenlicht-blau.webp',
    width: 1800,
    height: 1198,
    category: 'festival',
    alt: {
      de: 'Blaue Scheinwerferstrahlen schneiden durch den Nebel über der Bühne, rechts steht ein Musiker',
      en: 'Blue spotlight beams cutting through haze above the stage, a musician standing to the right',
    },
  },
  {
    src: '/images/festival/freeman-vertikaltuch-blau.webp',
    width: 1800,
    height: 1085,
    category: 'festival',
    alt: {
      de: 'Artistin hoch oben im Vertikaltuch, unten hält eine zweite Person das Tuch, dahinter leuchtet blaues Licht durch das Kuppelgerüst',
      en: 'Artist high up on an aerial silk while a second person holds the fabric below, blue light shining through the dome frame behind',
    },
    caption: {
      de: 'Luftakrobatik, eingehängt an der Kuppelspitze',
      en: 'Aerial work, rigged from the apex of the dome',
    },
  },
  {
    src: '/images/festival/freeman-vertikaltuch-gegenlicht.webp',
    width: 1198,
    height: 1800,
    category: 'festival',
    alt: {
      de: 'Das Vertikaltuch bauscht sich im Gegenlicht zu einer großen Welle, darunter steht eine Person im Scheinwerferkegel',
      en: 'The aerial silk billowing into a large wave in backlight, a person standing below in the beam',
    },
  },
  {
    src: '/images/festival/freeman-duo-schwebefigur.webp',
    width: 1788,
    height: 1800,
    category: 'festival',
    alt: {
      de: 'Zwei Artistinnen im Duo: eine schwebt waagerecht am Seil, die andere hält sie an beiden Händen',
      en: 'Two artists in a duo: one floating horizontally on a rope while the other holds both her hands',
    },
  },
  {
    src: '/images/festival/freeman-seil-wasser.webp',
    width: 1800,
    height: 1197,
    category: 'festival',
    alt: {
      de: 'Artist hängt am Vertikalseil und schleudert Wassertropfen durch den beleuchteten Nebel',
      en: 'Artist hanging from a vertical rope, flinging drops of water through the lit haze',
    },
  },
  {
    src: '/images/festival/freeman-chinese-pole.webp',
    width: 1202,
    height: 1800,
    category: 'festival',
    alt: {
      de: 'Artist streckt sich an einer senkrechten Stange nach oben, hinter ihm grün beleuchteter Nebel',
      en: 'Artist reaching up along a vertical pole, green lit haze behind him',
    },
  },
  {
    src: '/images/festival/freeman-theaterszene.webp',
    width: 1202,
    height: 1800,
    category: 'festival',
    alt: {
      de: 'Ein Darsteller in ockerfarbener Jacke und Schiebermütze steht breitbeinig über einer am Boden liegenden Person',
      en: 'A performer in an ochre jacket and flat cap standing astride a person lying on the floor',
    },
    caption: {
      de: 'Nicht nur Artistik: es wird auch gespielt',
      en: 'Not only acrobatics: there is acting too',
    },
  },
  {
    src: '/images/festival/freeman-artistin-am-seil.webp',
    width: 1202,
    height: 1800,
    category: 'festival',
    alt: {
      de: 'Artistin sitzt im Klettergurt am Seil vor dem Kuppelgerüst, darunter die leeren Sitzreihen',
      en: 'Artist sitting in a harness on a rope in front of the dome frame, the empty rows of seats below',
    },
  },
  {
    src: '/images/festival/freeman-rigging.webp',
    width: 1196,
    height: 1800,
    category: 'festival',
    alt: {
      de: 'Zwei Personen hängen im Gegenlicht ein Seil in die Spitze der Kuppel ein',
      en: 'Two people rigging a rope into the apex of the dome, seen against the light',
    },
    caption: {
      de: 'Bevor jemand fliegt, hängt jemand anderes das Seil ein',
      en: 'Before anyone flies, someone else rigs the rope',
    },
  },
  {
    src: '/images/festival/freeman-portrait-artistin.webp',
    width: 1139,
    height: 1800,
    category: 'festival',
    alt: {
      de: 'Artistin in schwarzem Gewand steht neben einem herabhängenden Seil und blickt nach oben',
      en: 'Artist in a black robe standing beside a hanging rope, looking upward',
    },
  },
  {
    src: '/images/festival/flower-garten-blumen.webp',
    width: 1800,
    height: 1200,
    category: 'festival',
    alt: {
      de: 'Gäste in Sommerkleidung sitzen im Garten unter einer Wimpelkette, links steht eine überlebensgroße Papierblume',
      en: 'Guests in summer clothes sitting in the garden under bunting, an oversized paper flower standing to the left',
    },
    caption: {
      de: 'Flower Festival, dasselbe Gelände im Sommer',
      en: 'Flower Festival: the same grounds in summer',
    },
  },
  {
    src: '/images/festival/flower-kartentrick.webp',
    width: 1800,
    height: 1200,
    category: 'festival',
    alt: {
      de: 'Ein Zauberer hält einer Besucherin im Publikum drei Spielkarten zur Auswahl hin',
      en: 'A magician offering three playing cards to a visitor in the audience',
    },
  },
  {
    src: '/images/festival/flower-basteltisch.webp',
    width: 1800,
    height: 1200,
    category: 'festival',
    alt: {
      de: 'Mehrere Gäste basteln an einem langen Tisch mit Papier, Stiften und Weingläsern',
      en: 'Several guests making things at a long table with paper, pens and wine glasses',
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
  {
    src: '/images/cafe/flower-kueche.webp',
    width: 1800,
    height: 1200,
    category: 'cafe',
    alt: {
      de: 'Ein Koch richtet in der offenen Küche einen Teller an, davor wartet eine Besucherin am Tresen',
      en: 'A cook plating a dish in the open kitchen while a visitor waits at the counter',
    },
    caption: {
      de: 'Bei Festivals wird warm gekocht, nicht nur Kaffee gemacht',
      en: 'During festivals there is hot food, not just coffee',
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
