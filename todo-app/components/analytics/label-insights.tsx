'use client'

import { LabelAnalytics } from '@/lib/types/analytics'
import { LabelTrend } from './label-trend'
import { formatHours } from './utils'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

interface LabelInsightsProps {
  data: LabelAnalytics | null | undefined
  isLoading?: boolean
}

export function LabelInsights({ data, isLoading }: LabelInsightsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.labels.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-zinc-500">
        <div className="text-center">
          <p className="text-lg mb-2">No insights yet</p>
          <p className="text-sm">Track time with labels to see detailed insights</p>
        </div>
      </div>
    )
  }

  // Find the max time for relative progress bar scaling
  const maxTime = Math.max(...data.labels.map(l => l.totalTime))

  return (
    <ScrollArea className="h-[280px] pr-4">
      <div className="space-y-4">
        {data.labels.map((label, index) => (
          <div
            key={label.id}
            className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 transition-colors hover:border-zinc-600/50"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: label.color }}
                />
                <div>
                  <span className="text-sm font-medium text-zinc-100">
                    {label.name}
                  </span>
                  {index === 0 && data.labels.length > 1 && (
                    <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                      Top
                    </span>
                  )}
                </div>
              </div>
              <LabelTrend trend={label.trend} value={label.trendValue} />
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-bold text-zinc-100">
                {formatHours(label.totalTime)}
              </span>
              <span className="text-sm text-zinc-500">
                {Math.round(label.percentage)}% of total
              </span>
            </div>
            
            <Progress 
              value={(label.totalTime / maxTime) * 100} 
              className="h-1.5 bg-zinc-700"
              style={{
                // @ts-expect-error CSS custom property
                '--progress-foreground': label.color,
              }}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
