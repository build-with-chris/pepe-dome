import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * AdminCard Component
 *
 * Standardized card wrapper with consistent styling for admin panels.
 */

interface AdminCardProps {
  children: ReactNode
  title?: string
  action?: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function AdminCard({
  children,
  title,
  action,
  className,
  padding = 'lg',
}: AdminCardProps) {
  return (
    <div
      className={cn(
        'bg-white/[0.02] border border-white/[0.08] rounded-xl',
        paddingStyles[padding],
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
              {title}
            </h2>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
