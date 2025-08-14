import * as React from "react"
import { Toaster as Sonner } from "sonner"

// Toast components using Sonner under the hood
const Toast = React.forwardRef<
  React.ElementRef<typeof Sonner>,
  React.ComponentPropsWithoutRef<typeof Sonner>
>(({ ...props }, ref) => {
  return <Sonner ref={ref} {...props} />
})
Toast.displayName = "Toast"

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Sonner />
    </>
  )
}

const ToastViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={className}
      {...props}
    />
  )
})
ToastViewport.displayName = "ToastViewport"

export {
  Toast,
  ToastProvider,
  ToastViewport,
}