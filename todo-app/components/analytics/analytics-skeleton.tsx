'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function AnalyticsChartSkeleton() {
  return (
    <div className="h-[300px] p-4">
      <div className="flex items-end justify-between h-full gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <Skeleton 
              className="w-full rounded-t-sm"
              style={{ height: `${Math.random() * 60 + 20}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnalyticsStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-32 mt-2" />
        </div>
      ))}
    </div>
  )
}

export function AnalyticsPieSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div className="relative w-[200px] h-[200px] flex-shrink-0">
        <div className="absolute inset-0 rounded-full border-[20px] border-zinc-800 animate-pulse" />
        <div className="absolute inset-[40px] rounded-full bg-zinc-900" />
      </div>
      <div className="flex-1 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnalyticsInsightsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-1.5 w-full rounded" />
        </div>
      ))}
    </div>
  )
}
