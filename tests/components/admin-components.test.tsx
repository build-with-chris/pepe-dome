/**
 * Admin Components Tests
 * Tests for reusable admin UI components
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PageHeader } from '@/components/admin/PageHeader'
import StatsCard from '@/components/admin/StatsCard'
import { StatusBadge } from '@/components/admin/StatusBadge'

// Mock admin-constants
vi.mock('@/lib/admin-constants', () => ({
  STATUS_COLORS: {
    DRAFT: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    PUBLISHED: 'bg-green-500/10 text-green-400 border-green-500/30',
    SCHEDULED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    SENT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  STATUS_LABELS: {
    DRAFT: 'Entwurf',
    PUBLISHED: 'Veröffentlicht',
    SCHEDULED: 'Geplant',
    SENT: 'Gesendet',
  },
  SUBSCRIBER_STATUS_COLORS: {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    ACTIVE: 'bg-green-500/10 text-green-400 border-green-500/30',
    UNSUBSCRIBED: 'bg-red-500/10 text-red-400 border-red-500/30',
    BOUNCED: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  },
  SUBSCRIBER_STATUS_LABELS: {
    PENDING: 'Ausstehend',
    ACTIVE: 'Aktiv',
    UNSUBSCRIBED: 'Abgemeldet',
    BOUNCED: 'Zurückgewiesen',
  },
}))

describe('PageHeader', () => {
  it('should render title', () => {
    render(<PageHeader title="Newsletter" />)
    expect(screen.getByText('Newsletter')).toBeInTheDocument()
  })

  it('should render description when provided', () => {
    render(<PageHeader title="Events" description="Alle Events verwalten" />)
    expect(screen.getByText('Alle Events verwalten')).toBeInTheDocument()
  })

  it('should not render description when not provided', () => {
    const { container } = render(<PageHeader title="Events" />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(0)
  })

  it('should render action when provided', () => {
    render(
      <PageHeader
        title="Articles"
        action={<button>Neuer Artikel</button>}
      />
    )
    expect(screen.getByText('Neuer Artikel')).toBeInTheDocument()
  })

  it('should not render action container when not provided', () => {
    const { container } = render(<PageHeader title="Test" />)
    // Only the title div should exist
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv.children).toHaveLength(1) // Just the title div
  })

  it('should render title as h1', () => {
    render(<PageHeader title="Dashboard" />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Dashboard')
  })
})

describe('StatsCard', () => {
  it('should render value', () => {
    render(<StatsCard value={42} label="Subscribers" />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('should render label', () => {
    render(<StatsCard value={100} label="Total Events" />)
    expect(screen.getByText('Total Events')).toBeInTheDocument()
  })

  it('should format numeric values with German locale', () => {
    render(<StatsCard value={1234} label="Test" />)
    expect(screen.getByText('1.234')).toBeInTheDocument()
  })

  it('should render string values as-is', () => {
    render(<StatsCard value="55%" label="Open Rate" />)
    expect(screen.getByText('55%')).toBeInTheDocument()
  })

  it('should render description when provided', () => {
    render(<StatsCard value={10} label="Test" description="Last 30 days" />)
    expect(screen.getByText('Last 30 days')).toBeInTheDocument()
  })

  it('should render icon when provided', () => {
    render(
      <StatsCard
        value={5}
        label="Test"
        icon={<span data-testid="icon">📊</span>}
      />
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('should render trend indicator', () => {
    render(<StatsCard value={42} label="Test" trend="up" trendValue="+12%" />)
    expect(screen.getByText('+12%')).toBeInTheDocument()
  })

  it('should render as link when href provided', () => {
    render(<StatsCard value={5} label="Test" href="/admin/subscribers" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/admin/subscribers')
  })

  it('should not render as link when no href', () => {
    render(<StatsCard value={5} label="Test" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should apply compact mode styling', () => {
    const { container } = render(<StatsCard value={5} label="Test" compact />)
    const card = container.querySelector('.p-4')
    expect(card).toBeInTheDocument()
  })
})

describe('StatusBadge', () => {
  it('should render content status label', () => {
    render(<StatusBadge status="DRAFT" />)
    expect(screen.getByText('Entwurf')).toBeInTheDocument()
  })

  it('should render PUBLISHED status', () => {
    render(<StatusBadge status="PUBLISHED" />)
    expect(screen.getByText('Veröffentlicht')).toBeInTheDocument()
  })

  it('should render subscriber status labels', () => {
    render(<StatusBadge status="ACTIVE" type="subscriber" />)
    expect(screen.getByText('Aktiv')).toBeInTheDocument()
  })

  it('should render PENDING subscriber status', () => {
    render(<StatusBadge status="PENDING" type="subscriber" />)
    expect(screen.getByText('Ausstehend')).toBeInTheDocument()
  })

  it('should render UNSUBSCRIBED status', () => {
    render(<StatusBadge status="UNSUBSCRIBED" type="subscriber" />)
    expect(screen.getByText('Abgemeldet')).toBeInTheDocument()
  })

  it('should fallback to raw status when label not found', () => {
    render(<StatusBadge status="UNKNOWN" />)
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <StatusBadge status="DRAFT" className="custom-badge" />
    )
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('custom-badge')
  })

  it('should default to content type', () => {
    render(<StatusBadge status="SENT" />)
    expect(screen.getByText('Gesendet')).toBeInTheDocument()
  })
})
