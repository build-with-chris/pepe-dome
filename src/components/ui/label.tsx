"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Label component following PEPE Dome design system
 */
const labelVariants = cva(
  [
    "text-sm font-medium leading-none",
    "text-[var(--pepe-t80)]",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      hasError: {
        true: "text-[var(--pepe-error)]",
        false: "",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-[var(--pepe-gold)]",
        false: "",
      },
    },
    defaultVariants: {
      hasError: false,
      required: false,
    },
  }
)

export type LabelProps = React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
> &
  VariantProps<typeof labelVariants>

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, hasError, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ hasError, required }), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants }
