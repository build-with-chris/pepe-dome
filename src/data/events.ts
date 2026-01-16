// Utility function to determine if an event is in the past
function getEventEndDate(event: Event): Date {
  // For events with multiple ticket dates, use the latest date
  if (event.ticketDates && event.ticketDates.length > 0) {
    const lastTicketDate = event.ticketDates[event.ticketDates.length - 1];
    const endDate = new Date(lastTicketDate.date);
    // Set to end of day for most events
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  }

  // For Freeman Festival type events with multiple shows, use the latest show date
  if (event.freemanShows && event.freemanShows.length > 0) {
    const lastShow = event.freemanShows[event.freemanShows.length - 1];
    const endDate = new Date(lastShow.date);
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  }

  // For single-day events, use the main event date
  const endDate = new Date(event.date);
  endDate.setHours(23, 59, 59, 999);
  return endDate;
}

// Function to automatically calculate event status based on current date
export function calculateEventStatus(event: Omit<Event, 'status'>): 'upcoming' | 'ongoing' | 'past' {
  const now = new Date();
  const eventEndDate = getEventEndDate(event as Event);

  // Check if event has ended
  if (now > eventEndDate) {
    return 'past';
  }

  // For simplicity, we'll consider all non-past events as upcoming
  // You could add 'ongoing' logic here if needed (e.g., multi-day events currently happening)
  return 'upcoming';
}

export interface Event {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  dateRange: string;
  time?: string;
  price?: string;
  features: Array<{
    icon: string;
    text: string;
  }>;
  category: string;
  color: {
    primary: string;
    secondary: string;
    accent: string;
  };
  emoji: string;
  image?: string;
  video?: string;
  status: 'upcoming' | 'ongoing' | 'past';
  cancelled?: {
    reason: string;
  };
  ticketDates?: Array<{
    date: string;
    dateDisplay: string;
    film?: string;
    ticketUrl: string;
  }>;
  externalTicketUrl?: string;
  ticketsDisabled?: boolean;
  isOneDay?: boolean;
  descriptionPages?: string[]; // Additional description pages for pagination
  freemanShows?: Array<{
    day: string;
    date: string;
    dateDisplay: string;
      shows: Array<{
        time: string;
        title: string;
        description: string;
        ticketUrl: string;
        price: string;
        type?: 'workshop' | 'talk' | 'party';
        talkDetails?: {
          shortDescription: string;
          fullDescription: string;
          topics: string[];
          goal: string;
          participants: Array<{ name: string; role: string }>;
          schedule: Array<{ time: string; activity: string }>;
          themeTables?: Array<{ title: string; moderator: string }>;
          series?: { name: string; description: string; link?: string };
        };
        showDetails?: {
          shortDescription: string;
          fullDescription: string;
          by?: string;
          elements?: string[];
        };
        workshopDetails?: {
          shortDescription: string;
          fullDescription: string;
          by?: string;
          aboutTeacher?: string;
          idealFor?: string;
          whatToBring?: string;
        };
      }>;
  }>;
  combiTickets?: Array<{
    name: string;
    description: string;
    price: string;
    ticketUrl: string;
    savings: string;
  }>;
  sponsorship?: {
    sponsor: {
      name: string;
      logo: string;
      text: string;
    };
    commemoration?: {
      text: string;
      description?: string;
    };
  };
}

