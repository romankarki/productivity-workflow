'use client'

import { BarChart3 } from 'lucide-react'
import { DateRangeSelector } from './date-range-selector'
import { DateRangeOption } from '@/lib/types/analytics'

interface AnalyticsHeaderProps {
  dateRange: DateRangeOption
  onDateRangeChange: (value: DateRangeOption) => void
}

export function AnalyticsHeader({ dateRange, onDateRangeChange }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Analytics</h1>
          <p className="text-sm text-zinc-400">Track your productivity insights</p>
        </div>
      </div>
      
      <DateRangeSelector value={dateRange} onChange={onDateRangeChange} />
    </div>
  )
}
