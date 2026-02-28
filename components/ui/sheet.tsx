import * as React from "react"
import { cn } from "@/lib/utils"
const Sheet = ({ children, open, onOpenChange, ...props }: any) => <>{children}</>
const SheetTrigger = ({ children, asChild, ...props }: any) => <div {...props}>{children}</div>
const SheetContent = ({ children, className, side = "right", ...props }: any) => (
  <div className={cn("fixed inset-y-0 right-0 z-50 w-72 bg-background p-6 shadow-lg", className)} {...props}>{children}</div>
)
const SheetHeader = ({ children, className, ...props }: any) => <div className={cn("flex flex-col space-y-2", className)} {...props}>{children}</div>
const SheetTitle = ({ children, className, ...props }: any) => <h2 className={cn("text-lg font-semibold", className)} {...props}>{children}</h2>
const SheetDescription = ({ children, className, ...props }: any) => <p className={cn("text-sm text-muted-foreground", className)} {...props}>{children}</p>
const SheetFooter = ({ children, className, ...props }: any) => <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props}>{children}</div>
const SheetClose = ({ children, ...props }: any) => <div {...props}>{children}</div>
export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose }
