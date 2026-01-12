import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  STATUS_COLORS,
  STATUS_LABELS,
  SUBSCRIBER_STATUS_COLORS,
  SUBSCRIBER_STATUS_LABELS,
} from '@/lib/admin-constants'

/**
 * StatusBadge Component
 *
 * Automatically applies the correct color and label based on status.
 */

interface StatusBadgeProps {
  status: string
  type?: 'content' | 'subscriber'
  className?: string
}

export function StatusBadge({ status, type = 'content', className }: StatusBadgeProps) {
  const colors = type === 'subscriber' ? SUBSCRIBER_STATUS_COLORS : STATUS_COLORS
  const labels = type === 'subscriber' ? SUBSCRIBER_STATUS_LABELS : STATUS_LABELS

  return (
    <Badge
      variant="outline"
      className={cn('text-xs border px-2.5 py-0.5', colors[status], className)}
    >
      {labels[status] || status}
    </Badge>
  )
}
