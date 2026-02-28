import * as React from "react"
import { cn } from "@/lib/utils"
const Toggle = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean }>(
  ({ className, pressed, ...props }, ref) => (
    <button ref={ref} aria-pressed={pressed} className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors", pressed && "bg-accent", className)} {...props} />
  )
)
Toggle.displayName = "Toggle"
export { Toggle }
