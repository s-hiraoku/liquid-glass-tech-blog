/**
 * Toast Hook
 * shadcn/ui Toast hook integration
 * Phase 5.2: Authentication System - Toast Notifications
 */

import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  return {
    toast: ({ title, description, variant = 'default' }: ToastProps) => {
      if (variant === 'destructive') {
        sonnerToast.error(title, {
          description,
        })
      } else {
        sonnerToast.success(title, {
          description,
        })
      }
    },
  }
}