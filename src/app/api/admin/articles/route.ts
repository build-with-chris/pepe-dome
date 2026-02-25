import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  author: z.string().min(1, 'Author is required'),
  imageUrl: z.string().url().optional().or(z.literal('')).nullable(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  eventIds: z.array(z.string()).optional(),
})

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// GET - List all articles
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (category) where.category = category

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          events: {
            include: { event: { select: { id: true, title: true } } }
          }
        }
      }),
      prisma.article.count({ where }),
    ])

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles', articles: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } },
      { status: 500 }
    )
  }
}

// POST - Create new article
export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = articleSchema.parse(body)

    // Generate unique slug
    let slug = generateSlug(data.title)
    const existing = await prisma.article.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const article = await prisma.article.create({
      data: {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        author: data.author,
        imageUrl: data.imageUrl || null,
        tags: data.tags,
        featured: data.featured,
        status: data.status,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        createdBy: userId,
        events: data.eventIds?.length ? {
          create: data.eventIds.map(eventId => ({ eventId }))
        } : undefined,
      },
      include: {
        events: { include: { event: { select: { id: true, title: true } } } }
      }
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error creating article:', message, error)
    return NextResponse.json(
      { error: message || 'Failed to create article' },
      { status: 500 }
    )
  }
}