// Raw events data without status (will be calculated automatically)
const rawEvents: Omit<Event, 'status'>[] = [
  {
    id: 'circus-meets-cinema',
    title: 'Circus meets Cinema',
    subtitle: 'Artistik & Film in perfekter Symbiose',
    description: 'Ein außergewöhnliches Erlebnis: Artistik-Performance und Kinofilm in perfekter Symbiose. Sängerin Caro und unsere Künstler gestalten den Abend mit Live-Musik und spektakulären Darbietungen, während Sie sich zurücklehnen und einen großartigen Film genießen können.',
    date: '2025-10-10',
    dateRange: '10.–11. OKTOBER 2025',
    time: 'Jeweils 18:30 Uhr',
    price: 'Kinder bis 6 kostenlos • Ermäßigt 8€ • Regulär 15€',
    features: [
      { icon: '🎭', text: 'Artistik-Performance zum Auftakt und als Finale' },
      { icon: '🎵', text: 'Live-Musik zwischen den Darbietungen' },
      { icon: '🎬', text: 'Professionelle Kinoausstattung mit Premium-Sound' },
      { icon: '🍿', text: 'Popcorn, Nachos, Eiskonfekt und Getränke' }
    ],
    category: 'cinema',
    color: {
      primary: 'blue-500',
      secondary: 'blue-400',
      accent: 'blue-300'
    },
    emoji: '🎬',
    image: '/Circus&Cinema.webp',
    ticketDates: [
      {
        date: '2025-10-10',
        dateDisplay: '10. Oktober',
        film: 'Wicki und die starken Männer',
        ticketUrl: 'https://eventfrog.de/de/p/musicals-shows/zirkus/circus-cinema-7378769807640899523.html'
      },
      {
        date: '2025-10-11',
        dateDisplay: '11. Oktober',
        film: 'Ostwind',
        ticketUrl: 'https://eventfrog.de/de/p/musicals-shows/zirkus/circus-cinema-7378772246792262000.html'
      }
    ]
  },
  {
    id: 'wanderzirkus-pepe',
    title: 'Ein Mann, ein Koffer, ein Wandazirkus',
    subtitle: 'Clownerie • Pantomime • Artistik',
    description: 'Der Clown Pepe zaubert eine magische Welt aus seinem Koffer. Pantomime, Artistik und Clownerie für groß und klein. Erzählt werden skurrile Sketche aus dem Alltag eines Clowns der seinen Weg sucht. Sein herzerwärmendes Stolpern zieht alle in seinen Bann. Immer einmal Sonntags im Monat im Pepe Dome.',
    date: '2025-10-12',
    dateRange: '12. OKTOBER 2025',
    time: 'Sonntag',
    price: 'Tickets verfügbar',
    features: [
      { icon: '🤡', text: 'Herzerwärmende Clownerie für alle Altersgruppen' },
      { icon: '🎭', text: 'Pantomime und Artistik aus dem Koffer' },
      { icon: '📅', text: 'Monatliche Aufführungen jeden Sonntag' },
      { icon: '👨‍👩‍👧‍👦', text: 'Perfekt für Familien und Kinder' }
    ],
    category: 'clown',
    color: {
      primary: 'orange-500',
      secondary: 'red-500',
      accent: 'orange-300'
    },
    emoji: '🤡',
    image: '/Entertainment.webp',
    externalTicketUrl: 'https://eventfrog.de/de/p/musicals-shows/zirkus/einmanneinkoffereinwanderzirkus-7378775815528387554.html',
    isOneDay: true
  },
  {
    id: 'circus-poetry-oct-24',
    title: 'Circus & Poetry',
    subtitle: 'Literatur trifft Artistik',
    description: 'Ein poetischer Abend, der Grenzen verschwimmen lässt: Circus & Poetry verbindet klassische Literatur mit moderner Zirkuskunst und schafft ein Erlebnis voller Poesie, Bewegung und Emotion. Gedichte von Rainer Maria Rilke, eine berührende Adaption von Antoine de Saint-Exupéry und eindrucksvolle Artistik von Elefteria und Chris verschmelzen zu einer sinnlichen Gesamtkomposition. Zwischen Worten und Körperkunst entsteht ein Raum, in dem Sprache fliegt und Artistik erzählt. Sigrid Grün, Julian Bellini und Michael Heiduk verleihen den Texten Stimme und Seele, während Elefteria und Chris mit Auszügen aus ihrer aktuellen Kreation die Bühne in einen poetischen Zirkus verwandeln.',
    date: '2025-10-24',
    dateRange: '24. OKTOBER 2025',
    time: '19:00 Uhr',
    price: 'Tickets verfügbar',
    features: [
      { icon: '📖', text: 'Gedichte von Rainer Maria Rilke und Antoine de Saint-Exupéry' },
      { icon: '🎭', text: 'Vorgetragen von Sigrid Grün, Julian Bellini und Michael Heiduk' },
      { icon: '🤸', text: 'Artistik von Elefteria und Chris' },
      { icon: '✨', text: 'Poetische Zirkuskunst voller Bewegung und Emotion' }
    ],
    category: 'performance',
    color: {
      primary: 'violet-500',
      secondary: 'purple-500',
      accent: 'violet-400'
    },
    emoji: '📖',
    image: '/Weiß Beige Kalligraphie Elegant Foto Weihnachtsmarkt Flyer-5.jpg',
    externalTicketUrl: 'https://rausgegangen.de/events/circus-poetry-0/?mtm_campaign=teilen_event&mtm_kwd=app',
    isOneDay: true
  },
  {
    id: 'circus-poetry-oct-25',
    title: 'Circus & Poetry',
    subtitle: 'Literatur trifft Artistik',
    description: 'Ein poetischer Abend, der Grenzen verschwimmen lässt: Circus & Poetry verbindet klassische Literatur mit moderner Zirkuskunst und schafft ein Erlebnis voller Poesie, Bewegung und Emotion. Gedichte von Rainer Maria Rilke, eine berührende Adaption von Antoine de Saint-Exupéry und eindrucksvolle Artistik von Elefteria und Chris verschmelzen zu einer sinnlichen Gesamtkomposition. Zwischen Worten und Körperkunst entsteht ein Raum, in dem Sprache fliegt und Artistik erzählt. Sigrid Grün, Julian Bellini und Michael Heiduk verleihen den Texten Stimme und Seele, während Elefteria und Chris mit Auszügen aus ihrer aktuellen Kreation die Bühne in einen poetischen Zirkus verwandeln.',
    date: '2025-10-25',
    dateRange: '25. OKTOBER 2025',
    time: '19:00 Uhr',
    price: 'Tickets verfügbar',
    features: [
      { icon: '📖', text: 'Gedichte von Rainer Maria Rilke und Antoine de Saint-Exupéry' },
      { icon: '🎭', text: 'Vorgetragen von Sigrid Grün, Julian Bellini und Michael Heiduk' },
      { icon: '🤸', text: 'Artistik von Elefteria und Chris' },
      { icon: '✨', text: 'Poetische Zirkuskunst voller Bewegung und Emotion' }
    ],
    category: 'performance',
    color: {
      primary: 'violet-500',
      secondary: 'purple-500',
      accent: 'violet-400'
    },
    emoji: '📖',
    image: '/Weiß Beige Kalligraphie Elegant Foto Weihnachtsmarkt Flyer-5.jpg',
    externalTicketUrl: 'https://rausgegangen.de/events/circus-poetry-1/',
    isOneDay: true
  },
  {
    id: 'morphe',
    title: 'Morphe',
    subtitle: 'Ein interdisziplinäres performatives Stück',
    description: 'Morphe erforscht den Prozess der persönlichen und kollektiven Resilienz. Inspiriert von Wetterphänomenen, die Landschaften im Laufe der Zeit prägen verbindet dieses Stück Tanz, Akrobatik und Live-Musik zu einer wandelbaren Bühnenlandschaft, in der innere wie äußere Stürme sichtbar werden. Im Zentrum steht die Frage: Was bricht, was biegt sich- und was wächst gestärkt zurück? Die Performer*innen Melanie Old, Jonas Dürrbeck und Leonhard Sedlmeier laden das Publikum ein, Teil dieses Prozesses zu werden. Natur, Klang und Körper verweben sich zu einem immersiven Erlebnis, das die Grenzen zwischen Bühne und Zuschauerraum auflöst und Resilienz als individuellen wie gemeinsamen Akt erfahrbar macht.',
    date: '2025-11-01',
    dateRange: '1.–2. NOVEMBER 2025',
    time: 'Abends',
    price: 'Tickets verfügbar',
    features: [
      { icon: '🌪️', text: 'Interdisziplinäres Stück aus Tanz, Akrobatik und Live-Musik' },
      { icon: '🎭', text: 'Performer*innen: Melanie Old, Jonas Dürrbeck, Leonhard Sedlmeier' },
      { icon: '✨', text: 'Immersives Erlebnis zwischen Bühne und Zuschauerraum' },
      { icon: '🌱', text: 'Exploration von Resilienz und persönlicher Transformation' }
    ],
    category: 'performance',
    color: {
      primary: 'teal-500',
      secondary: 'emerald-500',
      accent: 'teal-400'
    },
    emoji: '🌪️',
    image: '/Morphe.webp',
    ticketDates: [
      {
        date: '2025-11-01',
        dateDisplay: '1. November',
        ticketUrl: 'https://eventfrog.de/de/p/theater-buehne/experimentelles-theater/morphe-7378820788130941548.html'
      },
      {
        date: '2025-11-02',
        dateDisplay: '2. November',
        ticketUrl: 'https://rausgegangen.de/events/morphe-1/'
      }
    ]
  },
  {
    id: 'drag-akrobatik-show',
    title: 'Theater ohne Hausnummer',
    subtitle: 'Drag. Akrobatik. Show.',
    description: '„Theater ohne Hausnummer" kombiniert spektakuläre Artistik mit Drag-Performance und Live-Musik. Eine bunte Mischung aus Witz, Glamour und atemberaubender Akrobatik. Ein Abend, der garantiert anders ist – und Spaß macht.',
    date: '2025-11-08',
    dateRange: '8. NOVEMBER 2025',
    time: '19:00 Uhr',
    price: 'Tickets verfügbar',
    features: [
      { icon: '💃', text: 'Spektakuläre Drag-Performance' },
      { icon: '🤸‍♀️', text: 'Atemberaubende Artistik und Akrobatik' },
      { icon: '🎵', text: 'Live-Musik und Entertainment' },
      { icon: '✨', text: 'Witz, Glamour und Überraschungen' }
    ],
    category: 'performance',
    color: {
      primary: 'pink-500',
      secondary: 'purple-500',
      accent: 'pink-400'
    },
    emoji: '💃',
    image: '/DragArtistik.webp',
    externalTicketUrl: 'https://rausgegangen.de/events/theater-ohne-hausnummer-0/',
    isOneDay: true
  },
  {
    id: 'tshemodan',
    title: 'Tschemodan',
    subtitle: 'Tshemodan – ein musikalischer Zirkus zwischen Heimat & Flucht',
    description: 'Das Ensemble packt den Zirkus buchstäblich aus dem Koffer: Bewegende Akrobatik, Live-Klezmer, Pantomime und persönliche Geschichten verweben sich zu einer Show über Migration, Identität und Zugehörigkeit. Am Ende wird alles wieder eingepackt – mit der Botschaft: Die Reise geht weiter.',
    date: '2025-11-09',
    dateRange: '9.–10. NOVEMBER 2025',
    time: '18:00 Uhr',
    price: 'Tickets verfügbar',
    features: [
      { icon: '🎪', text: 'Bewegende Akrobatik aus dem Koffer' },
      { icon: '🎵', text: 'Live-Klezmer-Musik' },
      { icon: '🎭', text: 'Pantomime und persönliche Geschichten' },
      { icon: '🌍', text: 'Themen: Migration, Identität und Zugehörigkeit' }
    ],
    category: 'performance',
    color: {
      primary: 'emerald-500',
      secondary: 'teal-500',
      accent: 'emerald-400'
    },
    emoji: '🎪',
    image: '/Tsirk.webp',
    ticketDates: [
      {
        date: '2025-11-09',
        dateDisplay: '9. November',
        ticketUrl: 'https://rausgegangen.de/events/tschemodan-tsirk-dobranotch-0/'
      },
      {
        date: '2025-11-10',
        dateDisplay: '10. November',
        ticketUrl: 'https://rausgegangen.de/events/tschemodan-tsirk-dobranotch-1/'
      }
    ],
    sponsorship: {
      sponsor: {
        name: 'Kuszner-Stiftung',
        logo: '/Stiftung.jpg',
        text: 'Gefördert durch die Kuszner-Stiftung'
      },
      commemoration: {
        text: 'Zum Gedenken an die Reichsprogromnacht',
        description: 'Diese Aufführung findet in Erinnerung an die Reichspogromnacht vom 9. November 1938 statt.'
      }
    }
  },
  {
    id: 'samhain-circus-madness',
    title: 'Samhain Circus Madness',
    subtitle: 'Halloween Zirkusnacht',
    description: 'Tritt ein in eine magische Nacht voller schaurig-schöner Zirkusmomente! Erlebe leuchtende Luftartistik, geheimnisvolle Shows und überraschende Begegnungen aus einer anderen Welt. Unsere Künstler*innen nehmen dich mit auf eine Reise zwischen Leben und Tod – wo Hexen fliegen, Schatten tanzen und der Schleier zur Anderswelt dünn wird. Kostüme sind willkommen, aber kein Muss – bring einfach gute Laune und Halloween-Spirit mit und feiere eine Nacht, die du nicht vergisst!',
    date: '2025-10-31',
    dateRange: '31. OKTOBER 2025',
    time: 'Einlass: 18:30 Uhr | Showbeginn: 19:00 Uhr',
    price: 'Erwachsene 10€ • Kinder (6-12 Jahre) 7€ • Kinder unter 6 kostenlos',
    features: [
      { icon: '🎃', text: 'Magische Halloween-Zirkusnacht' },
      { icon: '✨', text: 'Leuchtende Luftartistik und geheimnisvolle Shows' },
      { icon: '🦇', text: 'Eine Reise zwischen Leben und Tod' },
      { icon: '🕸️', text: 'Kostüme willkommen – Halloween-Spirit garantiert!' }
    ],
    category: 'event',
    color: {
      primary: 'orange-500',
      secondary: 'purple-500',
      accent: 'orange-400'
    },
    emoji: '🎃',
    image: '/Samhain-Circus-Madness.jpeg',
    externalTicketUrl: 'https://rausgegangen.de/events/samhain-circus-madness-0/',
    isOneDay: true
  },
  {
    id: 'freeman-festival',
    title: 'Freeman',
    subtitle: 'Festival der Artistik',
    description: 'Internationale Spitzen-Artist:innen zeigen Akrobatik und Entertainment auf Weltklasse-Niveau. 5 Shows • 3 Tage • Höchstleistung trifft Poesie in der einzigartigen Atmosphäre des Pepe Dome.',
    date: '2025-11-14',
    dateRange: '14.–16. NOVEMBER 2025',
    time: '3 Tage Festival',
    price: 'Ermäßigt 12€, Regulär 18€ • Kombitickets verfügbar',
    features: [
      { icon: '🎭', text: 'Internationale Spitzen-Artist:innen' },
      { icon: '🌍', text: 'Acts aus Skandinavien und dem Baltikum' },
      { icon: '🏛️', text: '5 Shows an 3 Tagen' },
      { icon: '🎫', text: 'Einzeltickets & Kombitickets' }
    ],
    category: 'festival',
    color: {
      primary: 'purple-500',
      secondary: 'blue-500',
      accent: 'purple-400'
    },
    emoji: '🎪',
    image: '/Freeman-Poster.webp',
    externalTicketUrl: 'https://www.freemanfestival.de/tickets',
    freemanShows: [
      {
        day: 'Freitag',
        date: '2025-11-14',
        dateDisplay: '14. November',
        shows: [
          {
            time: '15:00',
            title: 'Workshop „Object Manipulation"',
            description: 'Mit Merri Heikkilä • Alltagsgegenstände als Requisiten, Form, Bewegung, Rhythmus • Ca. 2 Stunden, englisch',
            ticketUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdV55BqdgNW9xKmdD3vps10RfW9luBzKtM6JCNSChOuojFNbg/viewform',
            price: 'Workshop-Anmeldung',
            type: 'workshop',
            workshopDetails: {
              shortDescription: 'Mit Merri Heikkilä • Alltagsgegenstände als Requisiten, Form, Bewegung, Rhythmus • Ca. 2 Stunden, englisch',
              fullDescription: 'Dieser Workshop konzentriert sich auf die Verwendung von Alltagsgegenständen als Jonglier-Requisiten und bietet eine andere Perspektive auf Objektmanipulation. Durch geführte Erkundung experimentieren die Teilnehmer:innen mit Form, Bewegung und Rhythmus, indem sie Gegenstände aus dem täglichen Leben verwenden. Die Session fördert einen durchdachten und kreativen Ansatz zum Jonglieren, mit Schwerpunkt auf Beobachtung, Anpassungsfähigkeit und dem Finden neuer Möglichkeiten in vertrauten Dingen.',
              by: 'Merri Heikkilä',
              aboutTeacher: 'Merri Heikkilä ist ein Jongleur und Zirkuskünstler, der hauptsächlich mit zeitgenössischem Zirkus arbeitet. Merri schloss 2017 sein Studium an der Codarts in Rotterdam mit einem Bachelor-Abschluss in Zirkuskunst ab und war an der Gründung zweier neuer Zirkusgruppen beteiligt: Sirkum Polaris und The Nordic Council. Zusätzlich arbeitet er in verschiedenen Werken und Veranstaltungen der Zirkuskompanie Nuua. In seiner Arbeit verwendet Merri neben Objektmanipulation und Akrobatik oft auch die Werkzeuge des physischen Theaters, um einzigartige Erfahrungen für das Publikum zu schaffen.',
              idealFor: 'Zeitgenössische Zirkuskünstler:innen, Jongleur:innen und Bewegungspraktiker:innen, die sich für Objektmanipulation, kreative Erkundung und interdisziplinäre Experimente interessieren.',
              whatToBring: 'Dein Lieblings-Alltagsgegenstand.'
            }
          },
          {
            time: '19:00',
            title: 'Show „Häppy Hour"',
            description: 'The Nordic Council • Zeitgenössischer Zirkus × Comedy, Humor über Alltag & Ambivalenz',
            ticketUrl: 'https://www.freemanfestival.de/tickets',
            price: 'Ermäßigt 12€, Regulär 18€',
            showDetails: {
              shortDescription: 'The Nordic Council • Zeitgenössischer Zirkus × Comedy, Humor über Alltag & Ambivalenz',
              fullDescription: 'Häppy Hour ist eine Ode an den tiefen, dunklen Norden und seine soziale Kultur. Die Show beschäftigt sich mit der widersprüchlichen Beziehung zum Alkohol und erkundet die seltsamen und peinlichen Erfahrungen, die das nordische Nachtleben zu bieten hat.\n\nDurch die Linse des zeitgenössischen Zirkus und der Comedy interpretiert, nähert sich Häppy Hour realen Lebenssituationen durch unbeholfenen Humor und zeigt, dass die Dinge nicht immer so ernst sind und dass es in Ordnung ist, über uns selbst zu lachen, selbst in unseren schlimmsten Momenten.\n\nDurch die Kombination von Jonglage und Aerial Rope mit physischem Theater und Live-Musik schafft The Nordic Council Szenen zu diesen Themen, die beim Publikum ein Gefühl der Selbstwiedererkennung hervorrufen. "Wir waren alle schon mal da" ist ein Gefühl, das die Aufführung durchdringt, während das Trio sich durch die Höhen und Tiefen des nordischen Nachtlebens stolpert.',
              by: 'The Nordic Council',
              elements: ['Jonglage', 'Aerial Rope', 'Physisches Theater', 'Live-Musik']
            }
          }
        ]
      },
      {
        day: 'Samstag',
        date: '2025-11-15',
        dateDisplay: '15. November',
        shows: [
          {
            time: '14:00',
            title: 'ZEIT ZUM REDEN – Talk zur Zukunft des zeitgenössischen Zirkus',
            description: 'Offenes Gespräch über die Zukunft des zeitgenössischen Zirkus mit Künstler:innen, Veranstalter:innen und kulturpolitischen Vertreter:innen.',
            ticketUrl: '/kontakt#kontaktformular',
            price: 'Kostenlos',
            type: 'talk',
            talkDetails: {
              shortDescription: 'Offenes Gespräch über die Zukunft des zeitgenössischen Zirkus mit Künstler:innen, Veranstalter:innen und kulturpolitischen Vertreter:innen.',
              fullDescription: 'Im Rahmen des Festivals „Zeit für Zirkus" lädt der Bundesverband Zeitgenössischer Zirkus (BUZZ) zu einem offenen Gespräch über die Zukunft des zeitgenössischen Zirkus ein.\n\nIn München wächst die Szene stetig, doch es fehlt noch immer an fairen Zugängen zu Förderungen, Spielstätten und Produktionsmöglichkeiten. Der Talk bietet Raum, um genau darüber zu sprechen – gemeinsam mit Künstlerinnen, Veranstalterinnen und kulturpolitischen Vertreter*innen.',
              topics: [
                'Welche Rolle spielt der freie Zirkus in der bayerischen Kulturlandschaft?',
                'Wie kann seine Sichtbarkeit und finanzielle Stabilität gestärkt werden?',
                'Welche Strukturen und Netzwerke braucht es, um nachhaltig zu wachsen?'
              ],
              goal: 'Ein ehrlicher Austausch über Herausforderungen und Chancen – um Verbindungen zu schaffen, Allianzen zu fördern und neue Perspektiven für die Kunstform zu eröffnen.',
              participants: [
                { name: 'Sanne Kurz', role: 'MdL, Bündnis 90/Die Grünen' },
                { name: 'Walter Heun', role: 'NPN, BLZT, SK3' },
                { name: 'Anke Politz', role: 'BUZZ, Chamäleon Theater Berlin' },
                { name: 'Michael Heiduk', role: 'Vertreter Münchner Szene' }
              ],
              schedule: [
                { time: '14:00', activity: 'Kurzer Einblick in die Münchner Zirkusszene' },
                { time: '14:15', activity: '30-minütiges moderiertes Gespräch zu Lage, Bedarfen und Zukunftsperspektiven' },
                { time: '14:45', activity: 'Offener Austausch an Thementischen' }
              ],
              themeTables: [
                { title: 'Interessenvertretung', moderator: 'Anke Politz' },
                { title: 'Bedarfe der Münchner Szene', moderator: 'Michael Heiduk' },
                { title: 'Netzwerke und Strukturen für den Zeitgenössischen Zirkus', moderator: 'Walter Heun' }
              ],
              series: {
                name: 'ZEIT ZUM REDEN',
                description: 'Teil des bundesweiten Formats „Zeit für Zirkus", gefördert durch den Fonds Darstellende Künste, in Kooperation mit führenden Häusern für zeitgenössischen Zirkus in Deutschland.',
                link: 'https://zeitfuerzirkus.de'
              }
            }
          },
          {
            time: '18:00',
            title: 'Show „Häppy Hour"',
            description: 'The Nordic Council • Zeitgenössischer Zirkus × Comedy • Zweite Aufführung',
            ticketUrl: 'https://www.freemanfestival.de/tickets',
            price: 'Ermäßigt 12€, Regulär 18€',
            showDetails: {
              shortDescription: 'The Nordic Council • Zeitgenössischer Zirkus × Comedy • Zweite Aufführung',
              fullDescription: 'Häppy Hour ist eine Ode an den tiefen, dunklen Norden und seine soziale Kultur. Die Show beschäftigt sich mit der widersprüchlichen Beziehung zum Alkohol und erkundet die seltsamen und peinlichen Erfahrungen, die das nordische Nachtleben zu bieten hat.\n\nDurch die Linse des zeitgenössischen Zirkus und der Comedy interpretiert, nähert sich Häppy Hour realen Lebenssituationen durch unbeholfenen Humor und zeigt, dass die Dinge nicht immer so ernst sind und dass es in Ordnung ist, über uns selbst zu lachen, selbst in unseren schlimmsten Momenten.\n\nDurch die Kombination von Jonglage und Aerial Rope mit physischem Theater und Live-Musik schafft The Nordic Council Szenen zu diesen Themen, die beim Publikum ein Gefühl der Selbstwiedererkennung hervorrufen. "Wir waren alle schon mal da" ist ein Gefühl, das die Aufführung durchdringt, während das Trio sich durch die Höhen und Tiefen des nordischen Nachtlebens stolpert.',
              by: 'The Nordic Council',
              elements: ['Jonglage', 'Aerial Rope', 'Physisches Theater', 'Live-Musik']
            }
          },
          {
            time: '20:30',
            title: 'Show „How a Spiral Works"',
            description: 'Art for Rainy Days • Meditativer, hypnotischer Zirkus mit Tanz, Hair Hanging & Aerial Rope • Minimalistische Ästhetik mit neu interpretierter baltischer Volksmusik',
            ticketUrl: 'https://www.freemanfestival.de/tickets',
            price: 'Ermäßigt 12€, Regulär 18€',
            showDetails: {
              shortDescription: 'Art for Rainy Days • Meditativer, hypnotischer Zirkus mit Tanz, Hair Hanging & Aerial Rope • Minimalistische Ästhetik mit neu interpretierter baltischer Volksmusik',
              fullDescription: 'Es ist eine kraftvolle und hypnotische Erkundung der Fürsorge unter Druck. Wie kümmern wir uns um uns selbst – und einander – wenn alles um uns herum außer Kontrolle gerät? Wie sieht Mitgefühl aus in großen Höhen, mitten im Sturm oder wenn Schmerz in den Körper kriecht?\n\nIn diesem intimen Duett sind eine Tänzerin, eine Aerialistin und ein Seil in einer sich ständig entwickelnden Beziehung miteinander verbunden. Ihre Bewegungen umkreisen sich in einer zarten Choreografie aus Vertrauen, Widerstand und Loslassen. Sie hängen, drehen sich, stützen und reagieren – aneinander gebunden in einer physischen und emotionalen Spirale.\n\nDurch die Verbindung von Hair Hanging, Aerial Rope, zeitgenössischem Tanz und eindringlich neu interpretierter baltischer Volksmusik ist "How A Spiral Works" ein poetischer Akt der Fürsorge und des Widerstands.\n\nGeschaffen vom renommierten britischen Regisseur Jason Dupree, der lettischen Choreografin Alise Madara Bokaldere und der außergewöhnlichen litauischen Aerialistin Izabele Kuzelyte. Mit ihrer Debüt-Performance haben sie einen resonanten Akkord in der zeitgenössischen Szene getroffen und wir sind stolz, Teil ihrer umfangreichen Europatournee zu sein.',
              by: 'Art for Rainy Days',
              elements: ['Hair Hanging', 'Aerial Rope', 'Zeitgenössischer Tanz', 'Baltische Volksmusik']
            }
          },
          {
            time: '21:45',
            title: 'Party',
            description: 'Veranstaltung nach den Shows mit Musik, Austausch und guter Stimmung',
            ticketUrl: '',
            price: 'Kostenlos',
            type: 'party'
          }
        ]
      },
      {
        day: 'Sonntag',
        date: '2025-11-16',
        dateDisplay: '16. November',
        shows: [
          {
            time: '13:00',
            title: 'Workshop „Stillness in Motion"',
            description: 'Mit Alise Madara Bokaldere • Stille & Bewegung, Bühnenpräsenz, Ausdruck jenseits der Disziplinen • Ca. 2 Stunden, englisch, max. 20 Teilnehmer:innen',
            ticketUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeg-YUt_aatNtb-iiIZKerZ1kviJRl3U61WLPsA4ROncrrV5g/viewform',
            price: 'Workshop-Anmeldung',
            type: 'workshop',
            workshopDetails: {
              shortDescription: 'Mit Alise Madara Bokaldere • Stille & Bewegung, Bühnenpräsenz, Ausdruck jenseits der Disziplinen • Ca. 2 Stunden, englisch, max. 20 Teilnehmer:innen',
              fullDescription: '"Stillness in Motion" erkundet den wirkungsvollen Einsatz von Stille – nicht nur als Grundlage für Bewegung, sondern auch als Technik zur Verbesserung der Bühnenpräsenz. Wir werden uns mit Bewegung sowohl innerhalb als auch außerhalb unserer jeweiligen Disziplinen beschäftigen, sodass du grundlegende Prinzipien entdecken und später in deine eigene künstlerische Praxis einbeziehen kannst. In vielen Kunstformen spielt Stille eine entscheidende Rolle – Musik wird durch Pausen verstärkt, Worte benötigen Räume, um verständlich zu sein, und Bewegung funktioniert ähnlich. Das Vergessen anzuhalten nimmt uns die Fähigkeit, uns auf die Bewegung zu konzentrieren.',
              by: 'Alise Madara Bokaldere',
              aboutTeacher: 'Alise Madara Bokaldere ist eine lettische Tänzerin und Choreografin. Sie arbeitet sehr eng mit Details und nuancierten Bewegungen in ihren Kreationen und konzentriert sich auf Performance-Präsenz, Bewegungsqualität und Konzept. Sie schloss 2018 ihr Studium an der Lettischen Kultur-Akademie mit einem BA in zeitgenössischem Tanz ab. Sie wurde 2024 mit dem Titel Beste Zeitgenössische Tänzerin bei den Lettischen Tanzpreisen ausgezeichnet.',
              idealFor: 'Dieser Workshop richtet sich an Tänzer:innen und Zirkus-Performer:innen, einschließlich Akrobat:innen, Aerialist:innen und Jongleur:innen, die neue Dimensionen des Ausdrucks durch den disziplinierten Einsatz von Stille und Präsenz erkunden möchten. Geeignet auch für Choreograf:innen und Regisseur:innen, die ihr Werkzeug erweitern und Konzepte der Stille erkunden möchten.',
              whatToBring: 'Teilnehmer:innen sollten Kleidung tragen, die uneingeschränkte Bewegung ermöglicht, Wasser zum Trinken mitbringen und Notizbücher und Stifte zum Festhalten wichtiger Erkenntnisse und Inspirationen während der Diskussionen mitbringen.'
            }
          },
          {
            time: '18:00',
            title: 'Show „How a Spiral Works"',
            description: 'Art for Rainy Days • Meditativer, hypnotischer Zirkus • Wiederholung der Show vom Samstag',
            ticketUrl: 'https://www.freemanfestival.de/tickets',
            price: 'Ermäßigt 12€, Regulär 18€',
            showDetails: {
              shortDescription: 'Art for Rainy Days • Meditativer, hypnotischer Zirkus • Wiederholung der Show vom Samstag',
              fullDescription: 'Es ist eine kraftvolle und hypnotische Erkundung der Fürsorge unter Druck. Wie kümmern wir uns um uns selbst – und einander – wenn alles um uns herum außer Kontrolle gerät? Wie sieht Mitgefühl aus in großen Höhen, mitten im Sturm oder wenn Schmerz in den Körper kriecht?\n\nIn diesem intimen Duett sind eine Tänzerin, eine Aerialistin und ein Seil in einer sich ständig entwickelnden Beziehung miteinander verbunden. Ihre Bewegungen umkreisen sich in einer zarten Choreografie aus Vertrauen, Widerstand und Loslassen. Sie hängen, drehen sich, stützen und reagieren – aneinander gebunden in einer physischen und emotionalen Spirale.\n\nDurch die Verbindung von Hair Hanging, Aerial Rope, zeitgenössischem Tanz und eindringlich neu interpretierter baltischer Volksmusik ist "How A Spiral Works" ein poetischer Akt der Fürsorge und des Widerstands.\n\nGeschaffen vom renommierten britischen Regisseur Jason Dupree, der lettischen Choreografin Alise Madara Bokaldere und der außergewöhnlichen litauischen Aerialistin Izabele Kuzelyte. Mit ihrer Debüt-Performance haben sie einen resonanten Akkord in der zeitgenössischen Szene getroffen und wir sind stolz, Teil ihrer umfangreichen Europatournee zu sein.',
              by: 'Art for Rainy Days',
              elements: ['Hair Hanging', 'Aerial Rope', 'Zeitgenössischer Tanz', 'Baltische Volksmusik']
            }
          }
        ]
      }
    ]
  },
  {
    id: 'sharing-is-caring',
    title: 'Niklo Performance',
    subtitle: 'Ein Tag voller Kreativität, Bewegung und Geschichten',
    description: 'Gemeinsam falten, staunen und lauschen: Vom kunstvollen Origami über eine mitreißende Niklo-Performance bis hin zu Feuer-Tee-Geschichten am Abend – hier dreht sich alles ums Teilen. Ob Ideen, Kunst oder Momente – geteilt wird, was Freude macht. Ein Tag im warmen Licht des Pepe Domes voller Gemeinschaft und Kreativität.',
    date: '2025-12-06',
    dateRange: '6. DEZEMBER 2025',
    time: 'Ab 16:30 Uhr',
    price: 'Tickets verfügbar',
    features: [
      { icon: '🎨', text: 'Origami-Workshop um 16:30 Uhr' },
      { icon: '🎭', text: 'Niklo-Performance um 17:30 Uhr' },
      { icon: '🔥', text: 'Feuer-Tee-Geschichten um 19:00 Uhr' },
      { icon: '💬', text: 'Themen: Gemeinschaft, Teilen, Kreativität' }
    ],
    category: 'event',
    color: {
      primary: 'amber-500',
      secondary: 'yellow-500',
      accent: 'amber-400'
    },
    emoji: '🎪',
    image: '/sharing-is-caring.webp',
    externalTicketUrl: 'https://rausgegangen.de/events/niclo-circus-0/',
    isOneDay: true
  },
  {
    id: 'open-stage-dec-09',
    title: 'Rhapsodie du soir',
    subtitle: 'Moderiert von Oles Koval',
    description: 'Eine bunte Mischung voller Vielfalt, Spaß und Unterhaltung: Magic, Drag, Acting, Acrobatics, Music, Poetry und das Unerwartete. Ein Abend, der alle Sinne anspricht und garantiert für Überraschungen sorgt.',
    date: '2025-12-09',
    dateRange: '9. DEZEMBER 2025',
    time: '19:00 Uhr',
    price: 'Tickets verfügbar',
    features: [
      { icon: '🎤', text: 'Moderiert von Oles Koval' },
      { icon: '🎩', text: 'Magic & das Unerwartete' },
      { icon: '💃', text: 'Drag, Acting & Performance' },
      { icon: '🤸', text: 'Acrobatics, Music & Poetry' }
    ],
    category: 'performance',
    color: {
      primary: 'fuchsia-500',
      secondary: 'pink-500',
      accent: 'fuchsia-400'
    },
    emoji: '🎭',
    image: '/OpenStage Pepe.webp',
    externalTicketUrl: 'https://rausgegangen.de/events/rhapsodie-du-soir-0/',
    isOneDay: true
  },
  {
    id: 'open-stage-dec-16',
    title: 'Rhapsodie du soir',
    subtitle: 'Moderiert von Oles Koval',
    description: 'Eine bunte Mischung voller Vielfalt, Spaß und Unterhaltung: Magic, Drag, Acting, Acrobatics, Music, Poetry und das Unerwartete. Ein Abend, der alle Sinne anspricht und garantiert für Überraschungen sorgt.',
    date: '2025-12-16',
    dateRange: '16. DEZEMBER 2025',
    time: '19:00 Uhr',
    price: 'Tickets verfügbar',
    features: [
      { icon: '🎤', text: 'Moderiert von Oles Koval' },
      { icon: '🎩', text: 'Magic & das Unerwartete' },
      { icon: '💃', text: 'Drag, Acting & Performance' },
      { icon: '🤸', text: 'Acrobatics, Music & Poetry' }
    ],
    category: 'performance',
    color: {
      primary: 'fuchsia-500',
      secondary: 'pink-500',
      accent: 'fuchsia-400'
    },
    emoji: '🎭',
    image: '/OpenStage Pepe.webp',
    externalTicketUrl: 'https://rausgegangen.de/events/rhapsodie-du-soir-1/',
    isOneDay: true,
    cancelled: {
      reason: 'Wegen Verletzung und Krankheit abgesagt'
    }
  },
  {
    id: 'open-stage-dec-19',
    title: 'Rhapsodie du soir',
    subtitle: 'Moderiert von Oles Koval',
    description: 'Eine bunte Mischung voller Vielfalt, Spaß und Unterhaltung: Magic, Drag, Acting, Acrobatics, Music, Poetry und das Unerwartete. Ein Abend, der alle Sinne anspricht und garantiert für Überraschungen sorgt.',
    date: '2025-12-19',
    dateRange: '19. DEZEMBER 2025',
    time: '19:00 Uhr',
    price: 'Tickets verfügbar',
    features: [
      { icon: '🎤', text: 'Moderiert von Oles Koval' },
      { icon: '🎩', text: 'Magic & das Unerwartete' },
      { icon: '💃', text: 'Drag, Acting & Performance' },
      { icon: '🤸', text: 'Acrobatics, Music & Poetry' }
    ],
    category: 'performance',
    color: {
      primary: 'fuchsia-500',
      secondary: 'pink-500',
      accent: 'fuchsia-400'
    },
    emoji: '🎭',
    image: '/OpenStage Pepe.webp',
    externalTicketUrl: 'https://rausgegangen.de/events/rhapsodie-du-soir-2/',
    isOneDay: true
  },
  {
    id: 'zirkus-artista-emotion-dec-03',
    title: 'Zirkus Artista',
    subtitle: 'eMOTION – Moderner Zirkus trifft Streamingkultur',
    description: 'Begleitet die beiden aufstrebenden Streamer Jonas und Max dabei, wie sie ihren Kanal „eMOTION" zu immer mehr Followern bringen. Der wichtigste Anker dafür sind ihre treuen Follower, die „Motionies". Mit dieser Community veranstalten sie Videowettbewerbe, lassen sich von ihnen waghalsige Challenges stellen und beantworten alle Nachrichten ihrer Fans. Auch fragwürdige Essensaufgaben dürfen im Stream nie fehlen. Im Kampf um die Aufmerksamkeit des Publikums kann dabei auch auf Let´s Plays und sogar NPC-Streams zurückgegriffen werden. Was soll bei diesem Arsenal an guter Laune noch schiefgehen? eMOTION ist ein modernes Zirkustheaterstück, in dem Artistik, Comedy und Live-Musik zu einer beeindruckenden und unterhaltsamen Performance verschmelzen. Dabei wird mit dauerhaftem Bezug auf moderne Influencer und Streamer die digitale Welt auf der Bühne zurück in die analoge Welt gebracht und einer neuen Sichtweise ausgesetzt.',
    date: '2025-12-03',
    dateRange: '3. DEZEMBER 2025',
    time: 'Abends',
    price: 'Tickets verfügbar',
    features: [
      { icon: '🎪', text: 'Artistik, Comedy und Live-Musik' },
      { icon: '📱', text: 'Moderne Streamingkultur trifft Zirkuskunst' },
      { icon: '🎭', text: 'Mit Jonas Bolliger, Lea Reichel, Max Kuschmierz, Rebecca Neubauer, Max Heckl und Carina Hechenberger' },
      { icon: '🎬', text: 'Regie: Max Heckl • Produzent: Jan Schaarschmidt' }
    ],
    category: 'performance',
    color: {
      primary: 'cyan-500',
      secondary: 'blue-500',
      accent: 'cyan-400'
    },
    emoji: '🎪',
    image: '/ZirkusArtista.webp',
    externalTicketUrl: 'https://rausgegangen.de/events/zirkus-artista-emotion-0/',
    isOneDay: true
  },
  {
    id: 'zirkus-artista-emotion-dec-10',
    title: 'Zirkus Artista',
    subtitle: 'eMOTION – Moderner Zirkus trifft Streamingkultur',
    description: 'Begleitet die beiden aufstrebenden Streamer Jonas und Max dabei, wie sie ihren Kanal „eMOTION" zu immer mehr Followern bringen. Der wichtigste Anker dafür sind ihre treuen Follower, die „Motionies". Mit dieser Community veranstalten sie Videowettbewerbe, lassen sich von ihnen waghalsige Challenges stellen und beantworten alle Nachrichten ihrer Fans. Auch fragwürdige Essensaufgaben dürfen im Stream nie fehlen. Im Kampf um die Aufmerksamkeit des Publikums kann dabei auch auf Let´s Plays und sogar NPC-Streams zurückgegriffen werden. Was soll bei diesem Arsenal an guter Laune noch schiefgehen? eMOTION ist ein modernes Zirkustheaterstück, in dem Artistik, Comedy und Live-Musik zu einer beeindruckenden und unterhaltsamen Performance verschmelzen. Dabei wird mit dauerhaftem Bezug auf moderne Influencer und Streamer die digitale Welt auf der Bühne zurück in die analoge Welt gebracht und einer neuen Sichtweise ausgesetzt.',
    date: '2025-12-10',
    dateRange: '10. DEZEMBER 2025',
    time: 'Abends',
    price: 'Tickets verfügbar',
    features: [
      { icon: '🎪', text: 'Artistik, Comedy und Live-Musik' },
      { icon: '📱', text: 'Moderne Streamingkultur trifft Zirkuskunst' },
      { icon: '🎭', text: 'Mit Jonas Bolliger, Lea Reichel, Max Kuschmierz, Rebecca Neubauer, Max Heckl und Carina Hechenberger' },
      { icon: '🎬', text: 'Regie: Max Heckl • Produzent: Jan Schaarschmidt' }
    ],
    category: 'performance',
    color: {
      primary: 'cyan-500',
      secondary: 'blue-500',
      accent: 'cyan-400'
    },
    emoji: '🎪',
    image: '/ZirkusArtista.webp',
    externalTicketUrl: 'https://rausgegangen.de/events/zirkus-artista-emotion-1/',
    isOneDay: true
  },
  {
    id: 'circus-poetry-dec-27',
    title: 'Circus & Poetry',
    subtitle: 'Literatur trifft Artistik',
    description: 'Ein poetischer Abend, der Grenzen verschwimmen lässt: Circus & Poetry verbindet klassische Literatur mit moderner Zirkuskunst und schafft ein Erlebnis voller Poesie, Bewegung und Emotion. Gedichte von Rainer Maria Rilke, eine berührende Adaption von Antoine de Saint-Exupéry und eindrucksvolle Artistik von Elefteria und Chris verschmelzen zu einer sinnlichen Gesamtkomposition. Zwischen Worten und Körperkunst entsteht ein Raum, in dem Sprache fliegt und Artistik erzählt. Sigrid Grün, Julian Bellini und Michael Heiduk verleihen den Texten Stimme und Seele, während Elefteria und Chris mit Auszügen aus ihrer aktuellen Kreation die Bühne in einen poetischen Zirkus verwandeln.',
    date: '2025-12-27',
    dateRange: '27. DEZEMBER 2025',
    time: 'Einlass 18:30 Uhr • Beginn 19:00 Uhr',
    price: 'Tickets verfügbar',
    features: [
      { icon: '📖', text: 'Gedichte von Rainer Maria Rilke und Antoine de Saint-Exupéry' },
      { icon: '🎭', text: 'Vorgetragen von Sigrid Grün, Julian Bellini und Michael Heiduk' },
      { icon: '🤸', text: 'Artistik von Elefteria und Chris' },
      { icon: '✨', text: 'Poetische Zirkuskunst voller Bewegung und Emotion' }
    ],
    category: 'performance',
    color: {
      primary: 'violet-500',
      secondary: 'purple-500',
      accent: 'violet-400'
    },
    emoji: '📖',
    image: '/Circus & Poetry 2.webp',
    externalTicketUrl: 'https://rausgegangen.de/events/circus-poetry-2/',
    isOneDay: true
  },
  {
    id: 'circus-poetry-dec-28',
    title: 'Circus & Poetry',
    subtitle: 'Literatur trifft Artistik',
    description: 'Ein poetischer Abend, der Grenzen verschwimmen lässt: Circus & Poetry verbindet klassische Literatur mit moderner Zirkuskunst und schafft ein Erlebnis voller Poesie, Bewegung und Emotion. Gedichte von Rainer Maria Rilke, eine berührende Adaption von Antoine de Saint-Exupéry und eindrucksvolle Artistik von Elefteria und Chris verschmelzen zu einer sinnlichen Gesamtkomposition. Zwischen Worten und Körperkunst entsteht ein Raum, in dem Sprache fliegt und Artistik erzählt. Sigrid Grün, Julian Bellini und Michael Heiduk verleihen den Texten Stimme und Seele, während Elefteria und Chris mit Auszügen aus ihrer aktuellen Kreation die Bühne in einen poetischen Zirkus verwandeln.',
    date: '2025-12-28',
    dateRange: '28. DEZEMBER 2025',
    time: 'Einlass 18:30 Uhr • Beginn 19:00 Uhr',
    price: 'Tickets verfügbar',
    features: [
      { icon: '📖', text: 'Gedichte von Rainer Maria Rilke und Antoine de Saint-Exupéry' },
      { icon: '🎭', text: 'Vorgetragen von Sigrid Grün, Julian Bellini und Michael Heiduk' },
      { icon: '🤸', text: 'Artistik von Elefteria und Chris' },
      { icon: '✨', text: 'Poetische Zirkuskunst voller Bewegung und Emotion' }
    ],
    category: 'performance',
    color: {
      primary: 'violet-500',
      secondary: 'purple-500',
      accent: 'violet-400'
    },
    emoji: '📖',
    image: '/Circus & Poetry 2.webp',
    externalTicketUrl: 'https://rausgegangen.de/events/circus-poetry-2/',
    isOneDay: true
  },
  {
    id: 'circus-poetry-sep',
    title: 'Circus & Poetry',
    subtitle: 'Literatur trifft Artistik',
    description: 'Ein poetischer Abend, der Grenzen verschwimmen lässt: Circus & Poetry verbindet klassische Literatur mit moderner Zirkuskunst und schafft ein Erlebnis voller Poesie, Bewegung und Emotion. Gedichte von Rainer Maria Rilke, eine berührende Adaption von Antoine de Saint-Exupéry und eindrucksvolle Artistik von Elefteria und Chris verschmelzen zu einer sinnlichen Gesamtkomposition. Zwischen Worten und Körperkunst entsteht ein Raum, in dem Sprache fliegt und Artistik erzählt. Sigrid Grün, Julian Bellini und Michael Heiduk verleihen den Texten Stimme und Seele, während Elefteria und Chris mit Auszügen aus ihrer aktuellen Kreation die Bühne in einen poetischen Zirkus verwandeln.',
    date: '2025-09-28',
    dateRange: '28. SEPTEMBER 2025',
    time: 'Einlass 18:30 Uhr • Beginn 19:00 Uhr',
    price: 'Tickets verfügbar',
    features: [
      { icon: '📖', text: 'Gedichte von Rainer Maria Rilke und Antoine de Saint-Exupéry' },
      { icon: '🎭', text: 'Vorgetragen von Sigrid Grün, Julian Bellini und Michael Heiduk' },
      { icon: '🤸', text: 'Artistik von Elefteria und Chris' },
      { icon: '✨', text: 'Poetische Zirkuskunst voller Bewegung und Emotion' }
    ],
    category: 'performance',
    color: {
      primary: 'violet-500',
      secondary: 'purple-500',
      accent: 'violet-400'
    },
    emoji: '📖',
    image: '/Circus & Poetry 2.webp',
    externalTicketUrl: '',
    isOneDay: true
  },
  {
    id: 'outta-space-sylvester',
    title: 'Outta Space Party Service',
    subtitle: 'Sylvester mit Breakdance-Crew',
    description: 'Ringe ins neue Jahr mit der preisgekrönten Breakdance-Crew Outta Space aus München. Die Crew, die bereits zahlreiche Wettbewerbe gewonnen hat, bringt ihre energiegeladene Performance und ihre mitreißende Beats auf die Bühne. Erlebe atemberaubende Moves, dynamische Choreografien und die pure Leidenschaft für Hip-Hop-Kultur. Ein Sylvester-Abend voller Rhythmus, Style und unvergesslicher Momente.',
    date: '2025-12-31',
    dateRange: '31. DEZEMBER 2025',
    time: 'Abends',
    price: 'Tickets verfügbar',
    features: [
      { icon: '🕺', text: 'Preisgekrönte Breakdance-Crew aus München' },
      { icon: '🎵', text: 'Energiegeladene Performance mit mitreißenden Beats' },
      { icon: '💫', text: 'Atemberaubende Moves und dynamische Choreografien' },
      { icon: '🎊', text: 'Sylvester-Feier mit Hip-Hop-Kultur' }
    ],
    category: 'performance',
    color: {
      primary: 'orange-500',
      secondary: 'red-500',
      accent: 'orange-400'
    },
    emoji: '🕺',
    image: '/Outta Space Silvester.webp',
    externalTicketUrl: '',
    isOneDay: true
  },
  {
    id: 'two-gather',
    title: 'TWO GATHER',
    subtitle: 'Ein zeitgenössisches Zirkusstück',
    description: 'Mit Humor, Gefühl und richtig guter Zirkuskunst erzählt TWO GATHER von Begegnungen, Vertrauen und dem feinen Tanz zwischen Nähe und Distanz. Ein Wechselspiel aus spektakulären Momenten und stillen Augenblicken: mal atemberaubend, mal verspielt, mal nachdenklich – aber immer voller Menschlichkeit. Freu dich auf eine liebevoll moderne Inszenierung, die klassische Zirkusdisziplinen mit Theater, Musik und Objektspiel verbindet. Daniela und Jakob (ausgebildete Zirkusartisten) zeigen u. a. Handstand, Hula Hoop, Partnerakrobatik, Jonglage und Bodenakrobatik – dazu gibt es Objekttheater, Live-Musik und Theaterelemente. Eine Tasche voller Überraschungen, ein eigenwilliges Requisit und diese besondere Magie des zeitgenössischen Zirkus machen TWO GATHER zu einer herzerwärmenden, lebendigen Vorstellung für die ganze Familie. Und jetzt kommt das i-Tüpfelchen (oder eher das Zirkus-Z): Daniela und Jakob sind hauseigene Pepe-Artisten – also ein echtes Highlight im Pepe Dome.',
    date: '2026-01-11',
    dateRange: '11. JANUAR 2026',
    time: 'Einlass 15:30 Uhr • Beginn 16:00 Uhr • Dauer: 50 Minuten (ohne Pause)',
    price: '12,50€ bis 18,00€ • Eintritt für unter 16 Jahre umsonst',
    features: [
      { icon: '🎪', text: 'Zeitgenössisches Zirkusstück für alle Altersgruppen' },
      { icon: '🤸', text: 'Handstand, Hula Hoop, Partnerakrobatik, Jonglage und Bodenakrobatik' },
      { icon: '🎭', text: 'Objekttheater, Live-Musik und Theaterelemente' },
      { icon: '⭐', text: 'Mit hauseigenen Pepe-Artisten Daniela und Jakob' },
      { icon: '🎁', text: 'Eintritt für unter 16 Jahre umsonst' },
      { icon: '📅', text: 'Tickets ab 23. Dezember verfügbar' }
    ],
    category: 'performance',
    color: {
      primary: 'indigo-500',
      secondary: 'purple-500',
      accent: 'indigo-400'
    },
    emoji: '🎪',
    image: '/TwoGetherPoster.jpg',
    video: '/TWO%20GATHER%20-%20Trailer.mp4',
    externalTicketUrl: 'https://rausgegangen.de/events/twogather-0/',
    ticketsDisabled: false,
    isOneDay: true
  },
  {
    id: 'facets-of-the-world',
    title: 'Facets of the World',
    subtitle: 'From Nature to Composition - 26 Werke von Künstler/innen aus Guangzhou',
    description: 'In einer Zeit, die von Bildern und Strukturen gesättigt ist, wird unser Verständnis der Welt nicht mehr von einem einzigen, festen Blick geprägt, sondern von einem multidimensionalen Prozess der Beobachtung und Rekonstruktion. Facets of the World: From Nature to Composition vereint 26 Kunstwerke verschiedener Künstler/innen der Yuciao Art Institutes aus Guangzhou, China, die sich der Welt durch drei Dimensionen nähern – Natur, Stadt und das innere Selbst – um die vielfältigen Wege zu enthüllen, wie Menschen ihre Umgebung wahrnehmen. Die Ausstellung nutzt das "Facet" als zentrale Metapher. Jedes Werk fungiert als Querschnitt der Realität – manchmal sanft, manchmal streng, manchmal abstrakt, manchmal gegenständlich. Die naturthematischen Werke erfassen den Fluss von Licht und Wind und das emotionale Zusammenspiel zwischen Figuren und Landschaft. Zeichnungen von Städten und Architektur erkunden räumliche Ordnung und die Logik des Designs. Abstrakte oder digitale Werke übersetzen oder rekodieren die Welt in eine visuelle Sprache aus Form und Farbe und reflektieren die Unterströmungen des menschlichen Bewusstseins. Diese Facetten existieren nicht isoliert, sondern resonieren miteinander im Ausstellungsraum. Am Eröffnungsabend der Ausstellung gibt es eine Performance der Zirkuskünstler von Munich Circus Arts.',
    date: '2026-01-09',
    dateRange: '9.–11. JANUAR 2026',
    time: 'Verschiedene Öffnungszeiten',
    price: 'Eintritt frei',
    features: [
      { icon: '🎨', text: '26 Kunstwerke von Künstler/innen aus Guangzhou, China' },
      { icon: '🤸', text: 'Performance von Munich Circus Arts am Eröffnungsabend' },
      { icon: '🌍', text: 'Drei Dimensionen: Natur, Stadt und inneres Selbst' },
      { icon: '🎁', text: 'Eintritt frei' }
    ],
    category: 'exhibition',
    color: {
      primary: 'amber-500',
      secondary: 'yellow-500',
      accent: 'amber-400'
    },
    emoji: '🎨',
    image: '/AusstellungJan2026.jpg',
    ticketDates: [
      {
        date: '2026-01-09',
        dateDisplay: '9. Januar • 18:00-23:00 Uhr (Vernissage mit Performance)',
        ticketUrl: 'https://rausgegangen.de/events/facets-of-the-world-from-nature-to-composition-26-werke-von--1/',
      },
      {
        date: '2026-01-10',
        dateDisplay: '10. Januar • 12:00-18:00 Uhr',
        ticketUrl: 'https://rausgegangen.de/events/facets-of-the-world-from-nature-to-composition-26-werke-von--2/',
      },
      {
        date: '2026-01-11',
        dateDisplay: '11. Januar • 12:00-16:00 Uhr',
        ticketUrl: 'https://rausgegangen.de/events/facets-of-the-world-from-nature-to-composition-26-werke-von--3/',
      }
    ],
    externalTicketUrl: '',
    isOneDay: false
  },
  {
    id: 'design-thinking-lehrergesundheit',
    title: 'Design-Thinking-Workshop „Lehrergesundheit"',
    subtitle: 'Ein Zirkus als Denkraum für neue Perspektiven',
    description: 'Liebe Lehrerinnen und Lehrer,\n\nder Schulalltag verlangt viel von Lehrkräften: Sie jonglieren täglich mit Unterricht, Verantwortung, Beziehungen und Erwartungen. Oft bleibt dabei wenig Raum, Gesundheit und Wohlbefinden bewusst in den Blick zu nehmen. Genau hier setzt unser Design-Thinking-Workshop zum Thema Lehrergesundheit an, zu dem wir Sie herzlich einladen.\n\n📅 Samstag, den 31. Januar, 14-17.30 Uhr\n📍 Pepe Dome, Ostpark München\n\nDer Workshop findet bewusst in einem Zirkuszelt statt. Der Zirkus dient dabei als Denkraum, der Abstand zum gewohnten Schulkontext schafft und neue Perspektiven ermöglicht. Als Sinnbild für den Lehrerberuf - Balance halten, flexibel reagieren, vieles gleichzeitig im Blick haben - macht er Komplexität sichtbar, ohne zu bewerten. Gleichzeitig lädt dieser ungewöhnliche Ort dazu ein, gewohnte Denkmuster zu verlassen, spielerischer zu denken und neue Lösungswege zu erkunden.',
    date: '2026-01-31',
    dateRange: '31. JANUAR 2026',
    time: '14:00-17:30 Uhr',
    price: 'Kostenlos (im Rahmen einer wissenschaftlichen Abschlussarbeit)',
    features: [
      { icon: '🎪', text: 'Workshop in einem Zirkuszelt als Denkraum' },
      { icon: '💡', text: 'Design Thinking Methode für komplexe Fragestellungen' },
      { icon: '🤝', text: 'Gemeinsame Lösungsentwicklung im Team' },
      { icon: '🎁', text: 'Kostenlose Teilnahme' },
      { icon: '📧', text: 'Anmeldung: mindmambo@gmail.com' }
    ],
    category: 'workshop',
    color: {
      primary: 'emerald-500',
      secondary: 'teal-500',
      accent: 'emerald-400'
    },
    emoji: '💡',
    descriptionPages: [
      'Was ist Design Thinking?\n\nDesign Thinking ist eine kreative und strukturierte Methode, um gemeinsam Lösungen für komplexe Fragestellungen zu entwickeln. Im Mittelpunkt stehen die Menschen und ihre realen Bedürfnisse. Schritt für Schritt werden Erfahrungen sichtbar gemacht, Herausforderungen präzisiert, Ideen entwickelt und erste Lösungsansätze erprobt. Dabei geht es nicht um perfekte Konzepte, sondern um praxisnahe, alltagstaugliche Impulse, die aus der Lebenswelt der Beteiligten entstehen.',
      'Ihre Rolle im Workshop\n\nAlle Teilnehmenden bringen ihre Erfahrung aus dem Schulalltag ein und wirken als Expertinnen und Experten für das Thema Lehrergesundheit. Zusätzlich wird aus jedem Entwicklungsteam (3–4 Personen) jeweils eine Person als „User" rekrutiert, deren Perspektive stellvertretend besonders vertieft einbezogen wird.\n\nDas bedeutet: Nicht alle Teilnehmenden sind User – aber alle sind Expertinnen und Experten.',
      'Weitere Informationen\n\nDie Teilnahme ist kostenlos, da der Workshop im Rahmen einer wissenschaftlichen Abschlussarbeit durchgeführt wird.\n\nBei Fragen oder Interesse wenden Sie sich bitte an Sigrid Grün: mindmambo@gmail.com\n\nWir freuen uns auf Ihre Erfahrung, Ihre Perspektive und Ihre Ideen - und darauf, gemeinsam in einem besonderen Raum neue Wege für mehr Gesundheit und Resilienz im Lehrerberuf zu entwickeln. Manchmal braucht es einen ungewöhnlichen Ort, um das Gewohnte neu zu denken.'
    ],
    isOneDay: true
  }
];

