'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { AnalyticsHeader } from '@/components/analytics/analytics-header'
import { WeeklyChart } from '@/components/analytics/weekly-chart'
import { StatsGrid } from '@/components/analytics/stats-grid'
import { LabelPieChart } from '@/components/analytics/label-pie-chart'
import { LabelInsights } from '@/components/analytics/label-insights'
import { ContributionGraph } from '@/components/analytics/contribution-graph'
import { EmptyAnalytics } from '@/components/analytics/empty-analytics'
import { 
  AnalyticsChartSkeleton, 
  AnalyticsPieSkeleton, 
  AnalyticsInsightsSkeleton 
} from '@/components/analytics/analytics-skeleton'
import { DateRangeOption } from '@/lib/types/analytics'
import { useAnalytics, useContributions } from '@/lib/hooks/use-analytics'
import { useUser } from '@/lib/hooks/use-user'
import { Skeleton } from '@/components/ui/skeleton'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRangeOption>('this-week')
  const [mounted, setMounted] = useState(false)
  const { timeData, labelData, isLoading, isWeekly } = useAnalytics(dateRange)
  const { data: contributions, isLoading: contributionsLoading } = useContributions()
  const { data: user, isLoading: userLoading } = useUser()

  // Track mount state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if user has any data at all - only after data has loaded
  const hasNoData = mounted && !isLoading && 
    (!timeData?.taskCompletion?.total || timeData.taskCompletion.total === 0) && 
    (!timeData?.totalTime || timeData.totalTime === 0)

  // Show loading skeleton during SSR and initial load
  if (!mounted || userLoading) {
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
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-[120px] w-full rounded-lg" />
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <AnalyticsChartSkeleton />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  // If no user yet, show empty state
  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <AnalyticsHeader 
              dateRange={dateRange} 
              onDateRangeChange={setDateRange} 
            />
            <EmptyAnalytics type="no-tasks" />
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <AnalyticsHeader 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
          
          {/* Full empty state */}
          {hasNoData ? (
            <EmptyAnalytics type="no-time" />
          ) : (
            <div className="grid gap-6 animate-in fade-in-50 duration-500">
              {/* GitHub-style Contribution Graph */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-zinc-700">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  Activity Overview
                </h2>
                <ContributionGraph 
                  data={contributions || []} 
                  isLoading={contributionsLoading} 
                />
              </div>
              
              {/* Weekly/Monthly Time Chart - Full Width */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-zinc-700">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  {isWeekly ? 'Time Tracked This Week' : 'Time Tracked This Month'}
                </h2>
                {isLoading ? (
                  <AnalyticsChartSkeleton />
                ) : timeData?.days ? (
                  <WeeklyChart days={timeData.days} isWeekly={isWeekly} />
                ) : null}
              </div>
              
              {/* Stats Cards Row */}
              <StatsGrid data={timeData} isLoading={isLoading} />
              
              {/* Bottom Row - Pie Chart and Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Label Breakdown Pie Chart */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-zinc-700">
                  <h2 className="text-lg font-semibold text-zinc-100 mb-4">Time by Label</h2>
                  {isLoading ? (
                    <AnalyticsPieSkeleton />
                  ) : (
                    <LabelPieChart data={labelData} />
                  )}
                </div>
                
                {/* Label Insights */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-zinc-700">
                  <h2 className="text-lg font-semibold text-zinc-100 mb-4">Label Insights</h2>
                  {isLoading ? (
                    <AnalyticsInsightsSkeleton />
                  ) : (
                    <LabelInsights data={labelData} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
