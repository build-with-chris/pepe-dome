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
  status: 'upcoming' | 'ongoing' | 'past';
}

export const events: Event[] = [
  {
    id: 'circus-meets-cinema',
    title: 'Circus meets Cinema',
    subtitle: 'Artistik & Film in perfekter Symbiose',
    description: 'Ein einzigartiges Erlebnis: Sängerin, Artisten und Kinofilm verschmelzen zu einem unvergesslichen Abend. Professionelle Kinoausstattung mit Sound, Projektor und bequemen Sitzen.',
    date: '2025-10-10',
    dateRange: '10.–11. OKTOBER 2025',
    time: 'Jeweils 18:00 Uhr',
    price: 'Ab 12€',
    features: [
      { icon: '🎭', text: 'Live-Artistik während der Filmvorführung' },
      { icon: '🎵', text: 'Sängerin begleitet die Handlung live' },
      { icon: '🍿', text: 'Popcorn und Getränke vor Ort' }
    ],
    category: 'cinema',
    color: {
      primary: 'red-500',
      secondary: 'pink-500',
      accent: 'red-400'
    },
    emoji: '🎬',
    status: 'upcoming'
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
    status: 'upcoming'
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