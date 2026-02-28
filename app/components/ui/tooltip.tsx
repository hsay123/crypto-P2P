import * as React from "react"
import { cn } from "@/app/lib/utils"

// Typed as React.FC<any> so JSX accepts any props (delayDuration, side, etc.)
const TooltipProvider: React.FC<any> = ({ children }) => <>{children}</>
const Tooltip: React.FC<any> = ({ children }) => <>{children}</>
const TooltipTrigger: React.FC<any> = ({ children }) => <>{children}</>
const TooltipContent = React.forwardRef<HTMLDivElement, any>(
  ({ className, side, sideOffset, align, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "z-50 rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
        className
      )}
      {...props}
    />
  )
)
TooltipContent.displayName = "TooltipContent"
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
