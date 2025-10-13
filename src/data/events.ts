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
  status: 'upcoming' | 'ongoing' | 'past';
  ticketDates?: Array<{
    date: string;
    dateDisplay: string;
    film?: string;
    ticketUrl: string;
  }>;
  externalTicketUrl?: string;
  isOneDay?: boolean;
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

export const events: Event[] = [
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
    status: 'upcoming',
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
    status: 'upcoming',
    externalTicketUrl: 'https://eventfrog.de/de/p/musicals-shows/zirkus/einmanneinkoffereinwanderzirkus-7378775815528387554.html',
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
    status: 'upcoming',
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
    title: 'Drag. Akrobatik. Show.',
    subtitle: 'Theater ohne Hausnummer',
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
    status: 'upcoming',
    isOneDay: true
  },
  {
    id: 'tshemodan',
    title: 'Musik. Zirkus. Heimat.',
    subtitle: 'Tshemodan – ein musikalischer Zirkus zwischen Heimat & Flucht',
    description: 'Das Ensemble packt den Zirkus buchstäblich aus dem Koffer: Bewegende Akrobatik, Live-Klezmer, Pantomime und persönliche Geschichten verweben sich zu einer Show über Migration, Identität und Zugehörigkeit. Am Ende wird alles wieder eingepackt – mit der Botschaft: Die Reise geht weiter.',
    date: '2025-11-09',
    dateRange: '9.–10. NOVEMBER 2025',
    time: 'Abends',
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
    status: 'upcoming',
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
    id: 'freeman-festival',
    title: 'Freeman',
    subtitle: 'Festival der Artistik',
    description: 'Internationale Spitzen-Artist:innen zeigen Akrobatik und Entertainment auf Weltklasse-Niveau. 5 Shows • 3 Tage • Höchstleistung trifft Poesie in der einzigartigen Atmosphäre des Pepe Dome.',
    date: '2025-11-14',
    dateRange: '14.–16. NOVEMBER 2025',
    time: '3 Tage Festival',
    price: 'Ab 12€ • Kombitickets verfügbar',
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
    status: 'upcoming',
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
            type: 'workshop'
          },
          {
            time: '19:00',
            title: 'Show „Häppy Hour"',
            description: 'The Nordic Council • Zeitgenössischer Zirkus × Comedy, Humor über Alltag & Ambivalenz',
            ticketUrl: 'https://rausgegangen.de/events/nordic-council-happy-hour-0/?mtm_campaign=teilen_event&mtm_kwd=app',
            price: 'Ab 12€ (Early Bird)'
          }
        ]
      },
      {
        day: 'Samstag',
        date: '2025-11-15',
        dateDisplay: '15. November',
        shows: [
          {
            time: '11:00',
            title: 'Presentation + Talk',
            description: 'Mit Anke Politz • Details folgen',
            ticketUrl: '/kontakt#kontaktformular',
            price: 'Kostenlos',
            type: 'talk'
          },
          {
            time: '18:00',
            title: 'Show „Häppy Hour"',
            description: 'The Nordic Council • Zeitgenössischer Zirkus × Comedy • Zweite Aufführung',
            ticketUrl: 'https://rausgegangen.de/events/nordic-council-happy-hour-1/?mtm_campaign=teilen_event&mtm_kwd=app',
            price: 'Ab 12€ (Early Bird)'
          },
          {
            time: '20:30',
            title: 'Show „How a Spiral Works"',
            description: 'Art for Rainy Days • Meditativer, hypnotischer Zirkus mit Tanz, Hair Hanging & Aerial Rope • Minimalistische Ästhetik mit neu interpretierter baltischer Volksmusik',
            ticketUrl: 'https://rausgegangen.de/events/art-for-rainy-days-how-a-spiral-works-0/?mtm_campaign=teilen_event&mtm_kwd=app',
            price: 'Ab 12€ (Early Bird)'
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
            type: 'workshop'
          },
          {
            time: '18:00',
            title: 'Show „How a Spiral Works"',
            description: 'Art for Rainy Days • Meditativer, hypnotischer Zirkus • Wiederholung der Show vom Samstag',
            ticketUrl: 'https://rausgegangen.de/events/art-for-rainy-days-how-a-spiral-works-1/?mtm_campaign=teilen_event&mtm_kwd=app',
            price: 'Ab 12€ (Early Bird)'
          }
        ]
      }
    ],
    combiTickets: [
      {
        name: 'Festival Pass',
        description: 'Alle 4 Shows + beide Workshops',
        price: 'Nur 48€ (statt 60€)',
        ticketUrl: 'https://eventfrog.de/freeman-festival-pass',
        savings: 'Spare 12€!'
      },
      {
        name: 'Show Pass',
        description: 'Alle 4 Shows (ohne Workshops)',
        price: 'Nur 40€ (statt 48€)',
        ticketUrl: 'https://eventfrog.de/freeman-show-pass',
        savings: 'Spare 8€!'
      },
      {
        name: 'Workshop Pass',
        description: 'Beide Workshops + 1 Show deiner Wahl',
        price: 'Nur 25€',
        ticketUrl: 'https://eventfrog.de/freeman-workshop-pass',
        savings: 'Perfekt für Künstler!'
      }
    ]
  },
  {
    id: 'sommer-festival-2024',
    title: 'Sommer Festival 2024',
    subtitle: 'Drei Tage voller Artistik und Musik',
    description: 'Ein unvergessliches Wochenende mit internationalen Artists, Live-Musik und spektakulären Darbietungen unter freiem Himmel. Das Festival bot eine einzigartige Mischung aus zeitgenössischem Zirkus, Akrobatik und musikalischen Highlights.',
    date: '2024-07-15',
    dateRange: '15.–17. JULI 2024',
    time: '3 Tage Festival',
    price: 'Tickets waren ab 25€ verfügbar',
    features: [
      { icon: '☀️', text: 'Drei Tage Open-Air Festival' },
      { icon: '🎪', text: 'Internationale Artistik-Acts' },
      { icon: '🎵', text: 'Live-Musik auf mehreren Bühnen' },
      { icon: '🌟', text: 'Über 2000 begeisterte Besucher' }
    ],
    category: 'festival',
    color: {
      primary: 'yellow-500',
      secondary: 'orange-500',
      accent: 'yellow-400'
    },
    emoji: '☀️',
    image: '/Freeman-Poster.webp',
    status: 'past'
  }
];

export function getNextEvent(): Event | null {
  const now = new Date();
  const upcomingEvents = events
    .filter(event => {
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