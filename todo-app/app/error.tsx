'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        {/* Error Title */}
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">
          Oops! Something went wrong
        </h1>
        
        {/* Error Message */}
        <p className="text-zinc-400 mb-8">
          We encountered an unexpected error. Don&apos;t worry, your data is safe.
        </p>
        
        {/* Error Details (development only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-left">
            <p className="text-xs text-zinc-500 mb-1">Error details:</p>
            <p className="text-sm text-red-400 font-mono break-all">{error.message}</p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-100 w-full sm:w-auto"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
        
        {/* Additional Help */}
        <p className="mt-8 text-sm text-zinc-500">
          If this problem persists, try refreshing the page or clearing your browser cache.
        </p>
      </div>
    </div>
  )
}
