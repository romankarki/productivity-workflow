'use client'

import { LabelAnalyticsItem } from '@/lib/types/analytics'
import { formatHours } from './utils'

interface LabelLegendProps {
  labels: LabelAnalyticsItem[]
}

export function LabelLegend({ labels }: LabelLegendProps) {
  if (labels.length === 0) return null

  return (
    <div className="space-y-2">
      {labels.map((label) => (
        <div key={label.id} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: label.color }}
            />
            <span className="text-zinc-300">{label.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500">{Math.round(label.percentage)}%</span>
            <span className="text-zinc-100 font-medium min-w-[60px] text-right">
              {formatHours(label.totalTime)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
