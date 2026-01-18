'use client'

import { toast } from 'sonner'

// Toast helper functions for consistent messaging throughout the app

export const toastActions = {
  // Task actions
  taskCreated: () => toast.success('Task added'),
  taskCompleted: () => toast.success('Nice work! Task completed 🎉'),
  taskUncompleted: () => toast('Task marked incomplete'),
  taskDeleted: (onUndo?: () => void) => {
    toast.success('Task deleted', {
      action: onUndo ? {
        label: 'Undo',
        onClick: onUndo,
      } : undefined,
    })
  },
  taskUpdated: () => toast.success('Task updated'),
  
  // Label actions
  labelCreated: (name: string) => toast.success(`Label "${name}" created`),
  labelUpdated: (name: string) => toast.success(`Label "${name}" updated`),
  labelDeleted: (name: string) => toast.success(`Label "${name}" deleted`),
  labelAdded: () => toast.success('Label added to task'),
  labelRemoved: () => toast('Label removed from task'),
  
  // Timer actions
  timerStarted: () => toast.success('Timer started'),
  timerPaused: () => toast('Timer paused'),
  timerResumed: () => toast.success('Timer resumed'),
  timerStopped: (duration: string) => toast.success(`Session complete: ${duration}`),
  lapRecorded: (lapNumber: number) => toast.success(`Lap ${lapNumber} recorded`),
  
  // Goal actions
  goalSet: () => toast.success('Goal updated'),
  goalAchieved: () => toast.success('Congratulations! Goal achieved! 🏆'),
  
  // User actions
  profileUpdated: () => toast.success('Profile updated'),
  dataExported: () => toast.success('Data exported successfully'),
  
  // Error states
  error: (message: string = 'Something went wrong. Please try again.') => {
    toast.error(message)
  },
  networkError: () => toast.error('Connection lost. Please check your internet connection.'),
  validationError: (message: string) => toast.error(message),
  
  // Generic
  success: (message: string) => toast.success(message),
  info: (message: string) => toast(message),
  warning: (message: string) => toast.warning(message),
}

export function useToastActions() {
  return toastActions
}
