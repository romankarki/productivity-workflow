import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, format, parseISO, eachDayOfInterval } from 'date-fns'
import { DailyStats, MonthlyAnalytics } from '@/lib/types/analytics'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const monthParam = searchParams.get('month') // YYYY-MM format
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Parse month or default to current month
    let targetDate: Date
    if (monthParam) {
      targetDate = parseISO(`${monthParam}-01`)
    } else {
      targetDate = new Date()
    }
    
    const monthStart = startOfMonth(targetDate)
    const monthEnd = endOfMonth(targetDate)

    // Fetch all task lists for the month
    const taskLists = await prisma.taskList.findMany({
      where: {
        userId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        tasks: {
          include: {
            stopwatches: {
              include: {
                laps: {
                  include: {
                    label: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // Build a map of daily stats
    const dailyStatsMap = new Map<string, DailyStats>()
    
    // Initialize all days in the month
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
    for (const day of allDays) {
      const dateStr = format(day, 'yyyy-MM-dd')
      dailyStatsMap.set(dateStr, {
        date: dateStr,
        totalTime: 0,
        taskCount: 0,
        completedCount: 0,
        labelBreakdown: [],
      })
    }

    // Process task lists
    let totalTasks = 0
    let completedTasks = 0
    
    for (const taskList of taskLists) {
      const dateStr = format(taskList.date, 'yyyy-MM-dd')
      const stats = dailyStatsMap.get(dateStr)
      
      if (!stats) continue
      
      stats.taskCount = taskList.tasks.length
      stats.completedCount = taskList.tasks.filter(t => t.completed).length
      
      totalTasks += stats.taskCount
      completedTasks += stats.completedCount
      
      // Calculate time tracked per label
      const labelTimeMap = new Map<string, { time: number; name: string; color: string }>()
      
      for (const task of taskList.tasks) {
        for (const stopwatch of task.stopwatches) {
          stats.totalTime += stopwatch.totalDuration
          
          for (const lap of stopwatch.laps) {
            if (lap.label) {
              const existing = labelTimeMap.get(lap.label.id) || {
                time: 0,
                name: lap.label.name,
                color: lap.label.color,
              }
              existing.time += lap.duration
              labelTimeMap.set(lap.label.id, existing)
            } else {
              const existing = labelTimeMap.get('unlabeled') || {
                time: 0,
                name: 'Unlabeled',
                color: '#6b7280',
              }
              existing.time += lap.duration
              labelTimeMap.set('unlabeled', existing)
            }
          }
          
          if (stopwatch.laps.length === 0 && stopwatch.totalDuration > 0) {
            const existing = labelTimeMap.get('unlabeled') || {
              time: 0,
              name: 'Unlabeled',
              color: '#6b7280',
            }
            existing.time += stopwatch.totalDuration
            labelTimeMap.set('unlabeled', existing)
          }
        }
      }
      
      stats.labelBreakdown = Array.from(labelTimeMap.entries()).map(([id, data]) => ({
        labelId: id,
        labelName: data.name,
        labelColor: data.color,
        time: data.time,
      }))
    }

    // Convert map to array and calculate totals
    const days = Array.from(dailyStatsMap.values())
    const totalTime = days.reduce((sum, day) => sum + day.totalTime, 0)
    const daysWithTime = days.filter(day => day.totalTime > 0).length
    const averageDaily = daysWithTime > 0 ? totalTime / daysWithTime : 0
    
    // Find most productive day
    let mostProductiveDay: string | null = null
    let maxTime = 0
    for (const day of days) {
      if (day.totalTime > maxTime) {
        maxTime = day.totalTime
        mostProductiveDay = day.date
      }
    }

    const analytics: MonthlyAnalytics = {
      days,
      totalTime,
      averageDaily,
      mostProductiveDay,
      taskCompletion: {
        total: totalTasks,
        completed: completedTasks,
        rate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching monthly analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch monthly analytics' },
      { status: 500 }
    )
  }
}
