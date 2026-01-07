import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button component following PEPE Dome design system
 * Uses CSS classes from components.css for consistent styling
 *
 * Variants:
 * - primary: DOME blue background for main CTAs
 * - secondary: Outlined style for secondary actions
 * - ghost: Transparent background for tertiary actions
 * - destructive: Red background for destructive actions
 * - link: Text link style
 *
 * Sizes: xs, sm, md (default), lg, xl, icon
 */
const buttonVariants = cva(
  "btn transition-all",
  {
    variants: {
      variant: {
        default: "btn-primary",
        primary: "btn-primary",
        secondary: "btn-secondary",
        outline: "btn-secondary",
        ghost: "btn-ghost",
        destructive: "bg-[var(--pepe-error)] text-white hover:bg-[var(--pepe-error)]/90",
        link: "text-primary underline-offset-4 hover:underline !p-0 h-auto",
      },
      size: {
        default: "btn-md",
        xs: "btn-xs",
        sm: "btn-sm",
        md: "btn-md",
        lg: "btn-lg",
        xl: "btn-xl",
        icon: "btn-icon-only",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export default Button
