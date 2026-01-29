import Link from 'next/link'
import Image from 'next/image'
import { formatDate, formatDateShort, getCategoryClasses } from '@/lib/data'
import { cn } from '@/lib/utils'

// Flexible event type that works with both JSON and DB data
type EventData = {
  id: string
  slug?: string
  title: string
  subtitle?: string | null
  description: string
  date: string
  endDate?: string | null
  time?: string | null
  location: string
  category: string
  ticketUrl?: string | null
  price?: string | null
  imageUrl?: string | null
  featured?: boolean
  highlights?: string[]
}

interface EventCardProps {
  event: EventData
  variant?: 'default' | 'compact' | 'featured'
}

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
  const categoryClasses = getCategoryClasses(event.category, 'events')
  const eventDate = new Date(event.date)
  const day = eventDate.getDate()
  const month = eventDate.toLocaleDateString('de-DE', { month: 'short' })

  if (variant === 'compact') {
    return (
      <Link href={`/events/${event.id}`} className="group block">
        <article className="card card-interactive p-4">
          <div className="flex gap-4">
            <div className={cn(
              'flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center text-center',
              categoryClasses.badgeAlt
            )}>
              <div className="text-2xl font-bold text-pepe-white leading-none">{day}</div>
              <div className="text-xs text-pepe-t64 uppercase">{month}</div>
            </div>

            <div className="flex-1 min-w-0">
              <span className={cn('badge mb-1', categoryClasses.badgeAlt)}>
                {event.category}
              </span>
              <h3 className="h6 mb-1 line-clamp-1 group-hover:text-pepe-gold transition-colors">
                {event.title}
              </h3>
              <p className="text-xs text-pepe-t64">
                {event.time}
              </p>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article className={cn(
        'card card-interactive overflow-hidden',
        variant === 'featured' && 'bento-item-wide'
      )}>
        {event.imageUrl && (
          <div className={cn(
            'relative w-full overflow-hidden bg-pepe-surface',
            variant === 'featured' ? 'h-80' : 'h-56'
          )}>
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes={variant === 'featured' ? '(max-width: 768px) 100vw, 800px' : '(max-width: 768px) 100vw, 400px'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pepe-black via-transparent to-transparent opacity-60" />

            {/* Date Badge */}
            <div className={cn(
              'absolute top-4 left-4 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-center backdrop-blur-md',
              categoryClasses.date
            )}>
              <div className="text-2xl font-bold text-pepe-white leading-none">{day}</div>
              <div className="text-xs text-pepe-white uppercase font-semibold">{month}</div>
            </div>

            {/* Category Badge */}
            <span className={cn(
              'badge absolute top-4 right-4 backdrop-blur-sm',
              categoryClasses.badge
            )}>
              {event.category}
            </span>

            {/* Featured Badge */}
            {event.featured && (
              <span className="badge absolute bottom-4 left-4 bg-pepe-gold text-pepe-black">
                Highlight
              </span>
            )}
          </div>
        )}

        <div className={cn('p-6', variant === 'featured' && 'p-8')}>
          <h3 className={cn(
            'font-display font-bold mb-2 group-hover:text-pepe-gold transition-colors',
            variant === 'featured' ? 'text-3xl' : 'text-xl'
          )}>
            {event.title}
          </h3>

          {event.subtitle && (
            <p className="text-lg text-pepe-gold font-medium mb-3">
              {event.subtitle}
            </p>
          )}

          <p className={cn(
            'text-pepe-t64 mb-4',
            variant === 'featured' ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'
          )}>
            {event.description}
          </p>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2 text-pepe-t64">
              <span>📅</span>
              <span>{formatDate(event.date)}</span>
              {event.endDate && <span>- {formatDateShort(event.endDate)}</span>}
            </div>
            <div className="flex items-center gap-2 text-pepe-t64">
              <span>🕐</span>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-pepe-t64">
              <span>📍</span>
              <span>{event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-pepe-gold font-semibold">
              {event.price}
            </span>
            {event.ticketUrl && (() => {
              const isEmail = event.ticketUrl.includes('@') && !event.ticketUrl.startsWith('http');
              const label = isEmail ? 'Anmeldung via Mail →' : 'Tickets verfügbar →';
              return (
                <span className="text-sm text-pepe-t64">
                  {label}
                </span>
              );
            })()}
          </div>
        </div>
      </article>
    </Link>
  )
}
