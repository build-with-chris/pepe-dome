/**
 * Admin Articles API Route Tests
 * Tests for article CRUD operations via API routes
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'test-admin-user' }),
}))

import { GET, POST } from '@/app/api/admin/articles/route'

describe('Admin Articles API', () => {
  describe('GET /api/admin/articles', () => {
    beforeEach(async () => {
      await prisma.article.createMany({
        data: [
          {
            slug: 'test-article-1',
            title: 'First Article',
            excerpt: 'First excerpt',
            content: 'First article content...',
            category: 'Ankündigung',
            author: 'Admin',
            status: 'PUBLISHED',
            publishedAt: new Date(),
          },
          {
            slug: 'test-article-2',
            title: 'Second Article',
            excerpt: 'Second excerpt',
            content: 'Second article content...',
            category: 'Bericht',
            author: 'Editor',
            status: 'DRAFT',
          },
          {
            slug: 'test-article-3',
            title: 'Third Article',
            excerpt: 'Third excerpt',
            content: 'Third article content...',
            category: 'Ankündigung',
            author: 'Admin',
            status: 'PUBLISHED',
            publishedAt: new Date(),
          },
        ],
      })
    })

    it('should return list of articles', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/articles')
      const response = await GET(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.articles).toBeDefined()
      expect(body.articles.length).toBe(3)
    })

    it('should filter by status', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/articles?status=DRAFT'
      )
      const response = await GET(request)
      const body = await response.json()

      expect(body.articles.length).toBe(1)
      expect(body.articles[0].title).toBe('Second Article')
    })

    it('should filter by category', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/articles?category=Ankündigung'
      )
      const response = await GET(request)
      const body = await response.json()

      expect(body.articles.length).toBe(2)
    })

    it('should paginate results', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/articles?page=1&limit=2'
      )
      const response = await GET(request)
      const body = await response.json()

      expect(body.articles.length).toBe(2)
      expect(body.pagination.total).toBe(3)
      expect(body.pagination.pages).toBe(2)
    })

    it('should order by createdAt descending', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/articles')
      const response = await GET(request)
      const body = await response.json()

      const dates = body.articles.map((a: any) => new Date(a.createdAt).getTime())
      expect(dates).toEqual([...dates].sort((a, b) => b - a))
    })
  })

  describe('POST /api/admin/articles', () => {
    it('should create a new article', async () => {
      const articleData = {
        title: 'New Article',
        excerpt: 'A short description',
        content: 'Full article content here...',
        category: 'News',
        author: 'Test Author',
      }

      const request = new NextRequest('http://localhost:3000/api/admin/articles', {
        method: 'POST',
        body: JSON.stringify(articleData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.title).toBe('New Article')
      expect(body.slug).toBe('new-article')
      expect(body.status).toBe('DRAFT')
      expect(body.createdBy).toBe('test-admin-user')
    })

    it('should set publishedAt when status is PUBLISHED', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Published Article',
          excerpt: 'Published excerpt',
          content: 'Published content',
          category: 'News',
          author: 'Admin',
          status: 'PUBLISHED',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.publishedAt).toBeDefined()
    })

    it('should not set publishedAt for DRAFT articles', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Draft Article',
          excerpt: 'Draft excerpt',
          content: 'Draft content',
          category: 'News',
          author: 'Admin',
          status: 'DRAFT',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(body.publishedAt).toBeNull()
    })

    it('should reject missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/articles', {
        method: 'POST',
        body: JSON.stringify({ title: 'Only Title' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should accept article with tags', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Tagged Article',
          excerpt: 'With tags',
          content: 'Content here',
          category: 'News',
          author: 'Admin',
          tags: ['comedy', 'show', 'highlight'],
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.tags).toEqual(['comedy', 'show', 'highlight'])
    })

    it('should handle German umlauts in slug', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Über die Bühne',
          excerpt: 'Ein Artikel',
          content: 'Inhalt...',
          category: 'Bericht',
          author: 'Admin',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.slug).toBe('ueber-die-buehne')
    })

    it('should link article to events when eventIds provided', async () => {
      const event = await prisma.event.create({
        data: {
          slug: 'linked-event',
          title: 'Linked Event',
          description: 'An event to link',
          date: new Date(),
          location: 'PEPE Dome',
          category: 'SHOW',
          status: 'PUBLISHED',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Article With Events',
          excerpt: 'Linked to events',
          content: 'Content...',
          category: 'Bericht',
          author: 'Admin',
          eventIds: [event.id],
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.events).toHaveLength(1)
      expect(body.events[0].event.id).toBe(event.id)
    })
  })
})
