import Link from 'next/link'
import { FileQuestion, Home, Calendar, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const today = new Date().toISOString().split('T')[0]
  
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-12 h-12 text-zinc-500" />
        </div>
        
        {/* 404 Number */}
        <div className="text-8xl font-bold text-zinc-800 mb-4">404</div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">
          Page not found
        </h1>
        
        {/* Description */}
        <p className="text-zinc-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          <Link href={`/day/${today}`}>
            <Button
              variant="outline"
              className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-100 w-full sm:w-auto"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Today&apos;s Tasks
            </Button>
          </Link>
        </div>
        
        {/* Quick Links */}
        <div className="pt-6 border-t border-zinc-800">
          <p className="text-sm text-zinc-500 mb-4">Or try one of these:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link 
              href="/calendar" 
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Calendar
            </Link>
            <span className="text-zinc-700">•</span>
            <Link 
              href="/analytics" 
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Analytics
            </Link>
            <span className="text-zinc-700">•</span>
            <Link 
              href="/labels" 
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Labels
            </Link>
            <span className="text-zinc-700">•</span>
            <Link 
              href="/settings" 
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
