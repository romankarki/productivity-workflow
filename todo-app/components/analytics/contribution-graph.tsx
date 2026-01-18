'use client'

import { useMemo } from 'react'
import { 
  startOfYear, 
  endOfYear, 
  eachDayOfInterval, 
  format, 
  getDay, 
  subYears,
  startOfWeek,
  isSameDay,
  parseISO
} from 'date-fns'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface ContributionData {
  date: string
  taskCount: number
  completedCount: number
  totalTime: number // milliseconds
}

interface ContributionGraphProps {
  data: ContributionData[]
  isLoading?: boolean
}

// Calculate intensity level (0-4) based on activity
function getIntensityLevel(
  completedCount: number, 
  totalTime: number,
  maxCompleted: number,
  maxTime: number
): number {
  if (completedCount === 0 && totalTime === 0) return 0
  
  // Combine task completion and time tracked for intensity
  const completionScore = maxCompleted > 0 ? completedCount / maxCompleted : 0
  const timeScore = maxTime > 0 ? totalTime / maxTime : 0
  const combinedScore = (completionScore + timeScore) / 2
  
  if (combinedScore > 0.75) return 4
  if (combinedScore > 0.5) return 3
  if (combinedScore > 0.25) return 2
  if (combinedScore > 0) return 1
  return 0
}

const intensityColors = [
  'bg-zinc-800/50',           // Level 0 - no activity
  'bg-emerald-900/60',        // Level 1 - light
  'bg-emerald-700/70',        // Level 2 - medium
  'bg-emerald-500/80',        // Level 3 - high
  'bg-emerald-400',           // Level 4 - max
]

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function ContributionGraph({ data, isLoading }: ContributionGraphProps) {
  const { weeks, monthPositions, maxCompleted, maxTime, totalContributions } = useMemo(() => {
    const today = new Date()
    const yearAgo = subYears(today, 1)
    
    // Start from the beginning of the week containing yearAgo
    const startDate = startOfWeek(yearAgo, { weekStartsOn: 0 })
    const endDate = today
    
    // Create a map of data by date
    const dataMap = new Map<string, ContributionData>()
    for (const item of data) {
      dataMap.set(item.date, item)
    }
    
    // Find max values for intensity calculation
    let maxCompleted = 0
    let maxTime = 0
    let totalContributions = 0
    
    for (const item of data) {
      if (item.completedCount > maxCompleted) maxCompleted = item.completedCount
      if (item.totalTime > maxTime) maxTime = item.totalTime
      if (item.completedCount > 0 || item.totalTime > 0) totalContributions++
    }
    
    // Generate all days
    const allDays = eachDayOfInterval({ start: startDate, end: endDate })
    
    // Group into weeks (columns)
    const weeks: { date: Date; data: ContributionData | null }[][] = []
    let currentWeek: { date: Date; data: ContributionData | null }[] = []
    
    for (const day of allDays) {
      const dateStr = format(day, 'yyyy-MM-dd')
      const dayData = dataMap.get(dateStr) || null
      
      currentWeek.push({ date: day, data: dayData })
      
      if (getDay(day) === 6) { // Saturday - end of week
        weeks.push(currentWeek)
        currentWeek = []
      }
    }
    
    // Push remaining days
    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }
    
    // Calculate month label positions
    const monthPositions: { month: number; weekIndex: number }[] = []
    let lastMonth = -1
    
    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week[0]?.date
      if (firstDayOfWeek) {
        const month = firstDayOfWeek.getMonth()
        if (month !== lastMonth) {
          monthPositions.push({ month, weekIndex })
          lastMonth = month
        }
      }
    })
    
    return { weeks, monthPositions, maxCompleted, maxTime, totalContributions }
  }, [data])

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
        <div className="h-[120px] bg-zinc-800/50 rounded animate-pulse" />
      </div>
    )
  }

  const formatDuration = (ms: number): string => {
    if (ms === 0) return '0m'
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          <span className="font-medium text-zinc-100">{totalContributions}</span> contributions in the last year
        </p>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[750px]">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {monthPositions.map(({ month, weekIndex }, i) => {
              const nextPosition = monthPositions[i + 1]?.weekIndex || weeks.length
              const width = (nextPosition - weekIndex) * 13 // 11px cell + 2px gap
              
              return (
                <div
                  key={`${month}-${weekIndex}`}
                  className="text-xs text-zinc-500"
                  style={{ width: `${width}px` }}
                >
                  {monthLabels[month]}
                </div>
              )
            })}
          </div>
          
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col gap-[2px] mr-2 text-xs text-zinc-500">
              {dayLabels.map((day, i) => (
                <div 
                  key={day} 
                  className="h-[11px] flex items-center"
                  style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Grid */}
            <div className="flex gap-[2px]">
              <TooltipProvider delayDuration={100}>
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[2px]">
                    {/* Pad the first week if it doesn't start on Sunday */}
                    {weekIndex === 0 && week.length < 7 && (
                      Array.from({ length: 7 - week.length }).map((_, i) => (
                        <div key={`pad-${i}`} className="w-[11px] h-[11px]" />
                      ))
                    )}
                    {week.map(({ date, data: dayData }) => {
                      const intensity = dayData 
                        ? getIntensityLevel(
                            dayData.completedCount, 
                            dayData.totalTime, 
                            maxCompleted, 
                            maxTime
                          )
                        : 0
                      
                      const isToday = isSameDay(date, new Date())
                      
                      return (
                        <Tooltip key={date.toISOString()}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "w-[11px] h-[11px] rounded-sm transition-colors cursor-pointer",
                                intensityColors[intensity],
                                isToday && "ring-1 ring-zinc-400"
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent 
                            side="top" 
                            className="bg-zinc-900 border-zinc-700 text-zinc-100"
                          >
                            <div className="text-sm">
                              <p className="font-medium">
                                {format(date, 'EEEE, MMM d, yyyy')}
                              </p>
                              {dayData ? (
                                <div className="text-zinc-400 mt-1">
                                  <p>{dayData.completedCount} tasks completed</p>
                                  <p>{formatDuration(dayData.totalTime)} tracked</p>
                                </div>
                              ) : (
                                <p className="text-zinc-500">No activity</p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-3 text-xs text-zinc-500">
            <span>Less</span>
            {intensityColors.map((color, i) => (
              <div
                key={i}
                className={cn("w-[11px] h-[11px] rounded-sm", color)}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}
