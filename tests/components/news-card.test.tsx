/**
 * NewsCard Component Tests
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import NewsCard from '@/components/custom/NewsCard'

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

describe('NewsCard', () => {
  const defaultProps = {
    title: 'Neues Programm 2025',
    excerpt: 'Das Pepe Dome startet mit einem neuen Programm ins Jahr 2025.',
    date: '10. Januar 2025',
    author: 'Redaktion',
    category: 'Ankündigung',
  }

  it('should render title', () => {
    render(<NewsCard {...defaultProps} />)
    expect(screen.getByText('Neues Programm 2025')).toBeInTheDocument()
  })

  it('should render excerpt', () => {
    render(<NewsCard {...defaultProps} />)
    expect(screen.getByText(/Pepe Dome startet/)).toBeInTheDocument()
  })

  it('should render date', () => {
    render(<NewsCard {...defaultProps} />)
    expect(screen.getByText('10. Januar 2025')).toBeInTheDocument()
  })

  it('should render author', () => {
    render(<NewsCard {...defaultProps} />)
    expect(screen.getByText('Redaktion')).toBeInTheDocument()
  })

  it('should render category with gold styling', () => {
    render(<NewsCard {...defaultProps} />)
    const category = screen.getByText('Ankündigung')
    expect(category).toBeInTheDocument()
    expect(category.className).toContain('uppercase')
  })

  it('should render separator between author and date', () => {
    render(<NewsCard {...defaultProps} />)
    expect(screen.getByText('|')).toBeInTheDocument()
  })

  it('should not render separator when no author', () => {
    render(<NewsCard {...defaultProps} author={undefined} />)
    expect(screen.queryByText('|')).not.toBeInTheDocument()
  })

  it('should render as link when href provided', () => {
    render(<NewsCard {...defaultProps} href="/news/article-1" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/news/article-1')
  })

  it('should render as div when no href', () => {
    render(<NewsCard {...defaultProps} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should render image when provided', () => {
    render(<NewsCard {...defaultProps} image="/images/news.jpg" />)
    const img = screen.getByAltText('Neues Programm 2025')
    expect(img).toHaveAttribute('src', '/images/news.jpg')
  })

  it('should show placeholder SVG when no image', () => {
    render(<NewsCard {...defaultProps} />)
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should apply featured class for 2-column span', () => {
    const { container } = render(<NewsCard {...defaultProps} featured />)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('md:col-span-2')
  })

  it('should not show excerpt when not provided', () => {
    render(<NewsCard {...defaultProps} excerpt={undefined} />)
    expect(screen.queryByText(/Pepe Dome startet/)).not.toBeInTheDocument()
  })

  it('should not show category when not provided', () => {
    render(<NewsCard {...defaultProps} category={undefined} />)
    expect(screen.queryByText('Ankündigung')).not.toBeInTheDocument()
  })

  it('should handle minimal props', () => {
    render(<NewsCard title="Simple" date="01.01.2025" />)
    expect(screen.getByText('Simple')).toBeInTheDocument()
    expect(screen.getByText('01.01.2025')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <NewsCard {...defaultProps} className="my-custom-class" />
    )
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('my-custom-class')
  })

  it('should have hover effect classes', () => {
    const { container } = render(<NewsCard {...defaultProps} />)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('hover:-translate-y-1')
    expect(card.className).toContain('hover:border-[var(--pepe-gold)]')
  })

  it('should apply cursor-pointer class when href is provided', () => {
    const { container } = render(<NewsCard {...defaultProps} href="/test" />)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('cursor-pointer')
  })
})
