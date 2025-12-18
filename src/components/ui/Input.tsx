import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Input component following PEPE Dome design system
 *
 * Features:
 * - Dark background (coal)
 * - Gold focus ring
 * - Error state support
 */
const inputVariants = cva(
  [
    "flex w-full rounded-lg border px-3 py-2 text-sm",
    "bg-[var(--pepe-coal)] text-[var(--pepe-white)]",
    "border-[var(--pepe-line)]",
    "placeholder:text-[var(--pepe-t48)]",
    "transition-all duration-200",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--pepe-t80)]",
    "focus-visible:outline-none",
    "focus-visible:border-[var(--pepe-gold)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold-glow)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      inputSize: {
        sm: "h-8 text-xs px-2",
        md: "h-10 text-sm px-3",
        lg: "h-12 text-base px-4",
      },
      hasError: {
        true: "border-[var(--pepe-error)] focus-visible:border-[var(--pepe-error)] focus-visible:ring-[rgba(255,59,59,0.25)]",
        false: "",
      },
    },
    defaultVariants: {
      inputSize: "md",
      hasError: false,
    },
  }
)

export type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize, hasError, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ inputSize, hasError, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
export default Input
