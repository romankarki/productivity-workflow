'use client'

import { formatDuration } from './utils'

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
    dataKey: string
  }>
  label?: string
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const totalTime = payload.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-zinc-100 mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-zinc-300">{entry.name}</span>
            </div>
            <span className="text-zinc-100 font-medium">
              {formatDuration(entry.value)}
            </span>
          </div>
        ))}
      </div>
      {payload.length > 1 && (
        <>
          <div className="border-t border-zinc-700 mt-2 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Total</span>
              <span className="text-zinc-100 font-bold">{formatDuration(totalTime)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
