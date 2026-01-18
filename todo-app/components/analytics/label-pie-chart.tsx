'use client'

import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { LabelAnalytics } from '@/lib/types/analytics'
import { LabelLegend } from './label-legend'
import { formatHours, formatDuration } from './utils'

interface LabelPieChartProps {
  data: LabelAnalytics | null | undefined
  isLoading?: boolean
}

export function LabelPieChart({ data, isLoading }: LabelPieChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.labels.length === 0) return []
    
    return data.labels.map(label => ({
      name: label.name,
      value: label.totalTime,
      color: label.color,
      percentage: label.percentage,
    }))
  }, [data])

  if (isLoading) {
    return (
      <div className="h-[280px] flex items-center justify-center">
        <div className="w-[200px] h-[200px] rounded-full bg-zinc-800 animate-pulse" />
      </div>
    )
  }

  if (!data || data.labels.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-zinc-500">
        <div className="text-center">
          <p className="text-lg mb-2">No label data</p>
          <p className="text-sm">Create labels and track time to see breakdown</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div className="relative w-[200px] h-[200px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null
                const data = payload[0].payload
                return (
                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: data.color }}
                      />
                      <span className="text-zinc-100 font-medium">{data.name}</span>
                    </div>
                    <div className="text-zinc-400 text-sm">
                      {formatDuration(data.value)} ({Math.round(data.percentage)}%)
                    </div>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-xl font-bold text-zinc-100">
              {formatHours(data.totalTrackedTime)}
            </div>
            <div className="text-xs text-zinc-500">total</div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex-1 min-w-0 w-full lg:w-auto">
        <LabelLegend labels={data.labels} />
      </div>
    </div>
  )
}
