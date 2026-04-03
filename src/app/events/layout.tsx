import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events & Programm',
  description: 'Alle Events im Pepe Dome München: Shows, Workshops, Festivals, Premieren und Training. Entdecke das aktuelle Programm.',
  alternates: { canonical: 'https://www.pepe-dome.de/events' },
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children
}
