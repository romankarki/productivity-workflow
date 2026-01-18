'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LabelTrendProps {
  trend: 'up' | 'down' | 'stable'
  value: number
}

export function LabelTrend({ trend, value }: LabelTrendProps) {
  if (value === 0) return null

  return (
    <div className={cn(
      "flex items-center gap-1 text-xs font-medium",
      trend === 'up' && "text-emerald-500",
      trend === 'down' && "text-red-500",
      trend === 'stable' && "text-zinc-500"
    )}>
      {trend === 'up' && <TrendingUp className="w-3 h-3" />}
      {trend === 'down' && <TrendingDown className="w-3 h-3" />}
      {trend === 'stable' && <Minus className="w-3 h-3" />}
      <span>{value}%</span>
    </div>
  )
}
