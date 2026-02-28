import * as React from "react"
import { cn } from "@/lib/utils"
const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>
const TooltipTrigger = ({ children, asChild, ...props }: any) => <div {...props}>{children}</div>
const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("z-50 rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md", className)} {...props} />
))
TooltipContent.displayName = "TooltipContent"
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
