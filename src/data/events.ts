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
      primary: 'red-500',
      secondary: 'pink-500',
      accent: 'red-400'
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
      primary: 'yellow-500',
      secondary: 'orange-500',
      accent: 'yellow-400'
    },
    emoji: '🤡',
    image: '/Entertainment.webp',
    status: 'upcoming',
    externalTicketUrl: 'https://eventfrog.de/de/p/musicals-shows/zirkus/einmanneinkoffereinwanderzirkus-7378775815528387554.html'
  },
  {
    id: 'morphe',
    title: 'Morphe',
    subtitle: 'Ein interdisziplinäres performatives Stück',
    description: 'Morphe erforscht den Prozess der persönlichen und kollektiven Resilienz. Inspiriert von Wetterphänomenen, die Landschaften im Laufe der Zeit prägen verbindet dieses Stück Tanz, Akrobatik und Live-Musik zu einer wandelbaren Bühnenlandschaft, in der innere wie äußere Stürme sichtbar werden. Im Zentrum steht die Frage: Was bricht, was biegt sich- und was wächst gestärkt zurück? Die Performer*innen Melanie Old, Jonas Dürrbeck und Leonhard Sedlmeier laden das Publikum ein, Teil dieses Prozesses zu werden. Natur, Klang und Körper verweben sich zu einem immersiven Erlebnis, das die Grenzen zwischen Bühne und Zuschauerraum auflöst und Resilienz als individuellen wie gemeinsamen Akt erfahrbar macht.',
    date: '2025-11-01',
    dateRange: '1. NOVEMBER 2025',
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
    status: 'upcoming',
    externalTicketUrl: 'https://eventfrog.de/de/p/theater-buehne/experimentelles-theater/morphe-7378820788130941548.html'
  },
  {
    id: 'luftakrobatik-marlon',
    title: 'Luftakrobatik mit Marlon',
    subtitle: 'Workshop • Open Stage • Show',
    description: 'Drei Tage voller Luftakrobatik! Marlon öffnet seine Bühne für seine Schüler, bietet intensive Workshops und präsentiert eine spektakuläre Show. Ein Event für alle, die die Kunst des Fliegens erleben möchten.',
    date: '2025-11-07',
    dateRange: '7.–9. NOVEMBER 2025',
    time: 'Workshop & Show',
    price: 'Verschiedene Preise',
    features: [
      { icon: '🤸‍♂️', text: 'Intensive Luftakrobatik-Workshops' },
      { icon: '🎪', text: 'Open Stage für Schüler' },
      { icon: '✨', text: 'Spektakuläre Abschluss-Show' }
    ],
    category: 'workshop',
    color: {
      primary: 'blue-500',
      secondary: 'cyan-500',
      accent: 'blue-400'
    },
    emoji: '🤸‍♂️',
    image: '/Marlon1.webp',
    status: 'upcoming'
  },
  {
    id: 'freeman-festival',
    title: 'Freeman',
    subtitle: 'Festival der Artistik',
    description: 'Internationale Spitzen-Artist:innen zeigen Akrobatik und Entertainment auf Weltklasse-Niveau. 5 Shows • 3 Tage • Höchstleistung trifft Poesie in der einzigartigen Atmosphäre des Pepe Dome.',
    date: '2025-11-14',
    dateRange: '14.–16. NOVEMBER 2025',
    time: '3 Tage',
    price: 'Ab 12€',
    features: [
      { icon: '🎭', text: 'Internationale Spitzen-Artist:innen' },
      { icon: '🌍', text: 'Acts aus Skandinavien und dem Baltikum' },
      { icon: '🏛️', text: 'Weltklasse-Niveau im Pepe Dome' }
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
    externalTicketUrl: 'https://freemanfestival.de'
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