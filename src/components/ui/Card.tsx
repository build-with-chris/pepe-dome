import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'card',
          {
            'card-glass': variant === 'glass',
            'card-interactive': variant === 'interactive',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export default Card
