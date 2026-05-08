import { toast } from '@/hooks/use-toast'

/**
 * Utility functions to replace alert() calls with toast notifications
 */

export const showToast = {
  success: (message: string) => {
    toast({
      title: 'Success',
      description: message,
      variant: 'default',
    })
  },
  
  error: (message: string) => {
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    })
  },
  
  info: (message: string) => {
    toast({
      title: 'Info',
      description: message,
      variant: 'default',
    })
  },
  
  warning: (message: string) => {
    toast({
      title: 'Warning',
      description: message,
      variant: 'default',
    })
  }
}

/**
 * Direct replacement for alert() calls
 * @param message - The message to display
 * @param type - The type of toast (success, error, info, warning)
 */
export const alertToToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  showToast[type](message)
}
