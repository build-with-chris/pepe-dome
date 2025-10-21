'use client'

import { useState } from 'react'
import { Event, getEventsByMonth } from '@/lib/data'
import EventCard from './EventCard'
import Button from '@/components/ui/Button'

interface EventCalendarProps {
  initialYear?: number
  initialMonth?: number
}

export default function EventCalendar({ initialYear, initialMonth }: EventCalendarProps) {
  const now = new Date()
  const [year, setYear] = useState(initialYear || now.getFullYear())
  const [month, setMonth] = useState(initialMonth || now.getMonth() + 1)

  const events = getEventsByMonth(year, month)
  const monthName = new Date(year, month - 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })

  const goToPreviousMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const goToNextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const goToToday = () => {
    setYear(now.getFullYear())
    setMonth(now.getMonth() + 1)
  }

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="h2 capitalize">{monthName}</h2>
          <p className="text-pepe-t64">
            {events.length} {events.length === 1 ? 'Event' : 'Events'} in diesem Monat
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
            ← Zurück
          </Button>
          <Button variant="secondary" size="sm" onClick={goToToday}>
            Heute
          </Button>
          <Button variant="ghost" size="sm" onClick={goToNextMonth}>
            Weiter →
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="bento-grid">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-pepe-t64 text-lg">
            Keine Events in diesem Monat gefunden.
          </p>
          <Button variant="secondary" className="mt-6" onClick={goToToday}>
            Zurück zum aktuellen Monat
          </Button>
        </div>
      )}
    </div>
  )
}
