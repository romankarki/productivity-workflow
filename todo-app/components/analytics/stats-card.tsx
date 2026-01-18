'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  icon: ReactNode
  label: string
  value: string
  subValue?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  className?: string
}

export function StatsCard({ 
  icon, 
  label, 
  value, 
  subValue, 
  trend, 
  trendValue,
  className 
}: StatsCardProps) {
  return (
    <div className={cn(
      "rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-zinc-400">{label}</span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-zinc-100">{value}</div>
          {subValue && (
            <div className="text-sm text-zinc-500 mt-1">{subValue}</div>
          )}
        </div>
        
        {trend && typeof trendValue === 'number' && trendValue > 0 && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend === 'up' && "text-emerald-500",
            trend === 'down' && "text-red-500",
            trend === 'stable' && "text-zinc-500"
          )}>
            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            {trend === 'stable' && <Minus className="w-4 h-4" />}
            <span>{trendValue}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
