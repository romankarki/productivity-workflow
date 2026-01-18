'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ 
  title = 'Something went wrong',
  message = 'An error occurred while loading this content.',
  onRetry,
  className 
}: ErrorMessageProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-400 max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-100"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

export function InlineError({ 
  message = 'Failed to load',
  onRetry 
}: { 
  message?: string
  onRetry?: () => void 
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-red-400 text-sm">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="text-red-500 hover:text-red-400 underline"
        >
          Retry
        </button>
      )}
    </div>
  )
}
