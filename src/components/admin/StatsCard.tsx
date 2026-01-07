import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * StatsCard component
 *
 * A reusable stat display card for the admin dashboard.
 * Features:
 * - Icon display
 * - Value with optional formatting
 * - Label text
 * - Trend indicator (up/down/neutral)
 */

interface StatsCardProps {
  /** Icon to display */
  icon?: ReactNode
  /** Main value (e.g., "1,234") */
  value: string | number
  /** Label describing the stat */
  label: string
  /** Optional secondary text */
  description?: string
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral'
  /** Trend value (e.g., "+12%") */
  trendValue?: string
  /** Link destination if card should be clickable */
  href?: string
  /** Additional CSS classes */
  className?: string
  /** Accent color variant */
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'error'
}

const variantStyles = {
  default: {
    icon: 'bg-[#016dca]/20 text-[#016dca]',
    value: 'text-white',
  },
  gold: {
    icon: 'bg-[#016dca]/20 text-[#016dca]',
    value: 'text-[#016dca]',
  },
  success: {
    icon: 'bg-emerald-500/20 text-emerald-400',
    value: 'text-emerald-400',
  },
  warning: {
    icon: 'bg-yellow-500/20 text-yellow-400',
    value: 'text-yellow-400',
  },
  error: {
    icon: 'bg-red-500/20 text-red-400',
    value: 'text-red-400',
  },
}

const trendColors = {
  up: 'text-emerald-400',
  down: 'text-red-400',
  neutral: 'text-gray-400',
}

const trendIcons = {
  up: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ),
  down: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  neutral: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  ),
}

export default function StatsCard({
  icon,
  value,
  label,
  description,
  trend,
  trendValue,
  href,
  className,
  variant = 'default',
}: StatsCardProps) {
  const styles = variantStyles[variant]

  const CardContent = (
    <div
      className={cn(
        'bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl',
        'transition-all duration-200',
        href && 'hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-0.5 cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        {icon && (
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', styles.icon)}>
            {icon}
          </div>
        )}

        {/* Trend indicator */}
        {trend && trendValue && (
          <div className={cn('flex items-center gap-1 text-sm', trendColors[trend])}>
            {trendIcons[trend]}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className={cn('text-3xl font-bold mt-4', styles.value)}>
        {typeof value === 'number' ? value.toLocaleString('de-DE') : value}
      </div>

      {/* Label */}
      <div className="text-sm text-gray-400 mt-1">{label}</div>

      {/* Description */}
      {description && (
        <div className="text-xs text-gray-500 mt-2">{description}</div>
      )}
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block">
        {CardContent}
      </a>
    )
  }

  return CardContent
}

// Default icons for common stats
export const StatsIcons = {
  subscribers: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  events: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  articles: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    </svg>
  ),
  newsletters: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  openRate: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ),
  clickRate: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
      />
    </svg>
  ),
}
