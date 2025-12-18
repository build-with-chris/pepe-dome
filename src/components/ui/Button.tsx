import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button component following PEPE Dome design system
 *
 * Variants:
 * - primary: Gold/bronze background for main CTAs
 * - secondary: Outlined style for secondary actions
 * - ghost: Transparent background for tertiary actions
 * - destructive: Red background for destructive actions
 * - outline: Border with transparent background
 * - link: Text link style
 *
 * Sizes: xs, sm, md (default), lg, xl
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        // Primary: Gold/Bronze for main CTAs
        primary: [
          "bg-[var(--pepe-bronze)] text-[var(--pepe-black)]",
          "hover:bg-[var(--pepe-bronze-hover)] hover:text-[var(--pepe-white)]",
          "hover:-translate-y-0.5 hover:shadow-[0_0_0_2px_var(--pepe-bronze-glow),0_8px_40px_rgba(192,137,94,0.15)]",
          "active:bg-[var(--pepe-bronze-active)] active:translate-y-0",
        ].join(" "),

        // Secondary: Outlined style
        secondary: [
          "bg-transparent text-[var(--pepe-white)] border border-[var(--pepe-line)]",
          "hover:border-[var(--pepe-white)] hover:bg-white/5",
          "hover:-translate-y-0.5",
          "active:bg-white/10 active:translate-y-0",
        ].join(" "),

        // Ghost: Transparent for tertiary actions
        ghost: [
          "bg-transparent text-[var(--pepe-t80)] border-none",
          "hover:text-[var(--pepe-white)] hover:bg-white/5",
          "active:bg-white/10",
        ].join(" "),

        // Destructive: Red for dangerous actions
        destructive: [
          "bg-[var(--pepe-error)] text-white",
          "hover:bg-[var(--pepe-error)]/90 hover:-translate-y-0.5",
          "active:translate-y-0",
        ].join(" "),

        // Outline: Border with hover fill (shadcn default)
        outline: [
          "border border-input bg-background",
          "hover:bg-accent hover:text-accent-foreground",
        ].join(" "),

        // Link: Text link style
        link: "text-primary underline-offset-4 hover:underline",

        // Default: Uses shadcn primary (gold)
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        // Extra small
        xs: "h-8 px-3 text-xs rounded-lg",
        // Small
        sm: "h-9 px-4 text-sm rounded-lg gap-1.5",
        // Medium (default)
        md: "h-10 px-6 text-sm rounded-xl",
        // Large
        lg: "h-12 px-8 text-base rounded-xl",
        // Extra large
        xl: "h-14 px-10 text-lg rounded-2xl",
        // Icon button
        icon: "h-10 w-10 rounded-lg",
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
