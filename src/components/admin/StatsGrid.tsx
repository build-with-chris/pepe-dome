import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * StatsGrid Component
 *
 * Grid wrapper for stat cards with consistent responsive layout.
 */

interface StatsGridProps {
  children: ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ children, columns = 4, className }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-5', gridCols[columns], className)}>
      {children}
    </div>
  )
}

/**
 * StatCard Component
 *
 * Individual stat card for use within StatsGrid.
 */

interface StatCardProps {
  label: string
  value: string | number
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'muted'
}

const valueStyles = {
  default: 'text-white',
  primary: 'text-[#016dca]',
  success: 'text-emerald-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
  muted: 'text-white/40',
}

export function StatCard({ label, value, variant = 'default' }: StatCardProps) {
  const formattedValue =
    typeof value === 'number' ? value.toLocaleString('de-DE') : value

  return (
    <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
      <p className="text-sm text-white/50 uppercase tracking-wider mb-3">
        {label}
      </p>
      <p className={cn('text-4xl font-bold', valueStyles[variant])}>
        {formattedValue}
      </p>
    </div>
  )
}
