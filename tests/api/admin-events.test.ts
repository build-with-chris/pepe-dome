/**
 * Admin Events API Route Tests
 * Tests for event CRUD operations via API routes
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'test-admin-user' }),
}))

import { GET, POST } from '@/app/api/admin/events/route'

describe('Admin Events API', () => {
  describe('GET /api/admin/events', () => {
    beforeEach(async () => {
      await prisma.event.createMany({
        data: [
          {
            slug: 'test-show-1',
            title: 'Comedy Night',
            description: 'A fun comedy show',
            date: new Date('2025-03-15'),
            location: 'PEPE Dome',
            category: 'SHOW',
            status: 'PUBLISHED',
          },
          {
            slug: 'test-workshop-1',
            title: 'Juggling Workshop',
            description: 'Learn to juggle',
            date: new Date('2025-03-20'),
            location: 'PEPE Dome',
            category: 'WORKSHOP',
            status: 'DRAFT',
          },
          {
            slug: 'test-show-2',
            title: 'Magic Show',
            description: 'An amazing magic show',
            date: new Date('2025-04-01'),
            location: 'PEPE Dome',
            category: 'SHOW',
            status: 'PUBLISHED',
          },
        ],
      })
    })

    it('should return list of events', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/events')
      const response = await GET(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.events).toBeDefined()
      expect(body.events.length).toBe(3)
      expect(body.pagination.total).toBe(3)
    })

    it('should filter by status', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/events?status=PUBLISHED'
      )
      const response = await GET(request)
      const body = await response.json()

      expect(body.events.length).toBe(2)
      expect(body.events.every((e: any) => e.status === 'PUBLISHED')).toBe(true)
    })

    it('should filter by category', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/events?category=WORKSHOP'
      )
      const response = await GET(request)
      const body = await response.json()

      expect(body.events.length).toBe(1)
      expect(body.events[0].title).toBe('Juggling Workshop')
    })

    it('should paginate results', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/events?page=1&limit=2'
      )
      const response = await GET(request)
      const body = await response.json()

      expect(body.events.length).toBe(2)
      expect(body.pagination.total).toBe(3)
      expect(body.pagination.pages).toBe(2)
    })

    it('should order by date ascending', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/events')
      const response = await GET(request)
      const body = await response.json()

      const dates = body.events.map((e: any) => new Date(e.date).getTime())
      expect(dates).toEqual([...dates].sort((a, b) => a - b))
    })
  })

  describe('POST /api/admin/events', () => {
    it('should create a new event', async () => {
      const eventData = {
        title: 'New Comedy Show',
        description: 'A brand new comedy show',
        date: '2025-05-15T20:00:00.000Z',
        location: 'PEPE Dome',
        category: 'SHOW',
      }

      const request = new NextRequest('http://localhost:3000/api/admin/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.title).toBe('New Comedy Show')
      expect(body.slug).toBe('new-comedy-show')
      expect(body.category).toBe('SHOW')
      expect(body.createdBy).toBe('test-admin-user')
    })

    it('should generate unique slug when title conflicts', async () => {
      await prisma.event.create({
        data: {
          slug: 'comedy-show',
          title: 'Comedy Show',
          description: 'Existing',
          date: new Date(),
          location: 'PEPE Dome',
          category: 'SHOW',
          status: 'PUBLISHED',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/events', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Comedy Show',
          description: 'New one',
          date: '2025-06-01T20:00:00.000Z',
          location: 'PEPE Dome',
          category: 'SHOW',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.slug).not.toBe('comedy-show')
      expect(body.slug).toContain('comedy-show')
    })

    it('should reject missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/events', {
        method: 'POST',
        body: JSON.stringify({ title: 'Incomplete' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body.error).toBe('Validation error')
    })

    it('should accept event with all optional fields', async () => {
      const fullEvent = {
        title: 'Full Event',
        subtitle: 'With all fields',
        description: 'Complete event with all fields',
        date: '2025-07-01T19:00:00.000Z',
        endDate: '2025-07-01T22:00:00.000Z',
        time: '19:00',
        location: 'PEPE Dome',
        category: 'FESTIVAL',
        ticketUrl: 'https://tickets.example.com',
        price: '25€',
        imageUrl: 'https://images.example.com/event.jpg',
        featured: true,
        highlights: ['Highlight 1', 'Highlight 2'],
        status: 'PUBLISHED',
      }

      const request = new NextRequest('http://localhost:3000/api/admin/events', {
        method: 'POST',
        body: JSON.stringify(fullEvent),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.subtitle).toBe('With all fields')
      expect(body.featured).toBe(true)
      expect(body.highlights).toEqual(['Highlight 1', 'Highlight 2'])
    })

    it('should reject invalid category', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/events', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Invalid',
          description: 'Test',
          date: '2025-01-01',
          location: 'Here',
          category: 'INVALID_CATEGORY',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })
})
