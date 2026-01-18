import { MainLayout } from '@/components/layout/main-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  AnalyticsChartSkeleton, 
  AnalyticsStatsSkeleton, 
  AnalyticsPieSkeleton, 
  AnalyticsInsightsSkeleton 
} from '@/components/analytics/analytics-skeleton'

export default function AnalyticsLoading() {
  return (
    <MainLayout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div>
                <Skeleton className="h-7 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-10 w-[160px]" />
          </div>
          
          {/* Content Skeleton */}
          <div className="grid gap-6">
            {/* Chart */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <AnalyticsChartSkeleton />
            </div>
            
            {/* Stats */}
            <AnalyticsStatsSkeleton />
            
            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <Skeleton className="h-6 w-28 mb-4" />
                <AnalyticsPieSkeleton />
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <AnalyticsInsightsSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
