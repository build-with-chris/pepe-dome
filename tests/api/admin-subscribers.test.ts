/**
 * Admin Subscribers API Route Tests
 * Tests for subscriber listing and admin creation via API routes
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SubscriberStatus } from '@prisma/client'
import { GET, POST } from '@/app/api/admin/subscribers/route'

// Mock email sending
vi.mock('@/lib/email-send', () => ({
  sendConfirmationEmail: vi.fn().mockResolvedValue({ id: 'mock-id' }),
}))

describe('Admin Subscribers API', () => {
  describe('GET /api/admin/subscribers', () => {
    beforeEach(async () => {
      await prisma.subscriber.createMany({
        data: [
          { email: 'active1@example.com', firstName: 'Alice', status: SubscriberStatus.ACTIVE, confirmedAt: new Date(), interests: ['shows-events'] },
          { email: 'active2@example.com', firstName: 'Bob', status: SubscriberStatus.ACTIVE, confirmedAt: new Date(), interests: ['workshops'] },
          { email: 'pending1@example.com', status: SubscriberStatus.PENDING, doubleOptInToken: 'token1' },
          { email: 'unsub1@example.com', status: SubscriberStatus.UNSUBSCRIBED, unsubscribedAt: new Date() },
        ],
      })
    })

    it('should return all subscribers with pagination', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/subscribers')
      const response = await GET(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.data).toHaveLength(4)
      expect(body.meta.pagination.total).toBe(4)
    })

    it('should filter by ACTIVE status', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/subscribers?status=ACTIVE'
      )
      const response = await GET(request)
      const body = await response.json()

      expect(body.data).toHaveLength(2)
      expect(body.data.every((s: any) => s.status === 'ACTIVE')).toBe(true)
    })

    it('should filter by PENDING status', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/subscribers?status=PENDING'
      )
      const response = await GET(request)
      const body = await response.json()

      expect(body.data).toHaveLength(1)
      expect(body.data[0].email).toBe('pending1@example.com')
    })

    it('should paginate correctly', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/subscribers?page=1&limit=2'
      )
      const response = await GET(request)
      const body = await response.json()

      expect(body.data).toHaveLength(2)
      expect(body.meta.pagination.page).toBe(1)
      expect(body.meta.pagination.limit).toBe(2)
      expect(body.meta.pagination.total).toBe(4)
      expect(body.meta.pagination.totalPages).toBe(2)
    })

    it('should order by createdAt descending', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/subscribers')
      const response = await GET(request)
      const body = await response.json()

      const dates = body.data.map((s: any) => new Date(s.createdAt).getTime())
      expect(dates).toEqual([...dates].sort((a, b) => b - a))
    })

    it('should return selected fields only (no token)', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/subscribers')
      const response = await GET(request)
      const body = await response.json()

      body.data.forEach((s: any) => {
        expect(s).toHaveProperty('id')
        expect(s).toHaveProperty('email')
        expect(s).toHaveProperty('status')
        expect(s).not.toHaveProperty('doubleOptInToken')
      })
    })

    it('should include meta timestamp', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/subscribers')
      const response = await GET(request)
      const body = await response.json()

      expect(body.meta.timestamp).toBeDefined()
    })
  })

  describe('POST /api/admin/subscribers', () => {
    it('should create subscriber with ACTIVE status (skip confirmation)', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/subscribers', {
        method: 'POST',
        body: JSON.stringify({
          email: 'admin-created@example.com',
          firstName: 'Admin Created',
          interests: ['shows-events'],
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.data.email).toBe('admin-created@example.com')
      expect(body.data.status).toBe('ACTIVE')
    })

    it('should create subscriber with PENDING status when skipConfirmation is false', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/subscribers', {
        method: 'POST',
        body: JSON.stringify({
          email: 'pending-admin@example.com',
          skipConfirmation: false,
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.data.status).toBe('PENDING')
    })

    it('should reject duplicate email', async () => {
      await prisma.subscriber.create({
        data: {
          email: 'existing@example.com',
          status: SubscriberStatus.ACTIVE,
          confirmedAt: new Date(),
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/subscribers', {
        method: 'POST',
        body: JSON.stringify({ email: 'existing@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error.code).toBe('ALREADY_EXISTS')
    })

    it('should reject invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/subscribers', {
        method: 'POST',
        body: JSON.stringify({ email: 'invalid-email' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should store interests as array', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/subscribers', {
        method: 'POST',
        body: JSON.stringify({
          email: 'interests-admin@example.com',
          interests: ['shows-events', 'workshops'],
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.data.interests).toEqual(['shows-events', 'workshops'])
    })
  })
})
