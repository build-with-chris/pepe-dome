// Prisma 7 lädt die .env nicht mehr selbst.
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Seeding newsletters...')

  // Weihnachts-Newsletter
  const weihnachten = await prisma.newsletter.create({
    data: {
      slug: '2024-12-weihnachten',
      subject: '🎄 Frohe Weihnachten vom Pepe Dome!',
      preheader: 'Magische Momente und festliche Shows erwarten dich',
      heroTitle: 'Frohe Weihnachten!',
      heroSubtitle: 'Das Pepe Dome Team wünscht dir zauberhafte Festtage',
      heroCTALabel: 'Alle Shows entdecken',
      heroCTAUrl: 'https://pepedome.de/events',
      status: 'DRAFT',
      introText: 'Liebe Freunde des Pepe Dome,\n\nwas für ein magisches Jahr! Während draußen die Schneeflocken tanzen, blicken wir zurück auf unvergessliche Momente unter unserer Kuppel. Weihnachten ist die Zeit der Wunder – und genau das haben wir gemeinsam erlebt.',
      content: {
        create: [
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Rückblick: Ein Jahr voller Magie',
            sectionDescription: 'Von atemberaubenden Akrobatik-Shows bis hin zu berührenden Premieren – 2024 hat uns unvergessliche Momente beschert. Über 50 Shows, 200 Workshops und tausende strahlende Gesichter. Danke, dass ihr Teil dieser Reise wart!',
            orderPosition: 0,
          },
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Weihnachts-Special: Die große Gala',
            sectionDescription: 'Am 23. und 24. Dezember verwandelt sich der Pepe Dome in ein winterliches Wunderland. Mit Live-Musik, Artistik und einer Prise Weihnachtszauber. Die perfekte Einstimmung auf die Festtage – für die ganze Familie.',
            orderPosition: 1,
          },
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Geschenktipp: Pepe Dome Gutscheine',
            sectionDescription: 'Noch auf der Suche nach dem perfekten Geschenk? Mit einem Pepe Dome Gutschein verschenkst du unvergessliche Erlebnisse. Ob Show-Besuch, Workshop oder Training – für jeden ist etwas dabei.',
            orderPosition: 2,
          },
        ],
      },
    },
  })
  console.log(`Created: ${weihnachten.subject}`)

  // Heilige Drei Könige Newsletter
  const dreiKoenige = await prisma.newsletter.create({
    data: {
      slug: '2025-01-heilige-drei-koenige',
      subject: '👑 Neues Jahr, neue Shows – Januar im Pepe Dome',
      preheader: 'Das neue Jahr startet mit einem Feuerwerk an Programm',
      heroTitle: 'Willkommen 2025!',
      heroSubtitle: 'Ein königlicher Start ins neue Jahr',
      heroCTALabel: 'Januar-Programm ansehen',
      heroCTAUrl: 'https://pepedome.de/events?month=2025-01',
      status: 'DRAFT',
      introText: 'Liebe Pepe Dome Fans,\n\ndie Heiligen Drei Könige haben nicht nur Gold, Weihrauch und Myrrhe im Gepäck – sie bringen auch ein fantastisches Programm für den Januar mit! Das neue Jahr startet durch und wir haben Großes vor.',
      content: {
        create: [
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Neujahrs-Premiere: "Sternenstaub"',
            sectionDescription: 'Unsere brandneue Produktion feiert am 6. Januar Premiere! Eine poetische Reise durch die Nacht, mit Trapez, Tuch und Träumen. Die perfekte Show, um das neue Jahr magisch zu beginnen.',
            orderPosition: 0,
          },
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Workshop-Woche: Zirkus für Einsteiger',
            sectionDescription: 'Vom 8. bis 12. Januar bieten wir unsere beliebte Einsteiger-Woche an. Jonglage, Akrobatik, Trapez – probiere alles aus und entdecke deine verborgenen Talente. Keine Vorkenntnisse nötig!',
            orderPosition: 1,
          },
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Gute Vorsätze? Training im Dome!',
            sectionDescription: 'Der beste Vorsatz für 2025: Mehr Bewegung, mehr Spaß, mehr Pepe Dome! Unsere offenen Trainings starten wieder am 7. Januar. Komm vorbei und schwing dich ins neue Jahr.',
            orderPosition: 2,
          },
        ],
      },
    },
  })
  console.log(`Created: ${dreiKoenige.subject}`)

  // Oster-Newsletter
  const ostern = await prisma.newsletter.create({
    data: {
      slug: '2025-04-ostern',
      subject: '🐰 Oster-Spektakel im Pepe Dome!',
      preheader: 'Frühlingshafte Shows und bunte Überraschungen',
      heroTitle: 'Frohe Ostern!',
      heroSubtitle: 'Der Frühling zieht ein unter die Kuppel',
      heroCTALabel: 'Oster-Programm entdecken',
      heroCTAUrl: 'https://pepedome.de/events?month=2025-04',
      status: 'DRAFT',
      introText: 'Liebe Frühlingsfreunde,\n\ndie ersten Blumen sprießen, die Vögel singen und im Pepe Dome wird es bunt! Ostern steht vor der Tür und wir haben ein ei-nzigartiges Programm für euch vorbereitet. Versteckte Überraschungen inklusive!',
      content: {
        create: [
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Familien-Special: Oster-Zirkus',
            sectionDescription: 'Am Ostersonntag und Ostermontag erwartet euch unser großes Familien-Special. Mit Hasen-Akrobatik, Eier-Jonglage und einer Menge Spaß für Groß und Klein. Jedes Kind erhält eine süße Überraschung!',
            orderPosition: 0,
          },
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Ferienworkshops für Kids',
            sectionDescription: 'In den Osterferien verwandeln sich eure Kinder in kleine Artisten! Unsere Ferienworkshops vom 14. bis 18. April bieten Zirkus-Spaß pur. Von Akrobatik bis Clownerie – hier ist für jeden etwas dabei.',
            orderPosition: 1,
          },
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Frühjahrs-Premiere: "Metamorphose"',
            sectionDescription: 'Wie die Natur erwacht auch unsere neue Show zum Leben! "Metamorphose" erzählt von Verwandlung und Neuanfang – mit spektakulärer Luftakrobatik und poetischen Bildern. Premiere am 25. April.',
            orderPosition: 2,
          },
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Open Air Saison startet!',
            sectionDescription: 'Ab Mai geht es raus! Unsere beliebte Open Air Bühne öffnet wieder. Perfekt für laue Sommerabende unter freiem Himmel. Sichert euch jetzt schon die besten Plätze für die Eröffnungsshow.',
            orderPosition: 3,
          },
        ],
      },
    },
  })
  console.log(`Created: ${ostern.subject}`)

  // Karneval/Fasching Newsletter
  const karneval = await prisma.newsletter.create({
    data: {
      slug: '2025-02-karneval',
      subject: '🎭 Helau und Alaaf – Karneval im Pepe Dome!',
      preheader: 'Kostüme, Konfetti und verrückte Shows',
      heroTitle: 'Pepe Dome Alaaf!',
      heroSubtitle: 'Die fünfte Jahreszeit unter der Kuppel',
      heroCTALabel: 'Karnevals-Programm',
      heroCTAUrl: 'https://pepedome.de/events?month=2025-02',
      status: 'DRAFT',
      introText: 'Liebe Jecken und Narren,\n\ndie närrische Zeit ist da! Im Pepe Dome drehen wir den Spaß auf Maximum. Kostüme sind nicht nur erlaubt, sondern erwünscht. Lasst uns gemeinsam die fünfte Jahreszeit feiern!',
      content: {
        create: [
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Weiberfastnacht: Die große Sause',
            sectionDescription: 'Am Donnerstag geht es los! Unsere legendäre Weiberfastnacht-Party startet um 18 Uhr. Mit DJ, Tanz-Show und jeder Menge Konfetti. Kostüm-Wettbewerb mit tollen Preisen!',
            orderPosition: 0,
          },
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Kinderkarneval am Sonntag',
            sectionDescription: 'Für die kleinen Narren gibt es am Karnevalssonntag ein buntes Programm. Clowns, Zauberer und eine Mini-Disco. Verkleidet euch als eure Lieblingshelden und feiert mit uns!',
            orderPosition: 1,
          },
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Rosenmontags-Special: Cirque du Crazy',
            sectionDescription: 'Unsere verrückteste Show des Jahres! Am Rosenmontag zeigen unsere Artisten, was passiert, wenn Zirkus auf Karneval trifft. Erwarte das Unerwartete – mit einer Prise Wahnsinn.',
            orderPosition: 2,
          },
        ],
      },
    },
  })
  console.log(`Created: ${karneval.subject}`)

  // Sommer-Newsletter
  const sommer = await prisma.newsletter.create({
    data: {
      slug: '2025-07-sommer',
      subject: '☀️ Sommer, Sonne, Pepe Dome!',
      preheader: 'Open Air Shows und heiße Sommernächte',
      heroTitle: 'Sommer im Dome!',
      heroSubtitle: 'Die heißeste Saison des Jahres',
      heroCTALabel: 'Sommer-Highlights',
      heroCTAUrl: 'https://pepedome.de/events?month=2025-07',
      status: 'DRAFT',
      introText: 'Liebe Sonnenanbeter,\n\nder Sommer ist da und wir feiern ihn gebührend! Während tagsüber die Sonne brennt, wird es abends unter der Kuppel erst richtig heiß. Open Air, Festivals und unvergessliche Nächte erwarten euch.',
      content: {
        create: [
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Open Air Festival: 3 Tage Zirkus pur',
            sectionDescription: 'Vom 18. bis 20. Juli verwandelt sich unser Gelände in ein Festival-Paradies. Mit internationalen Artists, Food-Trucks und Camping-Möglichkeit. Das Highlight des Sommers!',
            orderPosition: 0,
          },
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Sommerferien-Camp für Kids',
            sectionDescription: 'Zwei Wochen voller Abenteuer! Unser Sommercamp bietet Zirkus-Training, kreative Workshops und jede Menge Spaß. Perfekt für alle Kinder von 7 bis 14 Jahren.',
            orderPosition: 1,
          },
          {
            contentType: 'CUSTOM_SECTION',
            sectionHeading: 'Mittsommer-Nacht: Die magische Show',
            sectionDescription: 'Am 21. Juni feiern wir die längste Nacht mit einer besonderen Vorstellung. Feuer, Licht und Akrobatik verschmelzen zu einem unvergesslichen Erlebnis. Start: 21 Uhr, Ende: Wenn die Sonne aufgeht.',
            orderPosition: 2,
          },
        ],
      },
    },
  })
  console.log(`Created: ${sommer.subject}`)

  console.log('\n✅ Successfully seeded 5 newsletters with content!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
