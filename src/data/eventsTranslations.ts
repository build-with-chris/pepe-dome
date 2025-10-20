import { Event } from './events';

// English translations for events
export const eventTranslationsEN: Record<string, Partial<Event>> = {
  'circus-meets-cinema': {
    title: 'Circus meets Cinema',
    subtitle: 'Artistry & Film in Perfect Symbiosis',
    description: 'An extraordinary experience: artistry performance and cinema film in perfect symbiosis. Singer Caro and our artists create the evening with live music and spectacular performances while you sit back and enjoy a great film.',
    time: 'Both days 6:30 PM',
    price: 'Children under 6 free • Reduced 8€ • Regular 15€',
    features: [
      { icon: '🎭', text: 'Artistry performance as opening and finale' },
      { icon: '🎵', text: 'Live music between performances' },
      { icon: '🎬', text: 'Professional cinema equipment with premium sound' },
      { icon: '🍿', text: 'Popcorn, nachos, ice cream and drinks' }
    ],
    dateRange: 'OCTOBER 10-11, 2025',
    ticketDates: [
      {
        date: '2025-10-10',
        dateDisplay: 'October 10',
        film: 'Wicki and the Strong Men',
        ticketUrl: 'https://eventfrog.de/de/p/musicals-shows/zirkus/circus-cinema-7378769807640899523.html'
      },
      {
        date: '2025-10-11',
        dateDisplay: 'October 11',
        film: 'Ostwind',
        ticketUrl: 'https://eventfrog.de/de/p/musicals-shows/zirkus/circus-cinema-7378772246792262000.html'
      }
    ]
  },
  'wanderzirkus-pepe': {
    title: 'One Man, One Suitcase, One Traveling Circus',
    subtitle: 'Clownery • Mime • Artistry',
    description: 'The clown Pepe conjures a magical world from his suitcase. Mime, artistry and clownery for young and old. Quirky sketches from the everyday life of a clown searching for his way. His heartwarming stumbling captivates everyone. Once a month on Sundays at Pepe Dome.',
    time: 'Sunday',
    price: 'Tickets available',
    features: [
      { icon: '🤡', text: 'Heartwarming clownery for all ages' },
      { icon: '🎭', text: 'Mime and artistry from the suitcase' },
      { icon: '📅', text: 'Monthly performances every Sunday' },
      { icon: '👨‍👩‍👧‍👦', text: 'Perfect for families and children' }
    ],
    dateRange: 'OCTOBER 12, 2025'
  },
  'circus-poetry': {
    title: 'Circus & Poetry',
    subtitle: 'Literature meets Artistry',
    description: 'A poetic evening that blurs boundaries: Circus & Poetry combines classical literature with modern circus arts and creates an experience full of poetry, movement and emotion. Poems by Rainer Maria Rilke, a touching adaptation of Antoine de Saint-Exupéry and impressive artistry by Elefteria and Chris merge into a sensual overall composition. Between words and body art, a space is created where language flies and artistry tells stories. Sigrid Grün, Julian Bellini and Michael Heiduk give voice and soul to the texts, while Elefteria and Chris transform the stage into a poetic circus with excerpts from their current creation.',
    time: 'Both days 7:00 PM',
    price: 'Tickets available',
    features: [
      { icon: '📖', text: 'Poems by Rainer Maria Rilke and Antoine de Saint-Exupéry' },
      { icon: '🎭', text: 'Performed by Sigrid Grün, Julian Bellini and Michael Heiduk' },
      { icon: '🤸', text: 'Artistry by Elefteria and Chris' },
      { icon: '✨', text: 'Poetic circus art full of movement and emotion' }
    ],
    dateRange: 'OCTOBER 24-25, 2025',
    ticketDates: [
      {
        date: '2025-10-24',
        dateDisplay: 'October 24',
        ticketUrl: 'https://rausgegangen.de/events/circus-poetry-0/?mtm_campaign=teilen_event&mtm_kwd=app'
      },
      {
        date: '2025-10-25',
        dateDisplay: 'October 25',
        ticketUrl: 'https://rausgegangen.de/events/circus-poetry-1/'
      }
    ]
  },
  'samhain-circus-madness': {
    title: 'Samhain Circus Madness',
    subtitle: 'Halloween Circus Night',
    description: 'Step into a magical night full of spooky-beautiful circus moments! Experience glowing aerial artistry, mysterious shows and surprising encounters from another world. Our artists take you on a journey between life and death – where witches fly, shadows dance and the veil to the otherworld grows thin. Costumes are welcome but not required – just bring good vibes and Halloween spirit and celebrate a night you won\'t forget!',
    time: 'Doors: 6:30 PM | Show starts: 7:00 PM',
    price: 'Adults 10€ • Children (6-12 years) 7€ • Children under 6 free',
    features: [
      { icon: '🎃', text: 'Magical Halloween circus night' },
      { icon: '✨', text: 'Glowing aerial artistry and mysterious shows' },
      { icon: '🦇', text: 'A journey between life and death' },
      { icon: '🕸️', text: 'Costumes welcome – Halloween spirit guaranteed!' }
    ],
    dateRange: 'OCTOBER 31, 2025'
  },
  'morphe': {
    title: 'Morphe',
    subtitle: 'An Interdisciplinary Performance Piece',
    description: 'Morphe explores the process of personal and collective resilience. Inspired by weather phenomena that shape landscapes over time, this piece combines dance, acrobatics and live music into a transformable stage landscape where inner and outer storms become visible. At the center is the question: What breaks, what bends - and what grows back stronger? The performers Melanie Old, Jonas Dürrbeck and Leonhard Sedlmeier invite the audience to become part of this process. Nature, sound and body are woven together into an immersive experience that dissolves the boundaries between stage and audience and makes resilience tangible as both an individual and collective act.',
    time: 'Evening',
    price: 'Tickets available',
    features: [
      { icon: '🌪️', text: 'Interdisciplinary piece of dance, acrobatics and live music' },
      { icon: '🎭', text: 'Performers: Melanie Old, Jonas Dürrbeck, Leonhard Sedlmeier' },
      { icon: '✨', text: 'Immersive experience between stage and audience' },
      { icon: '🌱', text: 'Exploration of resilience and personal transformation' }
    ],
    dateRange: 'NOVEMBER 1-2, 2025',
    ticketDates: [
      {
        date: '2025-11-01',
        dateDisplay: 'November 1',
        ticketUrl: 'https://eventfrog.de/de/p/theater-buehne/experimentelles-theater/morphe-7378820788130941548.html'
      },
      {
        date: '2025-11-02',
        dateDisplay: 'November 2',
        ticketUrl: 'https://rausgegangen.de/events/morphe-1/'
      }
    ]
  },
  'drag-akrobatik-show': {
    title: 'Theater Without House Number',
    subtitle: 'Drag. Acrobatics. Show.',
    description: '"Theater Without House Number" combines spectacular artistry with drag performance and live music. A colorful mix of wit, glamour and breathtaking acrobatics. An evening that is guaranteed to be different – and fun.',
    time: '7:00 PM',
    price: 'Tickets available',
    features: [
      { icon: '💃', text: 'Spectacular drag performance' },
      { icon: '🤸‍♀️', text: 'Breathtaking artistry and acrobatics' },
      { icon: '🎵', text: 'Live music and entertainment' },
      { icon: '✨', text: 'Wit, glamour and surprises' }
    ],
    dateRange: 'NOVEMBER 8, 2025'
  },
  'tshemodan': {
    title: 'Tschemodan',
    subtitle: 'Tschemodan – A Musical Circus Between Home & Flight',
    description: 'The ensemble literally unpacks the circus from the suitcase: Moving acrobatics, live Klezmer, mime and personal stories weave together into a show about migration, identity and belonging. At the end, everything is packed up again – with the message: The journey continues.',
    time: '6:00 PM',
    price: 'Tickets available',
    features: [
      { icon: '🎪', text: 'Moving acrobatics from the suitcase' },
      { icon: '🎵', text: 'Live Klezmer music' },
      { icon: '🎭', text: 'Mime and personal stories' },
      { icon: '🌍', text: 'Themes: Migration, identity and belonging' }
    ],
    dateRange: 'NOVEMBER 9-10, 2025',
    ticketDates: [
      {
        date: '2025-11-09',
        dateDisplay: 'November 9',
        ticketUrl: 'https://rausgegangen.de/events/tschemodan-tsirk-dobranotch-0/'
      },
      {
        date: '2025-11-10',
        dateDisplay: 'November 10',
        ticketUrl: 'https://rausgegangen.de/events/tschemodan-tsirk-dobranotch-1/'
      }
    ],
    sponsorship: {
      sponsor: {
        name: 'Kuszner Foundation',
        logo: '/Stiftung.jpg',
        text: 'Supported by the Kuszner Foundation'
      },
      commemoration: {
        text: 'In Memory of Kristallnacht',
        description: 'This performance takes place in remembrance of Kristallnacht on November 9, 1938.'
      }
    }
  },
  'freeman-festival': {
    title: 'Freeman',
    subtitle: 'Festival of Artistry',
    description: 'International top artists show acrobatics and entertainment at world-class level. 5 Shows • 3 Days • Peak performance meets poetry in the unique atmosphere of Pepe Dome.',
    time: '3-Day Festival',
    price: 'From 12€ • Combo tickets available',
    features: [
      { icon: '🎭', text: 'International top artists' },
      { icon: '🌍', text: 'Acts from Scandinavia and the Baltics' },
      { icon: '🏛️', text: '5 shows over 3 days' },
      { icon: '🎫', text: 'Single tickets & combo tickets' }
    ],
    dateRange: 'NOVEMBER 14-16, 2025',
    freemanShows: [
      {
        day: 'Friday',
        date: '2025-11-14',
        dateDisplay: 'November 14',
        shows: [
          {
            time: '15:00',
            title: 'Workshop "Object Manipulation"',
            description: 'With Merri Heikkilä • Everyday objects as props, form, movement, rhythm • Approx. 2 hours, in English',
            ticketUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdV55BqdgNW9xKmdD3vps10RfW9luBzKtM6JCNSChOuojFNbg/viewform',
            price: 'Workshop Registration',
            type: 'workshop' as const
          },
          {
            time: '19:00',
            title: 'Show "Häppy Hour"',
            description: 'The Nordic Council • Contemporary circus × comedy, humor about everyday life & ambivalence',
            ticketUrl: 'https://rausgegangen.de/events/nordic-council-happy-hour-0/?mtm_campaign=teilen_event&mtm_kwd=app',
            price: 'From 12€ (Early Bird)'
          }
        ]
      },
      {
        day: 'Saturday',
        date: '2025-11-15',
        dateDisplay: 'November 15',
        shows: [
          {
            time: '11:00',
            title: 'Presentation + Talk',
            description: 'With Anke Politz • Details to follow',
            ticketUrl: '/en/kontakt#kontaktformular',
            price: 'Free',
            type: 'talk' as const
          },
          {
            time: '18:00',
            title: 'Show "Häppy Hour"',
            description: 'The Nordic Council • Contemporary circus × comedy • Second performance',
            ticketUrl: 'https://rausgegangen.de/events/nordic-council-happy-hour-1/?mtm_campaign=teilen_event&mtm_kwd=app',
            price: 'From 12€ (Early Bird)'
          },
          {
            time: '20:30',
            title: 'Show "How a Spiral Works"',
            description: 'Art for Rainy Days • Meditative, hypnotic circus with dance, hair hanging & aerial rope • Minimalist aesthetics with reinterpreted Baltic folk music',
            ticketUrl: 'https://rausgegangen.de/events/art-for-rainy-days-how-a-spiral-works-0/?mtm_campaign=teilen_event&mtm_kwd=app',
            price: 'From 12€ (Early Bird)'
          },
          {
            time: '21:45',
            title: 'Party',
            description: 'Post-show gathering with music, exchange and good vibes',
            ticketUrl: '',
            price: 'Free',
            type: 'party' as const
          }
        ]
      },
      {
        day: 'Sunday',
        date: '2025-11-16',
        dateDisplay: 'November 16',
        shows: [
          {
            time: '13:00',
            title: 'Workshop "Stillness in Motion"',
            description: 'With Alise Madara Bokaldere • Stillness & movement, stage presence, expression beyond disciplines • Approx. 2 hours, in English, max. 20 participants',
            ticketUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeg-YUt_aatNtb-iiIZKerZ1kviJRl3U61WLPsA4ROncrrV5g/viewform',
            price: 'Workshop Registration',
            type: 'workshop' as const
          },
          {
            time: '18:00',
            title: 'Show "How a Spiral Works"',
            description: 'Art for Rainy Days • Meditative, hypnotic circus • Repeat of Saturday\'s show',
            ticketUrl: 'https://rausgegangen.de/events/art-for-rainy-days-how-a-spiral-works-1/?mtm_campaign=teilen_event&mtm_kwd=app',
            price: 'From 12€ (Early Bird)'
          }
        ]
      }
    ]
  }
};

// Function to get localized event
export function getLocalizedEvent(event: Event, locale: 'de' | 'en' = 'de'): Event {
  if (locale === 'de') {
    return event;
  }

  const translation = eventTranslationsEN[event.id];
  if (!translation) {
    return event;
  }

  return {
    ...event,
    ...translation
  };
}

// Function to get all localized events
export function getLocalizedEvents(events: Event[], locale: 'de' | 'en' = 'de'): Event[] {
  return events.map(event => getLocalizedEvent(event, locale));
}
