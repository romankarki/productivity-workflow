'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { AnalyticsHeader } from '@/components/analytics/analytics-header'
import { WeeklyChart } from '@/components/analytics/weekly-chart'
import { StatsGrid } from '@/components/analytics/stats-grid'
import { LabelPieChart } from '@/components/analytics/label-pie-chart'
import { LabelInsights } from '@/components/analytics/label-insights'
import { DateRangeOption } from '@/lib/types/analytics'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { Skeleton } from '@/components/ui/skeleton'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRangeOption>('this-week')
  const { timeData, labelData, isLoading, isWeekly } = useAnalytics(dateRange)

  return (
    <MainLayout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <AnalyticsHeader 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
          
          <div className="grid gap-6">
            {/* Weekly/Monthly Time Chart - Full Width */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                {isWeekly ? 'Time Tracked This Week' : 'Time Tracked This Month'}
              </h2>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full rounded-lg" />
              ) : timeData?.days ? (
                <WeeklyChart days={timeData.days} isWeekly={isWeekly} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-zinc-500">
                  <p>No data available</p>
                </div>
              )}
            </div>
            
            {/* Stats Cards Row */}
            <StatsGrid data={timeData} isLoading={isLoading} />
            
            {/* Bottom Row - Pie Chart and Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Label Breakdown Pie Chart */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Time by Label</h2>
                <LabelPieChart data={labelData} isLoading={isLoading} />
              </div>
              
              {/* Label Insights */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Label Insights</h2>
                <LabelInsights data={labelData} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
