import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const nextEvent = await prisma.event.findFirst({
      where: { status: 'PUBLISHED', date: { gte: today } },
      orderBy: { date: 'asc' },
      select: { date: true },
    })

    if (!nextEvent) {
      return NextResponse.json({ year: today.getFullYear(), month: today.getMonth() + 1 })
    }

    const d = nextEvent.date
    return NextResponse.json({ year: d.getFullYear(), month: d.getMonth() + 1 })
  } catch {
    const now = new Date()
    return NextResponse.json({ year: now.getFullYear(), month: now.getMonth() + 1 })
  }
}
