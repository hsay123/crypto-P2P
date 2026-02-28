import * as React from "react"
import { cn } from "@/lib/utils"

const TooltipProvider = ({ children, ...props }: any) => <>{children}</>
const Tooltip = ({ children, ...props }: any) => <>{children}</>
const TooltipTrigger = ({ children, asChild, ...props }: any) => <>{children}</>
const TooltipContent = React.forwardRef<HTMLDivElement, any>(({ className, side, sideOffset, align, ...props }, ref) => (
  <div ref={ref} className={cn("z-50 rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md", className)} {...props} />
))
TooltipContent.displayName = "TooltipContent"
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
