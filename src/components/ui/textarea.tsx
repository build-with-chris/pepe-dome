import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Textarea component following PEPE Dome design system
 *
 * Features:
 * - Dark background (coal)
 * - Gold focus ring
 * - Error state support
 * - Resizable by default
 */
const textareaVariants = cva(
  [
    "flex w-full rounded-lg border px-3 py-2 text-sm",
    "min-h-[120px] resize-y",
    "bg-[var(--pepe-coal)] text-[var(--pepe-white)]",
    "border-[var(--pepe-line)]",
    "placeholder:text-[var(--pepe-t48)]",
    "transition-all duration-200",
    "focus-visible:outline-none",
    "focus-visible:border-[var(--pepe-gold)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold-glow)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      hasError: {
        true: "border-[var(--pepe-error)] focus-visible:border-[var(--pepe-error)] focus-visible:ring-[rgba(255,59,59,0.25)]",
        false: "",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
)

export type TextareaProps = React.ComponentProps<"textarea"> &
  VariantProps<typeof textareaVariants>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ hasError, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
