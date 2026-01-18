'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { AnalyticsHeader } from '@/components/analytics/analytics-header'
import { WeeklyChart } from '@/components/analytics/weekly-chart'
import { DateRangeOption } from '@/lib/types/analytics'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { Skeleton } from '@/components/ui/skeleton'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRangeOption>('this-week')
  const { timeData, isLoading, isWeekly } = useAnalytics(dateRange)

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Hours', value: '--', icon: '⏱️' },
                { label: 'Daily Average', value: '--', icon: '📊' },
                { label: 'Best Day', value: '--', icon: '🏆' },
                { label: 'Completion', value: '--', icon: '✅' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span>{stat.icon}</span>
                    <span className="text-sm text-zinc-400">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
                </div>
              ))}
            </div>
            
            {/* Bottom Row - Pie Chart and Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Label Breakdown Pie Chart */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Time by Label</h2>
                <div className="h-[280px] flex items-center justify-center text-zinc-500">
                  {/* LabelPieChart component will be added here */}
                  <p>Pie chart loading...</p>
                </div>
              </div>
              
              {/* Label Insights */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Label Insights</h2>
                <div className="h-[280px] flex items-center justify-center text-zinc-500">
                  {/* LabelInsights component will be added here */}
                  <p>Insights loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
