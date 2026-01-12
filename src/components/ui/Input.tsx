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
    "flex w-full rounded-lg border px-3 py-2.5 text-sm",
    "bg-white/[0.04] text-white",
    "border-white/[0.08]",
    "placeholder:text-white/30",
    "transition-all duration-200",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white/60",
    "focus-visible:outline-none",
    "focus-visible:border-[#016dca]",
    "focus-visible:ring-1 focus-visible:ring-[#016dca]/20",
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
        true: "border-red-500/50 focus-visible:border-red-500 focus-visible:ring-red-500/20",
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
