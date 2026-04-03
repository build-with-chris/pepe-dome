import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktiere den Pepe Dome München. Anfragen zu Events, Raumvermietung, Kooperationen und mehr.',
  alternates: { canonical: 'https://www.pepe-dome.de/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
