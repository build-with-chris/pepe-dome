import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { KIT_DISTRIBUTION_CHANNELS } from '@/lib/channel-kit/channels'
import type { DistributionChannel } from '@prisma/client'

/**
 * Protokoll darüber, wo ein Event tatsächlich steht.
 *
 * `event_distributions` wurde für automatische Adapter gebaut und lag seither
 * leer. Hier bekommt sie ihren Sinn ohne eine einzige fremde API: Setzt die
 * Redaktion im Kanal-Kit das Häkchen "eingetragen" und fügt die URL der
 * Veröffentlichung ein, entsteht genau die Zeile, die ein Adapter später auch
 * schreiben würde. Die Handarbeit ist die Vorstufe der Automatik.
 */

const bodySchema = z.object({
  channel: z.string().refine(
    (value) => (KIT_DISTRIBUTION_CHANNELS as string[]).includes(value),
    'Unbekannter Kanal'
  ),
  /** URL der Veröffentlichung im Portal. Optional, aber dann bitte eine echte. */
  externalUrl: z
    .string()
    .trim()
    .url('Bitte eine vollständige URL mit https:// eintragen')
    .optional()
    .or(z.literal('')),
})

// POST - Kanal als eingetragen markieren (oder die URL nachreichen)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  const { id } = await params

  const event = await prisma.event.findUnique({ where: { id }, select: { id: true } })
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const data = bodySchema.parse(body)
    const channel = data.channel as DistributionChannel
    const externalUrl = data.externalUrl ? data.externalUrl : null

    const distribution = await prisma.eventDistribution.upsert({
      where: { eventId_channel: { eventId: id, channel } },
      create: {
        eventId: id,
        channel,
        status: 'success',
        externalUrl,
        completedAt: new Date(),
      },
      update: {
        status: 'success',
        externalUrl,
        errorMessage: null,
        completedAt: new Date(),
      },
      select: { channel: true, status: true, externalUrl: true, completedAt: true },
    })

    return NextResponse.json(distribution)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? 'Ungültige Angabe' }, { status: 400 })
    }
    console.error('Error saving event distribution:', error)
    return NextResponse.json({ error: 'Speichern fehlgeschlagen' }, { status: 500 })
  }
}

// DELETE - Häkchen zurücknehmen, etwa nach einem Fehleintrag im Portal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  const { id } = await params
  const channel = request.nextUrl.searchParams.get('channel')

  if (!channel || !(KIT_DISTRIBUTION_CHANNELS as string[]).includes(channel)) {
    return NextResponse.json({ error: 'Unbekannter Kanal' }, { status: 400 })
  }

  await prisma.eventDistribution.deleteMany({
    where: { eventId: id, channel: channel as DistributionChannel },
  })

  return NextResponse.json({ ok: true })
}
