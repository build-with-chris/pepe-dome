/**
 * EventCard Component Tests
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import EventCard from '@/components/custom/EventCard'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>{children}</a>
  ),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

describe('EventCard', () => {
  const defaultProps = {
    title: 'Comedy Night',
    date: '15. März 2025',
    category: 'Show',
    description: 'Eine lustige Comedy Show',
  }

  it('should render title', () => {
    render(<EventCard {...defaultProps} />)
    expect(screen.getByText('Comedy Night')).toBeInTheDocument()
  })

  it('should render date', () => {
    render(<EventCard {...defaultProps} />)
    expect(screen.getByText('15. März 2025')).toBeInTheDocument()
  })

  it('should render category badge', () => {
    render(<EventCard {...defaultProps} />)
    expect(screen.getByText('Show')).toBeInTheDocument()
  })

  it('should render description', () => {
    render(<EventCard {...defaultProps} />)
    expect(screen.getByText('Eine lustige Comedy Show')).toBeInTheDocument()
  })

  it('should render as link when href provided', () => {
    render(<EventCard {...defaultProps} href="/events/1" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/events/1')
  })

  it('should render as div when no href', () => {
    render(<EventCard {...defaultProps} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should render image when provided', () => {
    render(<EventCard {...defaultProps} image="/images/show.jpg" />)
    const img = screen.getByAltText('Comedy Night')
    expect(img).toHaveAttribute('src', '/images/show.jpg')
  })

  it('should show placeholder when no image', () => {
    render(<EventCard {...defaultProps} />)
    // Should render SVG placeholder
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should apply featured class', () => {
    const { container } = render(<EventCard {...defaultProps} featured />)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('md:col-span-2')
  })

  it('should apply compact layout', () => {
    const { container } = render(<EventCard {...defaultProps} compact />)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('flex-row')
  })

  it('should not show description in compact mode', () => {
    render(<EventCard {...defaultProps} compact />)
    expect(screen.queryByText('Eine lustige Comedy Show')).not.toBeInTheDocument()
  })

  it('should show date in content area for compact mode', () => {
    render(<EventCard {...defaultProps} compact />)
    const dateElements = screen.getAllByText('15. März 2025')
    expect(dateElements.length).toBeGreaterThanOrEqual(1)
  })

  it('should handle missing optional props', () => {
    render(<EventCard title="Minimal" date="01.01.2025" />)
    expect(screen.getByText('Minimal')).toBeInTheDocument()
    expect(screen.getByText('01.01.2025')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <EventCard {...defaultProps} className="custom-class" />
    )
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('custom-class')
  })

  it('should have hover effect classes', () => {
    const { container } = render(<EventCard {...defaultProps} />)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('hover:-translate-y-1')
  })
})
