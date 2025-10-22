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
    id: 'circus-poetry',
    title: 'Circus & Poetry',
    subtitle: 'Literatur trifft Artistik',
    description: 'Ein poetischer Abend, der Grenzen verschwimmen lässt: Circus & Poetry verbindet klassische Literatur mit moderner Zirkuskunst und schafft ein Erlebnis voller Poesie, Bewegung und Emotion. Gedichte von Rainer Maria Rilke, eine berührende Adaption von Antoine de Saint-Exupéry und eindrucksvolle Artistik von Elefteria und Chris verschmelzen zu einer sinnlichen Gesamtkomposition. Zwischen Worten und Körperkunst entsteht ein Raum, in dem Sprache fliegt und Artistik erzählt. Sigrid Grün, Julian Bellini und Michael Heiduk verleihen den Texten Stimme und Seele, während Elefteria und Chris mit Auszügen aus ihrer aktuellen Kreation die Bühne in einen poetischen Zirkus verwandeln.',
    date: '2025-10-24',
    dateRange: '24.–25. OKTOBER 2025',
    time: 'Jeweils 19:00 Uhr',
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
    ticketDates: [
      {
        date: '2025-10-24',
        dateDisplay: '24. Oktober',
        ticketUrl: 'https://rausgegangen.de/events/circus-poetry-0/?mtm_campaign=teilen_event&mtm_kwd=app'
      },
      {
        date: '2025-10-25',
        dateDisplay: '25. Oktober',
        ticketUrl: 'https://rausgegangen.de/events/circus-poetry-1/'
      }
    ]
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
    ]
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
  }
];

// Export workshops with automatically calculated status
export const workshops: Workshop[] = rawWorkshops.map(workshop => ({
  ...workshop,
  status: new Date(workshop.date) < new Date() ? 'past' : 'upcoming'
}));

export function getUpcomingWorkshops(): Workshop[] {
  return workshops.filter(w => w.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getWorkshopById(id: string): Workshop | null {
  return workshops.find(workshop => workshop.id === id) || null;
}