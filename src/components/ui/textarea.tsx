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
    "flex w-full rounded-lg border px-3 py-2.5 text-sm",
    "min-h-[120px] resize-y",
    "bg-white/[0.04] text-white",
    "border-white/[0.08]",
    "placeholder:text-white/30",
    "transition-all duration-200",
    "focus-visible:outline-none",
    "focus-visible:border-[#016dca]",
    "focus-visible:ring-1 focus-visible:ring-[#016dca]/20",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      hasError: {
        true: "border-red-500/50 focus-visible:border-red-500 focus-visible:ring-red-500/20",
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
