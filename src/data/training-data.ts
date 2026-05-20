/**
 * Training-Daten — geteilt zwischen der DE- und EN-Trainings-Seite.
 *
 * Die Kurs-Inhalte (description, inhalte, fuerWen, Termine-Listen) sind aktuell
 * nur auf Deutsch. Beide Sprach-Varianten der Trainings-Seite importieren
 * dasselbe Array — das ist im MVP-Zustand bewusst, weil die Detailtexte
 * umfangreich sind. Wir ziehen die Übersetzungen Schritt für Schritt nach.
 *
 * Day-Namen + die optionalen `note`-Felder werden in der EN-Page on-the-fly
 * übersetzt (siehe `localizeWoche()` in src/app/[lang]/training/page.tsx).
 */

import type { Tag } from '@/components/custom/CourseScheduleGrid'

// ── Wochenplan ────────────────────────────────────────────────────────────

export const WOCHE: Tag[] = [
  {
    day: 'Montag',
    trainer: 'Aircrobatics',
    kurse: [
      {
        slug: 'luftakrobatik-aircrobatics-mo-1715',
        time: '17:15 – 18:15',
        title: 'Luftakrobatik',
        sub: 'Jugendliche · mit Aircrobatics',
        target: 'teens',
        trainer: 'Aircrobatics',
        day: 'Montag',
        description:
          'Luftakrobatik-Training für Jugendliche, geführt von Aircrobatics. Trapez, Aerial Hoop und Vertikaltuch — Technik, Kraftaufbau und erste Choreografien in der Höhe.',
        inhalte: [
          'Trapez-Grundlagen',
          'Aerial Hoop & Vertikaltuch',
          'Kraft, Beweglichkeit & Körperspannung',
          'Erste Figuren und Sequenzen',
        ],
        fuerWen: 'Jugendliche, alle Levels',
        bookingUrl: 'https://www.aircrobatic-studios.com',
        bookingLabel: 'Bei Aircrobatic Studios buchen',
        bookingNote: 'Aircrobatics-Kurse werden direkt über Aircrobatic Studios gebucht — nicht über Eversports.',
      },
      {
        slug: 'luftakrobatik-aircrobatics-mo-1815',
        time: '18:15 – 19:15',
        title: 'Luftakrobatik',
        sub: 'Jugendliche · mit Aircrobatics',
        target: 'teens',
        trainer: 'Aircrobatics',
        day: 'Montag',
        description:
          'Luftakrobatik-Training für Jugendliche, geführt von Aircrobatics. Trapez, Aerial Hoop und Vertikaltuch — Technik, Kraftaufbau und erste Choreografien in der Höhe.',
        inhalte: [
          'Trapez-Grundlagen',
          'Aerial Hoop & Vertikaltuch',
          'Kraft, Beweglichkeit & Körperspannung',
          'Erste Figuren und Sequenzen',
        ],
        fuerWen: 'Jugendliche, alle Levels',
        bookingUrl: 'https://www.aircrobatic-studios.com',
        bookingLabel: 'Bei Aircrobatic Studios buchen',
        bookingNote: 'Aircrobatics-Kurse werden direkt über Aircrobatic Studios gebucht — nicht über Eversports.',
      },
    ],
  },
  {
    day: 'Dienstag',
    trainer: 'mit Dayela',
    kurse: [
      {
        slug: 'capoeira-kinder-di',
        time: '16:15 – 17:15',
        title: 'Kinder-Capoeira',
        sub: '3–6 Jahre · Schnupperkurs + 4er-Kurs · mit Dayela',
        target: 'kinder',
        trainer: 'Dayela',
        day: 'Dienstag',
        description:
          'Mit Elementen aus dem brasilianischen Kampftanz Capoeira lernen die Kinder spielerisch, sich mit Rhythmus und Musik in Tierbewegungen zu bewegen: Als Löwe, Spinne, Frosch und Zebra, und mit Purzelbaum, Rad und Handstand werden Motorik und Koordination der Kinder gefördert. Mit einfachen Perkussionsinstrumenten aus Brasilien (Handtrommel, Reco-Reco und Agogô) wird außerdem das Rhythmusgefühl gestärkt. Die Kinder werden animiert, sich selbst zu entdecken und Spaß an der Bewegung zu haben.',
        inhalte: [
          'Tierbewegungen: Löwe, Spinne, Frosch, Zebra',
          'Purzelbaum, Rad und Handstand',
          'Motorik & Koordination spielerisch fördern',
          'Rhythmusgefühl mit Handtrommel, Reco-Reco & Agogô',
          'Bitte mitbringen: Turnschlappen oder Stoppersocken, turnbare Klamotten (keine Jeans, Röcke, Kleider) und etwas zu trinken',
        ],
        fuerWen:
          'Kinder 3–6 Jahre · Schnupperstunde am 12.05. (unverbindlich), danach Anmeldung für den 4er-Kurs am 19.05. / 26.05. / 02.06. / 09.06. — damit die Kinder dranbleiben und sich eine vertraute Gruppe entwickelt.',
        termineTitel: 'Die nächsten Capoeira-Dienstage',
        termine: [
          {
            date: '12.05.',
            title: 'Schnupperstunde',
            trainer: 'Dayela',
            sub: 'Unverbindlich · einfach vorbeikommen',
            highlight: true,
            badge: 'Schnupperkurs',
          },
          { date: '19.05.', title: '1. Termin · 4er-Kurs', trainer: 'Dayela' },
          { date: '26.05.', title: '2. Termin · 4er-Kurs', trainer: 'Dayela' },
          { date: '02.06.', title: '3. Termin · 4er-Kurs', trainer: 'Dayela' },
          { date: '09.06.', title: '4. Termin · 4er-Kurs', trainer: 'Dayela' },
        ],
      },
      {
        slug: 'capoeira-erwachsene-di',
        time: '17:30 – 19:00',
        title: 'Capoeira Workout',
        sub: 'Erwachsene · Schnupperkurs + 4er-Kurs · mit Dayela',
        target: 'erwachsene',
        trainer: 'Dayela',
        day: 'Dienstag',
        description:
          'Powerstyling mit Capoeira-Elementen ist ein intensives und spielerisches Ganzkörpertraining: Balance, Kraft, Koordination und Soft-Akrobatik Skills werden in „Animal Flow"-artigen Sequenzen zu grooviger Musik trainiert und neue Bewegungsmöglichkeiten exploriert. Zum Schluss wird das Gelernte im typischen Capoeira-Spielflow umgesetzt. Ein schweißtreibender Spaß für alle.',
        inhalte: [
          'Balance, Kraft & Koordination',
          'Soft-Akrobatik Skills',
          '„Animal Flow"-artige Sequenzen zu grooviger Musik',
          'Capoeira-Spielflow am Ende der Stunde',
        ],
        fuerWen:
          'Erwachsene, alle Levels · Schnupperstunde am 12.05. (unverbindlich), danach Anmeldung für den 4er-Kurs am 19.05. / 26.05. / 02.06. / 09.06. — damit man wirklich dranbleibt und Fortschritte spürbar werden.',
        termineTitel: 'Die nächsten Capoeira-Dienstage',
        termine: [
          {
            date: '12.05.',
            title: 'Schnupperstunde',
            trainer: 'Dayela',
            sub: 'Unverbindlich · einfach vorbeikommen',
            highlight: true,
            badge: 'Schnupperkurs',
          },
          { date: '19.05.', title: '1. Termin · 4er-Kurs', trainer: 'Dayela' },
          { date: '26.05.', title: '2. Termin · 4er-Kurs', trainer: 'Dayela' },
          { date: '02.06.', title: '3. Termin · 4er-Kurs', trainer: 'Dayela' },
          { date: '09.06.', title: '4. Termin · 4er-Kurs', trainer: 'Dayela' },
        ],
      },
    ],
  },
  {
    day: 'Mittwoch',
    trainer: 'Michael Heiduk · Aircrobatics',
    kurse: [
      {
        slug: 'kinder-akrobatik-mi',
        time: '16:30 – 18:00',
        title: 'Kinder Akrobatik',
        sub: '5–12 Jahre · mit Michael Heiduk',
        target: 'kinder',
        trainer: 'Michael Heiduk',
        day: 'Mittwoch',
        description:
          'Spielerische Akrobatik für Kinder mit Michael Heiduk. Luftakrobatik, Tellerdrehen, Jonglieren — und alles, worauf die Kids gerade Lust haben. Eine Stunde voller Bewegung, Kreativität und Spaß.',
        inhalte: [
          'Luftakrobatik (kindgerecht)',
          'Tellerdrehen',
          'Jonglieren',
          'Spielerische Bodenakrobatik',
          'Freie Wahl je nach Lust der Gruppe',
        ],
        fuerWen: 'Kinder 5–12 Jahre',
      },
      {
        slug: 'luftakrobatik-aircrobatics-mi-1700',
        time: '17:00 – 18:00',
        title: 'Luftakrobatik',
        sub: 'Jugendliche · mit Aircrobatics',
        target: 'teens',
        trainer: 'Aircrobatics',
        day: 'Mittwoch',
        description:
          'Luftakrobatik-Training für Jugendliche, geführt von Aircrobatics. Trapez, Aerial Hoop und Vertikaltuch — Technik, Kraftaufbau und erste Choreografien in der Höhe.',
        inhalte: [
          'Trapez-Grundlagen',
          'Aerial Hoop & Vertikaltuch',
          'Kraft, Beweglichkeit & Körperspannung',
          'Erste Figuren und Sequenzen',
        ],
        fuerWen: 'Jugendliche, alle Levels',
        bookingUrl: 'https://www.aircrobatic-studios.com',
        bookingLabel: 'Bei Aircrobatic Studios buchen',
        bookingNote: 'Aircrobatics-Kurse werden direkt über Aircrobatic Studios gebucht — nicht über Eversports.',
      },
      {
        slug: 'luftakrobatik-aircrobatics-mi-1800',
        time: '18:00 – 19:00',
        title: 'Luftakrobatik',
        sub: 'Jugendliche · mit Aircrobatics',
        target: 'teens',
        trainer: 'Aircrobatics',
        day: 'Mittwoch',
        description:
          'Luftakrobatik-Training für Jugendliche, geführt von Aircrobatics. Trapez, Aerial Hoop und Vertikaltuch — Technik, Kraftaufbau und erste Choreografien in der Höhe.',
        inhalte: [
          'Trapez-Grundlagen',
          'Aerial Hoop & Vertikaltuch',
          'Kraft, Beweglichkeit & Körperspannung',
          'Erste Figuren und Sequenzen',
        ],
        fuerWen: 'Jugendliche, alle Levels',
        bookingUrl: 'https://www.aircrobatic-studios.com',
        bookingLabel: 'Bei Aircrobatic Studios buchen',
        bookingNote: 'Aircrobatics-Kurse werden direkt über Aircrobatic Studios gebucht — nicht über Eversports.',
      },
    ],
  },
  {
    day: 'Donnerstag',
    trainer: '',
    kurse: [],
    note: 'Voraussichtlich Luftakrobatik-Kurse mit Aircrobatics — Termine folgen.',
  },
  {
    day: 'Freitag',
    trainer: 'Dani & Chris',
    kurse: [
      {
        slug: 'urban-acrobatics-fr',
        time: '15:30 – 17:00',
        title: 'Urban Acrobatics',
        sub: 'Breaking meets Akrobatik · Jugendliche & Erwachsene',
        target: 'erwachsene',
        trainer: 'Dani',
        day: 'Freitag',
        description:
          'Ein dynamischer Kurs an der Schnittstelle von Breaking und Akrobatik — mit Fokus auf Körperkontrolle, Kraft und fließende Bewegungsabläufe. Breaking-Elemente werden neu interpretiert und in einen rein akrobatischen Kontext übertragen.',
        inhalte: ['Balance', 'Kraft', 'Dynamik', 'Körperkontrolle', 'Flows'],
        fuerWen: 'Jugendliche und Erwachsene, Anfänger bis Fortgeschrittene',
      },
      {
        slug: 'cyr-wheel-fr',
        time: '17:00 – 18:30',
        title: 'Cyr Wheel',
        sub: 'Jugendliche & Erwachsene · an showfreien Freitagen',
        target: 'erwachsene',
        trainer: 'Chris',
        day: 'Freitag',
        description:
          'Das Cyr Wheel — auch Deutsches Rad genannt — gehört zu den spektakulärsten Disziplinen des zeitgenössischen Zirkus. In diesem Kurs lernst du Grundtechniken wie Wave, Pirouette und Coin, baust Körpergefühl auf und entwickelst eigene Bewegungsabläufe im Rad. Findet an Freitagen ohne Show statt — aktuelle Termine immer auf der Startseite.',
        inhalte: [
          'Cyr Wheel Grundtechniken (Wave, Pirouette, Coin)',
          'Körperspannung & Balance im Rad',
          'Kraft- und Konditionsaufbau',
          'Erste Sequenzen und Übergänge',
        ],
        fuerWen: 'Jugendliche & Erwachsene · Einsteiger:innen willkommen',
      },
    ],
    note: 'Cyr Wheel findet an showfreien Freitagen statt — Termine immer auf der Startseite.',
  },
  {
    day: 'Samstag',
    trainer: '',
    kurse: [],
    note: 'In Planung — Workshops & Vermietung folgen',
  },
  {
    day: 'Sonntag',
    trainer: 'Tina & Oskar (Feuerinsel)',
    kurse: [
      {
        slug: 'flow-arts-basics-so',
        time: '17:00 – 18:00',
        title: 'Flow Arts Basics',
        sub: 'Buugeng & Doppelstäbe · Tina & Oskar (Feuerinsel)',
        target: 'erwachsene',
        trainer: 'Tina & Oskar (Feuerinsel München)',
        day: 'Sonntag',
        termineTitel: 'Die nächsten Sonntage',
        termine: [
          {
            date: '03.05.',
            title: 'Doppelstäbe',
            trainer: 'Tina (Feuerinsel)',
            sub: '🎟  Spendenbasis 5 – 15 € · keine Anmeldung nötig',
            highlight: true,
            badge: 'Schnupperkurs',
          },
          { date: '10.05.', title: 'Buugeng',   trainer: 'Tina (Feuerinsel)' },
          { date: '17.05.', title: 'Flow Arts', trainer: 'Oskar (Feuerinsel)' },
          { date: '14.06.', title: 'Flow Arts', trainer: 'Tina (Feuerinsel)' },
          { date: '21.06.', title: 'Flow Arts', trainer: 'Oskar (Feuerinsel)' },
          { date: '28.06.', title: 'Flow Arts', trainer: 'Tina (Feuerinsel)' },
          { date: '05.07.', title: 'Flow Arts', trainer: 'Tina (Feuerinsel)' },
          { date: '12.07.', title: 'Flow Arts', trainer: 'Oskar (Feuerinsel)' },
        ],
        description:
          'Tauche ein in die faszinierende Welt der Flow Arts. Mit Buugeng und Doppelstäben lernst du fließende Bewegungen, die Körpergefühl, Koordination und Kreativität verbinden. Die geschwungenen Formen der Buugeng erzeugen optische Illusionen, die Doppelstäbe bringen rhythmische Dynamik. Schritt für Schritt baust du dir deinen eigenen Flow. Geleitet von Oskar von der Feuerinsel München — mit dem Ziel, den FlowArts-Nachwuchs zu fördern und individuell auf alle Levels einzugehen.',
        inhalte: [
          'Buugeng: Grundlagen & Bewegungsprinzipien',
          'Drehen mit Händen & Fingern, Ebenen & Symmetrie',
          'Doppelstäbe: gleichzeitige & versetzte Bewegungen',
          'Erste Trick-Kombinationen, Würfe & Fishtails',
          'Koordination, Kontrolle & Körperwahrnehmung',
          'Fokus auf Flow, Timing & Illusionseffekte',
        ],
        fuerWen: 'Anfänger:innen willkommen — mehr Erfahrung kein Problem, individuelle Begleitung möglich',
      },
      {
        slug: 'dynamic-flow-so',
        time: '18:00 – 19:00',
        title: 'Dynamic Flow',
        sub: 'Levistick (Long String) & Rope Dart · Tina & Oskar (Feuerinsel)',
        target: 'erwachsene',
        trainer: 'Tina & Oskar (Feuerinsel München)',
        day: 'Sonntag',
        termineTitel: 'Die nächsten Sonntage',
        termine: [
          {
            date: '03.05.',
            title: 'Doppelstäbe',
            trainer: 'Tina (Feuerinsel)',
            sub: '🎟  Spendenbasis 5 – 15 € · keine Anmeldung nötig',
            highlight: true,
            badge: 'Schnupperkurs',
          },
          { date: '10.05.', title: 'Buugeng',   trainer: 'Tina (Feuerinsel)' },
          { date: '17.05.', title: 'Flow Arts', trainer: 'Oskar (Feuerinsel)' },
          { date: '14.06.', title: 'Flow Arts', trainer: 'Tina (Feuerinsel)' },
          { date: '21.06.', title: 'Flow Arts', trainer: 'Oskar (Feuerinsel)' },
          { date: '28.06.', title: 'Flow Arts', trainer: 'Tina (Feuerinsel)' },
          { date: '05.07.', title: 'Flow Arts', trainer: 'Tina (Feuerinsel)' },
          { date: '12.07.', title: 'Flow Arts', trainer: 'Oskar (Feuerinsel)' },
        ],
        description:
          'Zwei besonders faszinierende Flow-Tools: Der Levistick, der mit langer Schnur (Long String) scheinbar schwerelos schwebt, und der Rope Dart, der durch kraftvolle, kreisende Bewegungen beeindruckt. Du lernst grundlegende Techniken, erste Tricks und Übergänge — und entwickelst ein Gefühl für Timing, Kontrolle und Flow. Geleitet von Oskar von der Feuerinsel München, der den FlowArts-Nachwuchs gezielt fördert und gerne individuell auf jede:n eingeht.',
        inhalte: [
          'Levistick mit Long String: Setups & Schnurkonfigurationen',
          'Übergänge zwischen Tricks, Illusionen & visuelle Täuschungen',
          'Körperhaltung, Rhythmus & Präsentation',
          'Rope Dart: Basis-Schwünge & Wicklungen (Wraps)',
          'Richtungswechsel, Footwork & Körperposition',
          'Erste einfache Tricks & Kombos',
        ],
        fuerWen: 'Anfänger:innen willkommen — mehr Erfahrung kein Problem, individuelle Begleitung möglich',
      },
    ],
    note: 'Termine bei Klick auf Flow Arts Basics oder Dynamic Flow.',
  },
]

// ── Disziplinen ───────────────────────────────────────────────────────────

export const DISCIPLINES = [
  { name: 'Aerial Arts',       description: 'Vertikaltuch, Trapez, Aerial Hoop, Strapaten, Spanish Web', icon: '🎪' },
  { name: 'Ground Arts',       description: 'Handstand, Akrobatik, Kontorsion, Cyr Wheel, Jonglage',     icon: '🤸' },
  { name: 'Movement & Flow',   description: 'Contemporary Dance, Floor Work, Improvisation',             icon: '💃' },
  { name: 'Conditioning',      description: 'Flexibilität, Verletzungsprävention, Kraftaufbau',          icon: '💪' },
]
