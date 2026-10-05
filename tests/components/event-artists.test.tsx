/**
 * „Wer auftritt" auf der Eventseite.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EventArtists from '@/components/events/EventArtists'
import { transformArtist } from '@/lib/db-data'
import type { ArtistData } from '@/lib/db-data'

const labels = {
  title: 'Wer auftritt',
  instagram: '{name} auf Instagram',
  website: 'Website von {name}',
}

function artist(overrides: Partial<ArtistData> = {}): ArtistData {
  return {
    id: 'a1',
    slug: 'jana',
    name: 'Jana',
    imageUrl: null,
    bio: 'Luftakrobatin aus München.',
    instagramUrl: 'https://www.instagram.com/jana/',
    websiteUrl: 'https://jana.example',
    ...overrides,
  }
}

describe('EventArtists', () => {
  it('rendert nichts ohne Artists', () => {
    const { container } = render(<EventArtists artists={[]} labels={labels} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('zeigt Überschrift, Namen in Reihenfolge und Bio', () => {
    render(
      <EventArtists
        artists={[artist(), artist({ id: 'a2', slug: 'max', name: 'Max', bio: 'Jongleur.' })]}
        labels={labels}
      />
    )
    expect(screen.getByRole('heading', { name: 'Wer auftritt' })).toBeInTheDocument()
    const namen = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(namen).toEqual(['Jana', 'Max'])
    expect(screen.getByText('Jongleur.')).toBeInTheDocument()
  })

  it('öffnet Links in neuem Tab mit noopener und benennt sie für Screenreader', () => {
    render(<EventArtists artists={[artist()]} labels={labels} />)
    const insta = screen.getByRole('link', { name: 'Jana auf Instagram' })
    expect(insta).toHaveAttribute('href', 'https://www.instagram.com/jana/')
    expect(insta).toHaveAttribute('target', '_blank')
    expect(insta).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByRole('link', { name: 'Website von Jana' })).toHaveAttribute(
      'href',
      'https://jana.example'
    )
  })

  it('lässt fehlende Links weg', () => {
    render(
      <EventArtists artists={[artist({ instagramUrl: null, websiteUrl: null })]} labels={labels} />
    )
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})

describe('transformArtist', () => {
  const row = {
    id: 'a1',
    slug: 'jana',
    name: 'Jana',
    imageUrl: null,
    bio: 'Luftakrobatin aus München.',
    translations: { en: { bio: 'Aerialist from Munich.' } },
    instagramUrl: null,
    websiteUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('nimmt auf Englisch die EN-Bio', () => {
    expect(transformArtist(row, 'en').bio).toBe('Aerialist from Munich.')
    expect(transformArtist(row, 'de').bio).toBe('Luftakrobatin aus München.')
  })

  it('fällt ohne EN-Bio auf Deutsch zurück', () => {
    expect(transformArtist({ ...row, translations: {} }, 'en').bio).toBe('Luftakrobatin aus München.')
    expect(transformArtist({ ...row, translations: { en: { bio: '  ' } } }, 'en').bio).toBe(
      'Luftakrobatin aus München.'
    )
  })
})
