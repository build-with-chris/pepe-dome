import EventCalendar from '@/components/events/EventCalendar'

export default function EventsPage() {
  return (
    <div className="section">
      <div className="stage-container">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="display-1 mb-4">Event-Kalender</h1>
          <p className="lead text-pepe-t80 max-w-2xl mx-auto">
            Entdecke Shows, Workshops, Festivals und mehr im Pepe Dome
          </p>
        </header>

        {/* Calendar */}
        <EventCalendar />
      </div>
    </div>
  )
}
