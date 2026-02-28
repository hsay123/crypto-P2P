import * as React from "react"
import { cn } from "@/app/lib/utils"

const Toast = React.forwardRef<HTMLDivElement, any>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn("fixed bottom-4 right-4 z-50 rounded-md bg-background p-4 shadow-lg border", className)} {...props} />
))
Toast.displayName = "Toast"

const ToastTitle = React.forwardRef<HTMLParagraphElement, any>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<HTMLParagraphElement, any>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
))
ToastDescription.displayName = "ToastDescription"

const ToastClose = React.forwardRef<HTMLButtonElement, any>(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("absolute right-2 top-2 rounded-md p-1 opacity-70 hover:opacity-100", className)} {...props} />
))
ToastClose.displayName = "ToastClose"

const ToastAction = React.forwardRef<HTMLButtonElement, any>(({ className, altText, ...props }, ref) => (
  <button ref={ref} className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium border px-3 py-2", className)} {...props} />
))
ToastAction.displayName = "ToastAction"

const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
const ToastViewport = React.forwardRef<HTMLDivElement, any>((props, ref) => <div ref={ref} {...props} />)
ToastViewport.displayName = "ToastViewport"

export { Toast, ToastTitle, ToastDescription, ToastClose, ToastAction, ToastProvider, ToastViewport }
export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
export type ToastActionElement = React.ReactElement<typeof ToastAction>
