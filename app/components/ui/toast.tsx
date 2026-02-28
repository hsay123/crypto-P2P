import * as React from "react"
import { cn } from "@/lib/utils"
const Toast = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("fixed bottom-4 right-4 z-50 rounded-md bg-background p-4 shadow-lg border", className)} {...props} />
))
Toast.displayName = "Toast"
const ToastTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))
ToastTitle.displayName = "ToastTitle"
const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
))
ToastDescription.displayName = "ToastDescription"
export { Toast, ToastTitle, ToastDescription }
export const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const ToastViewport = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => <div ref={ref} {...props} />)
ToastViewport.displayName = "ToastViewport"
