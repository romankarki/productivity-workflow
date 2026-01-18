'use client'

import { StatsCard } from './stats-card'
import { WeeklyAnalytics, MonthlyAnalytics } from '@/lib/types/analytics'
import { formatHours, getDayName } from './utils'
import { Clock, BarChart3, Trophy, CheckCircle2 } from 'lucide-react'

interface StatsGridProps {
  data: WeeklyAnalytics | MonthlyAnalytics | null | undefined
  isLoading?: boolean
}

export function StatsGrid({ data, isLoading }: StatsGridProps) {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 animate-pulse"
          >
            <div className="h-4 w-24 bg-zinc-800 rounded mb-3" />
            <div className="h-8 w-20 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    )
  }

  const stats = [
    {
      icon: <Clock className="w-5 h-5 text-emerald-500" />,
      label: 'Total Hours',
      value: formatHours(data.totalTime),
      subValue: data.totalTime > 0 ? 'tracked this period' : 'no time tracked',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-500" />,
      label: 'Daily Average',
      value: formatHours(data.averageDaily),
      subValue: data.averageDaily > 0 ? 'per active day' : 'no activity',
    },
    {
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      label: 'Best Day',
      value: data.mostProductiveDay 
        ? getDayName(data.mostProductiveDay, false) 
        : '--',
      subValue: data.mostProductiveDay 
        ? formatHours(Math.max(...data.days.map(d => d.totalTime)))
        : 'no data yet',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-violet-500" />,
      label: 'Completion Rate',
      value: data.taskCompletion.total > 0 
        ? `${Math.round(data.taskCompletion.rate)}%` 
        : '--',
      subValue: data.taskCompletion.total > 0 
        ? `${data.taskCompletion.completed}/${data.taskCompletion.total} tasks`
        : 'no tasks yet',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          subValue={stat.subValue}
        />
      ))}
    </div>
  )
}