// Export events with automatically calculated status
export const events: Event[] = rawEvents.map(event => ({
  ...event,
  status: calculateEventStatus(event)
}));

export function getNextEvent(): Event | null {
  const now = new Date();
  const upcomingEvents = events
    .filter(event => {
      // Exclude cancelled events
      if (event.cancelled) {
        return false;
      }

      // For multi-day events (with ticketDates), check the last date
      if (event.ticketDates && event.ticketDates.length > 0) {
        const lastTicketDate = event.ticketDates[event.ticketDates.length - 1];
        // Parse the date and add the event time (e.g., 18:30)
        const lastEventDateTime = new Date(lastTicketDate.date);

        // For Circus meets Cinema, events end at 18:30
        if (event.id === 'circus-meets-cinema') {
          lastEventDateTime.setHours(18, 30, 0, 0);
        } else {
          // For other events, use end of day
          lastEventDateTime.setHours(23, 59, 59, 999);
        }

        return lastEventDateTime >= now && event.status === 'upcoming';
      }

      // For single-day events, use the original logic
      const eventDate = new Date(event.date);
      return eventDate >= now && event.status === 'upcoming';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return upcomingEvents[0] || null;
}

export function getEventById(id: string): Event | null {
  return events.find(event => event.id === id) || null;
}

export function isEarlyBirdActive(): boolean {
  const now = new Date();
  const earlyBirdEndDate = new Date('2025-10-16');
  return now < earlyBirdEndDate;
}

export function getEventPrice(price: string): string {
  if (!isEarlyBirdActive() && price.includes('Early Bird')) {
    return price.replace(/Ab \d+€ \(Early Bird\)/, 'Ab 18€');
  }
  return price;
}

// Workshop Interface
export interface Workshop {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  dateDisplay: string;
  duration: string;
  time?: string;
  price?: string;
  whatToBring: string[];
  schedule: Array<{
    title: string;
    description: string;
  }>;
  instructor: {
    name: string;
    email: string;
    website?: string;
  };
  features: Array<{
    icon: string;
    text: string;
  }>;
  category: string;
  color: {
    primary: string;
    secondary: string;
    accent: string;
  };
  emoji: string;
  image?: string;
  status: 'upcoming' | 'past';
  registrationUrl?: string;
  soldOut?: boolean;
}

// Workshop data
const rawWorkshops: Omit<Workshop, 'status'>[] = [
  {
    id: 'object-manipulation-workshop',
    title: 'Object Manipulation',
    subtitle: 'Workshop mit Merri Heikkilä',
    description: 'Dieser Workshop konzentriert sich auf die Verwendung alltäglicher Gegenstände als Jonglier-Requisiten und bietet eine andere Perspektive auf Objektmanipulation. Durch angeleitete Erkundung experimentieren die Teilnehmer mit Form, Bewegung und Rhythmus unter Verwendung von Gegenständen aus dem täglichen Leben. Die Session fördert einen durchdachten und kreativen Ansatz zum Jonglieren, mit Schwerpunkt auf Beobachtung, Anpassungsfähigkeit und dem Finden neuer Möglichkeiten in vertrauten Dingen.',
    date: '2025-11-14',
    dateDisplay: '14. November 2025',
    duration: '2 Stunden',
    time: '15:00 Uhr',
    whatToBring: [
      'Bringen Sie Ihren liebsten Alltagsgegenstand mit'
    ],
    schedule: [
      {
        title: 'Einführung in die Objektmanipulation',
        description: 'Workshop über die Verwendung alltäglicher Gegenstände als Jonglier-Requisiten.'
      },
      {
        title: 'Angeleitete Erkundung',
        description: 'Experimentieren mit Form, Bewegung und Rhythmus unter Verwendung von Gegenständen aus dem täglichen Leben.'
      },
      {
        title: 'Kreatives Jonglieren',
        description: 'Durchdachter und kreativer Ansatz zum Jonglieren mit Schwerpunkt auf Beobachtung, Anpassungsfähigkeit und dem Finden neuer Möglichkeiten in vertrauten Dingen.'
      }
    ],
    instructor: {
      name: 'Merri Heikkilä',
      email: 'info@pepeshows.de',
      website: ''
    },
    features: [
      { icon: '🎭', text: 'Zeitgenössischer Zirkus und Objektmanipulation' },
      { icon: '🌍', text: 'Merri Heikkilä - Bachelor in Zirkuskünsten (Codarts Rotterdam)' },
      { icon: '🎪', text: 'Ideal für Jongleure und Bewegungspraktiker' },
      { icon: '🗣️', text: 'Workshop auf Englisch' }
    ],
    category: 'workshop',
    color: {
      primary: 'orange-500',
      secondary: 'amber-500',
      accent: 'orange-400'
    },
    emoji: '🤹',
    registrationUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdV55BqdgNW9xKmdD3vps10RfW9luBzKtM6JCNSChOuojFNbg/viewform?pli=1'
  },
  {
    id: 'stillness-in-motion-workshop',
    title: 'Stillness in Motion',
    subtitle: 'Workshop mit Alise Madara Bokaldere',
    description: '"Stillness in Motion" erkundet die kraftvolle Verwendung von Stille – nicht nur als Fundament für Bewegung, sondern auch als Technik zur Verbesserung der Bühnenpräsenz. Wir werden uns innerhalb und außerhalb unserer jeweiligen Disziplinen bewegen und es euch ermöglichen, grundlegende Prinzipien zu entdecken und später in eure eigene künstlerische Praxis zu integrieren. In vielen Kunstformen spielt Stille eine entscheidende Rolle – Musik wird durch Pausen verstärkt, Worte brauchen Zwischenräume, um verständlich zu sein, und Bewegung funktioniert ähnlich. Das Vergessen zu stoppen nimmt uns die Fähigkeit, uns auf die Bewegung zu konzentrieren.',
    date: '2025-11-16',
    dateDisplay: '16. November 2025',
    duration: '2 Stunden',
    time: '13:00 Uhr',
    whatToBring: [
      'Kleidung, die uneingeschränkte Bewegung ermöglicht',
      'Wasser zur Hydratation',
      'Notizbücher und Stifte für wichtige Erkenntnisse und Inspirationen'
    ],
    schedule: [
      {
        title: 'Fundament der Stille',
        description: 'Erkunden Sie die kraftvolle Verwendung von Stille als Fundament für Bewegung.'
      },
      {
        title: 'Bühnenpräsenz verstärken',
        description: 'Techniken zur Verbesserung der Bühnenpräsenz durch bewussten Einsatz von Stille.'
      },
      {
        title: 'Disziplinübergreifende Exploration',
        description: 'Bewegung innerhalb und außerhalb der jeweiligen Disziplinen mit Fokus auf nuancierte Details.'
      },
      {
        title: 'Integration in die Praxis',
        description: 'Grundlegende Prinzipien entdecken und in die eigene künstlerische Praxis integrieren.'
      }
    ],
    instructor: {
      name: 'Alise Madara Bokaldere',
      email: 'info@pepeshows.de',
      website: ''
    },
    features: [
      { icon: '💃', text: 'Beste zeitgenössische Tänzerin 2024 (Lettische Tanzpreise)' },
      { icon: '🎭', text: 'Ideal für Tänzer, Zirkusartisten, Akrobaten und Jongleure' },
      { icon: '👥', text: 'Max. 20 Teilnehmer' },
      { icon: '🗣️', text: 'Workshop auf Englisch' }
    ],
    category: 'workshop',
    color: {
      primary: 'purple-500',
      secondary: 'pink-500',
      accent: 'purple-400'
    },
    emoji: '💫',
    registrationUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeg-YUt_aatNtb-iiIZKerZ1kviJRl3U61WLPsA4ROncrrV5g/viewform'
  },
  {
    id: 'cyr-wheel-workshop-nov',
    title: 'Cyr Wheel – The Art of Spinning',
    subtitle: 'Workshop mit Chris',
    description: 'Ich gestalte den Workshop frei und individuell. Bringt eure Ideen, Fragen und Bewegungen mit – wir entwickeln sie gemeinsam weiter.',
    date: '2025-11-29',
    dateDisplay: '29. November 2025',
    duration: '5 Stunden inkl. Pause',
    time: '10:00 - 15:00 Uhr',
    price: '35€',
    soldOut: true,
    whatToBring: [
      'Bequeme Sportkleidung',
      'Sportschuhe',
      'Offenheit, Neugier und Lust auf Bewegung'
    ],
    schedule: [
      {
        title: '1. Warm-up am Cyr Wheel',
        description: 'Wir starten ruhig: heben, rollen, spüren. Das Rad wird zum Partner – wir lernen, es zu bewegen, zu manipulieren und dabei locker zu bleiben.'
      },
      {
        title: '2. Bewegung im Raum',
        description: 'Wie reist man mit dem Cyr Wheel von A nach B? Wir erforschen Wege, Schwünge und Raumgefühl – Schritt für Schritt, Drehung für Drehung.'
      },
      {
        title: '3. Basics intensiv',
        description: 'Wir tauchen tiefer in die Grundlagen ein: Flying Steps, Rocken und Walz bilden die Basis. Jede Bewegung fließt in die nächste.'
      },
      {
        title: '4. Mini-Showcase vor der Pause',
        description: 'Jetzt seid ihr dran: Jede*r zeigt eine kleine Sequenz aus den Basics. Ganz nach dem Motto „Each One Teach One" – wer mag, gibt Tipps und teilt Erfahrungen.'
      },
      {
        title: 'Pause',
        description: 'Zeit zum Durchatmen, Kräfte sammeln, Arme ausschütteln.'
      },
      {
        title: '5. Cyr-Spiel & Tricks',
        description: 'Wir steige wieder ein mit einem spielerischen Warm-up. Dann geht\'s an neue Tricks und Kombinationen. Von Superman bis Coin, von Flag bis Twist & Turn – ihr bringt Ideen, ich helfe beim Umsetzen.'
      }
    ],
    instructor: {
      name: 'Chris',
      email: 'chris@pepearts.de',
      website: 'https://www.pepearts.de'
    },
    features: [
      { icon: '🎡', text: '5 Stunden intensive Cyr Wheel Praxis' },
      { icon: '👨‍🏫', text: 'Professionelle Anleitung von Chris' },
      { icon: '🔄', text: 'Von Basics bis zu fortgeschrittenen Tricks' },
      { icon: '🤝', text: 'Each One Teach One - Gemeinschaftliches Lernen' }
    ],
    category: 'workshop',
    color: {
      primary: 'cyan-500',
      secondary: 'blue-500',
      accent: 'cyan-400'
    },
    emoji: '🌪️',
    registrationUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfQSdyREnmEtKik6bGjLfrIajbTnfY0Y2kXAS6mE26DUwbqHg/viewform?usp=dialog'
  },
  {
    id: 'aerial-straps-workshop-dec',
    title: 'Aerial Straps with Daniel Fernández',
    subtitle: 'Technical development for beginners and intermediate',
    description: 'This workshop is aimed at technical development for beginners and intermediate, it\'s prepared for helping those who already had contact with aerial straps, as well as for those who have a background in aerial circus, that gives them a base for straps. The aim for beginners is to explore the technique of straps and gain a base and tools so that they can continue growing new skills also after the workshop. The aim for intermediates is to focus in advanced techniques (or their current work in progress) and so, doing more in-detail work. Daniel Fernández is a circus artist based in Brussels, Belgium, who started aerial straps as self-taught, eventually joining the Ésac circus school in Belgium. He has since graduated and co-founded a circus company, Alud Company, which intertwines aerial straps and partner acrobatics with other art forms.',
    date: '2025-12-06',
    dateDisplay: '6.–7. Dezember 2025',
    duration: '3 Stunden pro Session',
    time: '13:00 - 16:00 Uhr',
    price: '85€ pro Session • 150€ für 2-Tage-Pass',
    whatToBring: [
      'Bequeme Sportkleidung für Luftakrobatik',
      'Ggf. eigene Handgelenkbandagen (falls bevorzugt)',
      'Wasser zur Hydratation',
      'Bei Fragen zur Ausrüstung kontaktieren Sie bitte die Organisatoren'
    ],
    schedule: [
      {
        title: 'Session 1 - Samstag, 6. Dezember',
        description: '13:00-16:00 Uhr: Technische Entwicklung für Beginner und Fortgeschrittene. Fokus auf Grundtechniken für Anfänger, fortgeschrittene Techniken für Intermediates.'
      },
      {
        title: 'Session 2 - Sonntag, 7. Dezember',
        description: '13:00-16:00 Uhr: Fortsetzung der technischen Entwicklung. Vertiefung der Techniken und detaillierte Arbeit an individuellen Fähigkeiten.'
      },
      {
        title: 'Technischer Aufbau',
        description: 'Anfänger erkunden die Straps-Technik und erhalten Werkzeuge für eigenständiges Weiterwachsen. Fortgeschrittene konzentrieren sich auf ihre aktuellen fortgeschrittenen Techniken und Work-in-Progress.'
      }
    ],
    instructor: {
      name: 'Daniel Fernández',
      email: 'info@pepeshows.de',
      website: ''
    },
    features: [
      { icon: '🎪', text: 'Workshop für Anfänger und Fortgeschrittene' },
      { icon: '🌍', text: 'Internationaler Lehrer mit Erfahrung in Valencia, Leipzig, Istanbul, Taipei' },
      { icon: '🎓', text: 'Absolvent der Ésac Circus School, Belgien' },
      { icon: '🎭', text: 'Mitbegründer von Alud Company' },
      { icon: '📅', text: 'Zwei Sessions am Wochenende oder 2-Tage-Pass' },
      { icon: '🗣️', text: 'Workshop auf Englisch' }
    ],
    category: 'workshop',
    color: {
      primary: 'blue-500',
      secondary: 'indigo-500',
      accent: 'blue-400'
    },
    emoji: '🎪',
    registrationUrl: 'https://www.eversports.de/e/workshop/2z8n_uw'
  }
];

// Export workshops with automatically calculated status
export const workshops: Workshop[] = rawWorkshops.map(workshop => ({
  ...workshop,
  status: new Date(workshop.date) < new Date() ? 'past' : 'upcoming'
}));

export function getUpcomingWorkshops(): Workshop[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return workshops.filter(w => {
    const workshopDate = new Date(w.date);
    workshopDate.setHours(0, 0, 0, 0);
    return workshopDate >= today;
  })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getWorkshopById(id: string): Workshop | null {
  return workshops.find(workshop => workshop.id === id) || null;
}