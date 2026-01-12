import { ReactNode } from 'react'

/**
 * PageHeader Component
 *
 * Consistent page header for admin pages with title, description, and optional action.
 */

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-white">{title}</h1>
        {description && (
          <p className="text-base text-white/50 mt-1.5">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
