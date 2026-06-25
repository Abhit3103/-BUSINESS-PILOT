import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-white/5 px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary/15 text-primary border-primary/20 hover:bg-primary/25",
        secondary:
          "bg-white/5 text-secondary-foreground border-white/10 hover:bg-white/10",
        destructive:
          "bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/25",
        outline: "text-foreground border-white/10",
        success: "bg-green-500/15 text-green-400 border-green-500/20 hover:bg-green-500/25",
        warning: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/25",
        info: "bg-blue-500/15 text-blue-400 border-blue-500/20 hover:bg-blue-500/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
