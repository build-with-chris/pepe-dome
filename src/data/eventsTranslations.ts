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
    price: 'Reduced €12, Regular €18 • Combo tickets available',
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
            type: 'workshop' as const,
            workshopDetails: {
              shortDescription: 'With Merri Heikkilä • Everyday objects as props, form, movement, rhythm • Approx. 2 hours, in English',
              fullDescription: 'This workshop focuses on using everyday objects as juggling props, offering a different perspective on object manipulation. Through guided exploration, participants will experiment with form, movement, and rhythm, using items found in daily life. The session encourages a thoughtful and creative approach to juggling, with an emphasis on observation, adaptability, and finding new possibilities in familiar things.',
              by: 'Merri Heikkilä',
              aboutTeacher: 'Merri Heikkilä is a juggler and circus artist who mainly works with contemporary circus. Merri graduated in 2017 from the circus line of Codarts in Rotterdam with a bachelor\'s degree in circus arts and has been involved in founding two new circus groups, Sirkum Polaris and the Nordic Council. In addition, he works in various works and events of the circus company Nuua. In his work, in addition to object manipulation and acrobatics, Merri often also uses the tools of physical theater to create unique experiences for the audience.',
              idealFor: 'Contemporary circus artists, jugglers, and movement practitioners interested in object manipulation, creative exploration and interdisciplinary experimentation.',
              whatToBring: 'Your favorite everyday object.'
            }
          },
          {
            time: '19:00',
            title: 'Show "Häppy Hour"',
            description: 'The Nordic Council • Contemporary circus × comedy, humor about everyday life & ambivalence',
            ticketUrl: 'https://www.freemanfestival.de/tickets',
            price: 'Reduced €12, Regular €18',
            showDetails: {
              shortDescription: 'The Nordic Council • Contemporary circus × comedy, humor about everyday life & ambivalence',
              fullDescription: 'A new Nordic circus creation by The Nordic Council.\n\nHäppy Hour is an ode to the deep dark north and its social culture. It grapples with the contradictory relationship to alcohol, and explores the weird and awkward experiences that the northern nightlife has to offer.\n\nInterpreting it through the lens of contemporary circus and comedy, Häppy Hour approaches real life situations through awkward humour, showing how things aren\'t always that serious, and that it\'s ok to laugh at ourselves, even at our worst.\n\nBy combining juggling, and aerial rope with physical theatre and live music The Nordic Council creates scenes around these topics which evokes a feeling of self-recognition in the audience. "We\'ve all been there" is a feeling that permeates the performance, as the trio stumble their way through the scenes of the highs and lows of Nordic nightlife.',
              by: 'The Nordic Council',
              elements: ['Juggling', 'Aerial Rope', 'Physical Theatre', 'Live Music']
            }
          }
        ]
      },
      {
        day: 'Saturday',
        date: '2025-11-15',
        dateDisplay: 'November 15',
        shows: [
          {
            time: '14:00',
            title: 'TIME TO TALK – Talk on the Future of Contemporary Circus',
            description: 'Open conversation about the future of contemporary circus with artists, organizers and cultural policy representatives.',
            ticketUrl: '/en/kontakt#kontaktformular',
            price: 'Free',
            type: 'talk' as const,
            talkDetails: {
              shortDescription: 'Open conversation about the future of contemporary circus with artists, organizers and cultural policy representatives.',
              fullDescription: 'As part of the "Time for Circus" festival, the Federal Association of Contemporary Circus (BUZZ) invites you to an open conversation about the future of contemporary circus.\n\nIn Munich, the scene is growing steadily, but there is still a lack of fair access to funding, venues and production opportunities. The talk provides space to talk about exactly this – together with artists, organizers and cultural policy representatives.',
              topics: [
                'What role does free circus play in the Bavarian cultural landscape?',
                'How can its visibility and financial stability be strengthened?',
                'What structures and networks are needed to grow sustainably?'
              ],
              goal: 'An honest exchange about challenges and opportunities – to create connections, foster alliances and open up new perspectives for the art form.',
              participants: [
                { name: 'Sanne Kurz', role: 'MdL, Alliance 90/The Greens' },
                { name: 'Walter Heun', role: 'NPN, BLZT, SK3' },
                { name: 'Anke Politz', role: 'BUZZ, Chamäleon Theater Berlin' },
                { name: 'Michael Heiduk', role: 'Representative Munich Scene' }
              ],
              schedule: [
                { time: '14:00', activity: 'Brief insight into the Munich circus scene' },
                { time: '14:15', activity: '30-minute moderated conversation on situation, needs and future perspectives' },
                { time: '14:45', activity: 'Open exchange at theme tables' }
              ],
              themeTables: [
                { title: 'Interest Representation', moderator: 'Anke Politz' },
                { title: 'Needs of the Munich Scene', moderator: 'Michael Heiduk' },
                { title: 'Networks and Structures for Contemporary Circus', moderator: 'Walter Heun' }
              ],
              series: {
                name: 'TIME TO TALK',
                description: 'Part of the nationwide format "Time for Circus", funded by the Fonds Darstellende Künste, in cooperation with leading houses for contemporary circus in Germany.',
                link: 'https://zeitfuerzirkus.de'
              }
            }
          },
          {
            time: '18:00',
            title: 'Show "Häppy Hour"',
            description: 'The Nordic Council • Contemporary circus × comedy • Second performance',
            ticketUrl: 'https://www.freemanfestival.de/tickets',
            price: 'Reduced €12, Regular €18',
            showDetails: {
              shortDescription: 'The Nordic Council • Contemporary circus × comedy • Second performance',
              fullDescription: 'A new Nordic circus creation by The Nordic Council.\n\nHäppy Hour is an ode to the deep dark north and its social culture. It grapples with the contradictory relationship to alcohol, and explores the weird and awkward experiences that the northern nightlife has to offer.\n\nInterpreting it through the lens of contemporary circus and comedy, Häppy Hour approaches real life situations through awkward humour, showing how things aren\'t always that serious, and that it\'s ok to laugh at ourselves, even at our worst.\n\nBy combining juggling, and aerial rope with physical theatre and live music The Nordic Council creates scenes around these topics which evokes a feeling of self-recognition in the audience. "We\'ve all been there" is a feeling that permeates the performance, as the trio stumble their way through the scenes of the highs and lows of Nordic nightlife.',
              by: 'The Nordic Council',
              elements: ['Juggling', 'Aerial Rope', 'Physical Theatre', 'Live Music']
            }
          },
          {
            time: '20:30',
            title: 'Show "How a Spiral Works"',
            description: 'Art for Rainy Days • Meditative, hypnotic circus with dance, hair hanging & aerial rope • Minimalist aesthetics with reinterpreted Baltic folk music',
            ticketUrl: 'https://www.freemanfestival.de/tickets',
            price: 'Reduced €12, Regular €18',
            showDetails: {
              shortDescription: 'Art for Rainy Days • Meditative, hypnotic circus with dance, hair hanging & aerial rope • Minimalist aesthetics with reinterpreted Baltic folk music',
              fullDescription: 'It is a powerful and hypnotic exploration of care under pressure. How do we take care of ourselves—and each other—when everything around us spins out of control? What does compassion look like at great heights, in the middle of a storm, or when pain creeps into the body?\n\nIn this intimate duet, one dancer, one aerialist, and one rope are bound together in an ever-evolving relationship. Their movements circle each other in a delicate choreography of trust, resistance, and release. They hang, spin, support, and respond—tethered to one another in a physical and emotional spiral.\n\nBlending hair hanging, aerial rope, contemporary dance, and hauntingly reimagined Baltic folk music, "How A Spiral Works" is a poetic act of care and resistance.\n\nCreated by renowned British director Jason Dupree, Latvian choreographer Alise Madara Bokaldere, and the extraordinary Lithuanian aerialist Izabele Kuzelyte. With their debut performance, they have struck a resonant chord within the contemporary scene and we are proud to be part of their extensive European tour.',
              by: 'Art for Rainy Days',
              elements: ['Hair Hanging', 'Aerial Rope', 'Contemporary Dance', 'Baltic Folk Music']
            }
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
            type: 'workshop' as const,
            workshopDetails: {
              shortDescription: 'With Alise Madara Bokaldere • Stillness & movement, stage presence, expression beyond disciplines • Approx. 2 hours, in English, max. 20 participants',
              fullDescription: '"Stillness in Motion" explores the potent use of stillness—not only as the foundation for movement but also as a technique to enhance stage presence. We\'ll engage in movement both within and outside of our respective disciplines, allowing you to uncover and later incorporate fundamental principles into your own artistic practice. In many art forms, stillness plays a crucial role—music is enhanced by pauses, words require spaces to be comprehensible, and movement works similarly. Forgetting to stop takes away from our ability to focus on the motion.',
              by: 'Alise Madara Bokaldere',
              aboutTeacher: 'Alise Madara Bokaldere is a Latvian dancer / choreographer. She works very closely with the details and nuanced movement in her creations, focusing on performance presence, movement quality, and concept. She graduated from The Latvian Academy of Culture in 2018, with a BA in The Art of Contemporary Dance. She was awarded the title of Best Contemporary Dancer 2024 in Latvian Dance awards.',
              idealFor: 'This workshop is designed for dancers and circus performers, including acrobats, aerialists, and jugglers who wish to explore new dimensions of expressiveness through the disciplined use of stillness and presence. Suitable also for choreographers and directors seeking to deepen their toolbox and explore concepts of stillness.',
              whatToBring: 'Participants should wear clothing that allows for unrestricted movement, bring water to stay hydrated, and have notebooks and pens for capturing crucial insights and inspirations during discussions.'
            }
          },
          {
            time: '18:00',
            title: 'Show "How a Spiral Works"',
            description: 'Art for Rainy Days • Meditative, hypnotic circus • Repeat of Saturday\'s show',
            ticketUrl: 'https://www.freemanfestival.de/tickets',
            price: 'Reduced €12, Regular €18',
            showDetails: {
              shortDescription: 'Art for Rainy Days • Meditative, hypnotic circus • Repeat of Saturday\'s show',
              fullDescription: 'It is a powerful and hypnotic exploration of care under pressure. How do we take care of ourselves—and each other—when everything around us spins out of control? What does compassion look like at great heights, in the middle of a storm, or when pain creeps into the body?\n\nIn this intimate duet, one dancer, one aerialist, and one rope are bound together in an ever-evolving relationship. Their movements circle each other in a delicate choreography of trust, resistance, and release. They hang, spin, support, and respond—tethered to one another in a physical and emotional spiral.\n\nBlending hair hanging, aerial rope, contemporary dance, and hauntingly reimagined Baltic folk music, "How A Spiral Works" is a poetic act of care and resistance.\n\nCreated by renowned British director Jason Dupree, Latvian choreographer Alise Madara Bokaldere, and the extraordinary Lithuanian aerialist Izabele Kuzelyte. With their debut performance, they have struck a resonant chord within the contemporary scene and we are proud to be part of their extensive European tour.',
              by: 'Art for Rainy Days',
              elements: ['Hair Hanging', 'Aerial Rope', 'Contemporary Dance', 'Baltic Folk Music']
            }
          }
        ]
      }
    ]
  },
  'sharing-is-caring': {
    title: 'Sharing is Caring',
    subtitle: 'A Day Full of Creativity, Movement and Stories',
    description: 'Fold, marvel and listen together: From artistic origami to a captivating Niklo performance to fire-tea-stories in the evening – everything revolves around sharing. Whether ideas, art or moments – we share what brings joy. A day in the warm light of Pepe Dome full of community and creativity.',
    time: 'From 4:30 PM',
    price: 'Tickets available',
    features: [
      { icon: '🎨', text: 'Origami workshop at 4:30 PM' },
      { icon: '🎭', text: 'Niklo performance at 5:30 PM' },
      { icon: '🔥', text: 'Fire-tea-stories at 7:00 PM' },
      { icon: '💬', text: 'Themes: Community, sharing, creativity' }
    ],
    dateRange: 'DECEMBER 6, 2025'
  },
  'open-stage-dec-09': {
    title: 'Les Nuits de Magic',
    subtitle: 'Hosted by Oles Koval',
    description: 'Magicians from Munich showcase various artists and their talents in a diverse show. From dizzying aerial acrobatics to impressive contortion to glamorous drag performances – this colorful mix promises an entertaining evening full of surprises. Each performance is unique, each act a highlight. Experience rising talents and established artists in the intimate atmosphere of Pepe Dome. An evening that celebrates artistry in all its facets and will certainly thrill you.',
    time: '7:00 PM',
    price: 'Tickets available',
    features: [
      { icon: '🎤', text: 'Hosted by Oles Koval' },
      { icon: '🤸', text: 'Breathtaking aerial acrobatics' },
      { icon: '✨', text: 'Impressive contortion acts' },
      { icon: '💃', text: 'Glamorous drag performance' }
    ],
    dateRange: 'DECEMBER 9, 2025'
  },
  'open-stage-dec-16': {
    title: 'Les Nuits de Magic',
    subtitle: 'Hosted by Oles Koval',
    description: 'Magicians from Munich showcase various artists and their talents in a diverse show. From dizzying aerial acrobatics to impressive contortion to glamorous drag performances – this colorful mix promises an entertaining evening full of surprises. Each performance is unique, each act a highlight. Experience rising talents and established artists in the intimate atmosphere of Pepe Dome. An evening that celebrates artistry in all its facets and will certainly thrill you.',
    time: '7:00 PM',
    price: 'Tickets available',
    features: [
      { icon: '🎤', text: 'Hosted by Oles Koval' },
      { icon: '🤸', text: 'Breathtaking aerial acrobatics' },
      { icon: '✨', text: 'Impressive contortion acts' },
      { icon: '💃', text: 'Glamorous drag performance' }
    ],
    dateRange: 'DECEMBER 16, 2025'
  },
  'open-stage-dec-19': {
    title: 'Les Nuits de Magic',
    subtitle: 'Hosted by Oles Koval',
    description: 'Magicians from Munich showcase various artists and their talents in a diverse show. From dizzying aerial acrobatics to impressive contortion to glamorous drag performances – this colorful mix promises an entertaining evening full of surprises. Each performance is unique, each act a highlight. Experience rising talents and established artists in the intimate atmosphere of Pepe Dome. An evening that celebrates artistry in all its facets and will certainly thrill you.',
    time: '7:00 PM',
    price: 'Tickets available',
    features: [
      { icon: '🎤', text: 'Hosted by Oles Koval' },
      { icon: '🤸', text: 'Breathtaking aerial acrobatics' },
      { icon: '✨', text: 'Impressive contortion acts' },
      { icon: '💃', text: 'Glamorous drag performance' }
    ],
    dateRange: 'DECEMBER 19, 2025'
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
