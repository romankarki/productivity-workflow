'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { DailyStats } from '@/lib/types/analytics'
import { ChartTooltip } from './chart-tooltip'
import { getDayName, msToHours, getChartColors } from './utils'

interface WeeklyChartProps {
  days: DailyStats[]
  isWeekly: boolean
}

export function WeeklyChart({ days, isWeekly }: WeeklyChartProps) {
  // Transform data for stacked bar chart
  const { chartData, labels } = useMemo(() => {
    // Collect all unique labels across all days
    const labelSet = new Map<string, { name: string; color: string }>()
    
    for (const day of days) {
      for (const lb of day.labelBreakdown) {
        if (!labelSet.has(lb.labelId)) {
          labelSet.set(lb.labelId, { name: lb.labelName, color: lb.labelColor })
        }
      }
    }
    
    const labels = Array.from(labelSet.entries()).map(([id, data]) => ({
      id,
      ...data,
    }))
    
    // Build chart data
    const chartData = days.map((day) => {
      const result: Record<string, number | string> = {
        date: isWeekly ? getDayName(day.date) : getDayName(day.date),
        fullDate: day.date,
      }
      
      // Add time for each label
      for (const label of labels) {
        const breakdown = day.labelBreakdown.find(lb => lb.labelId === label.id)
        result[label.id] = breakdown ? msToHours(breakdown.time) : 0
      }
      
      return result
    })
    
    return { chartData, labels }
  }, [days, isWeekly])
  
  // Get default colors for labels without colors
  const defaultColors = getChartColors()
  
  const hasData = days.some(day => day.totalTime > 0)
  
  if (!hasData) {
    return (
      <div className="h-[300px] flex items-center justify-center text-zinc-500">
        <div className="text-center">
          <p className="text-lg mb-2">No time tracked yet</p>
          <p className="text-sm">Start a stopwatch on any task to see your progress here</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
          tickFormatter={(value) => `${value}h`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload) return null
            
            const formattedPayload = payload
              .filter(p => (p.value as number) > 0)
              .map((p, i) => ({
                name: labels.find(l => l.id === p.dataKey)?.name || p.dataKey as string,
                value: ((p.value as number) * 60 * 60 * 1000), // Convert back to ms
                color: p.color || defaultColors[i % defaultColors.length],
                dataKey: p.dataKey as string,
              }))
            
            return <ChartTooltip active={active} payload={formattedPayload} label={label} />
          }}
          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
        />
        {labels.length > 1 && (
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => {
              const label = labels.find(l => l.id === value)
              return (
                <span className="text-zinc-400 text-sm">
                  {label?.name || value}
                </span>
              )
            }}
          />
        )}
        {labels.map((label, index) => (
          <Bar
            key={label.id}
            dataKey={label.id}
            stackId="time"
            fill={label.color || defaultColors[index % defaultColors.length]}
            radius={index === labels.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            name={label.name}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
