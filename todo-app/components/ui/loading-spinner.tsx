'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <Loader2 
      className={cn(
        'animate-spin text-zinc-400',
        sizeClasses[size],
        className
      )} 
    />
  )
}

interface FullPageLoaderProps {
  message?: string
}

export function FullPageLoader({ message = 'Loading...' }: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-zinc-800" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-emerald-500 animate-spin" />
        </div>
        <p className="text-zinc-400 text-sm">{message}</p>
      </div>
    </div>
  )
}

export function InlineLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <LoadingSpinner size="lg" />
    </div>
  )
}
