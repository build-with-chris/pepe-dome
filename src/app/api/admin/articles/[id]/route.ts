import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const articleUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  imageUrl: z.string().url().optional().nullable().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  eventIds: z.array(z.string()).optional(),
})

// GET - Get single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      events: {
        include: { event: { select: { id: true, title: true, slug: true, date: true } } }
      },
    },
  })

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  return NextResponse.json(article)
}

// PUT - Update article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const data = articleUpdateSchema.parse(body)

    // Get current article to check status change
    const currentArticle = await prisma.article.findUnique({ where: { id } })
    if (!currentArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      if (key === 'eventIds') continue // Handle separately
      if (value === '') {
        updateData[key] = null
      } else if (value !== undefined) {
        updateData[key] = value
      }
    }

    // Set publishedAt if status changes to PUBLISHED
    if (data.status === 'PUBLISHED' && currentArticle.status !== 'PUBLISHED') {
      updateData.publishedAt = new Date()
    }

    // Update article with event connections
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...updateData,
        events: data.eventIds !== undefined ? {
          deleteMany: {},
          create: data.eventIds.map(eventId => ({ eventId }))
        } : undefined,
      },
      include: {
        events: { include: { event: { select: { id: true, title: true } } } }
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    console.error('Error updating article:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

// DELETE - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.article.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
