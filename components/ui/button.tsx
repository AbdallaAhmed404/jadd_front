import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot" // Ensure correct import for Slot

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // BASE: Added font-linseed, higher tracking, and sub-pixel anti-aliasing
  "group/button inline-flex shrink-0 items-center justify-center rounded-sm border border-transparent font-linseed text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-2 focus-visible:ring-scarab-gold/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // High-contrast primary: Solid Black/White with Gold hover
        default: 
          "bg-foreground text-background hover:bg-scarab-gold hover:text-black shadow-lg shadow-black/5",
        
        // Technical Outline: Thinner border, gold glow on focus
        outline:
          "border-foreground/10 bg-transparent hover:border-scarab-gold hover:text-scarab-gold dark:border-white/10 dark:hover:border-scarab-gold",
        
        // Ghost: Invisible until hover, then subtle gold tint
        ghost:
          "hover:bg-scarab-gold/10 hover:text-scarab-gold transition-colors",
        
        // Scarab Signature: The "Gold" button
        scarab:
          "bg-scarab-gold text-black hover:bg-black hover:text-scarab-gold border border-scarab-gold shadow-[0_0_20px_rgba(233,185,73,0.2)]",
        
        link: "text-foreground underline-offset-8 hover:underline hover:text-scarab-gold",
      },
      size: {
        default: "h-12 px-8 gap-3",
        sm: "h-10 px-6 gap-2 text-[10px]",
        lg: "h-14 px-10 gap-4 text-sm",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }