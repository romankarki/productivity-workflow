import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subDays, subMonths, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'
import { LabelAnalytics, LabelAnalyticsItem } from '@/lib/types/analytics'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const period = searchParams.get('period') || 'week' // 'week' or 'month'
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const now = new Date()
    let currentStart: Date
    let currentEnd: Date
    let previousStart: Date
    let previousEnd: Date

    if (period === 'month') {
      currentStart = startOfMonth(now)
      currentEnd = endOfMonth(now)
      previousStart = startOfMonth(subMonths(now, 1))
      previousEnd = endOfMonth(subMonths(now, 1))
    } else {
      currentStart = startOfDay(subDays(now, 6))
      currentEnd = endOfDay(now)
      previousStart = startOfDay(subDays(now, 13))
      previousEnd = endOfDay(subDays(now, 7))
    }

    // Get all user labels
    const userLabels = await prisma.label.findMany({
      where: { userId },
    })

    // Fetch current period stopwatch laps
    const currentLaps = await prisma.stopwatchLap.findMany({
      where: {
        stopwatch: {
          task: {
            taskList: {
              userId,
              date: {
                gte: currentStart,
                lte: currentEnd,
              },
            },
          },
        },
      },
      include: {
        label: true,
      },
    })

    // Fetch previous period stopwatch laps for trend comparison
    const previousLaps = await prisma.stopwatchLap.findMany({
      where: {
        stopwatch: {
          task: {
            taskList: {
              userId,
              date: {
                gte: previousStart,
                lte: previousEnd,
              },
            },
          },
        },
      },
      include: {
        label: true,
      },
    })

    // Also fetch stopwatches without laps for current period
    const currentStopwatches = await prisma.stopwatch.findMany({
      where: {
        task: {
          taskList: {
            userId,
            date: {
              gte: currentStart,
              lte: currentEnd,
            },
          },
        },
        laps: {
          none: {},
        },
        totalDuration: {
          gt: 0,
        },
      },
    })

    // Same for previous period
    const previousStopwatches = await prisma.stopwatch.findMany({
      where: {
        task: {
          taskList: {
            userId,
            date: {
              gte: previousStart,
              lte: previousEnd,
            },
          },
        },
        laps: {
          none: {},
        },
        totalDuration: {
          gt: 0,
        },
      },
    })

    // Calculate current period time per label
    const currentLabelTime = new Map<string, number>()
    let totalCurrentTime = 0

    for (const lap of currentLaps) {
      const labelId = lap.labelId || 'unlabeled'
      const current = currentLabelTime.get(labelId) || 0
      currentLabelTime.set(labelId, current + lap.duration)
      totalCurrentTime += lap.duration
    }

    // Add unlabeled stopwatch time
    for (const sw of currentStopwatches) {
      const current = currentLabelTime.get('unlabeled') || 0
      currentLabelTime.set('unlabeled', current + sw.totalDuration)
      totalCurrentTime += sw.totalDuration
    }

    // Calculate previous period time per label
    const previousLabelTime = new Map<string, number>()

    for (const lap of previousLaps) {
      const labelId = lap.labelId || 'unlabeled'
      const current = previousLabelTime.get(labelId) || 0
      previousLabelTime.set(labelId, current + lap.duration)
    }

    for (const sw of previousStopwatches) {
      const current = previousLabelTime.get('unlabeled') || 0
      previousLabelTime.set('unlabeled', current + sw.totalDuration)
    }

    // Build label analytics items
    const labels: LabelAnalyticsItem[] = []

    // Add all user labels
    for (const label of userLabels) {
      const currentTime = currentLabelTime.get(label.id) || 0
      const previousTime = previousLabelTime.get(label.id) || 0
      
      if (currentTime > 0 || previousTime > 0) {
        const trendValue = previousTime > 0 
          ? ((currentTime - previousTime) / previousTime) * 100 
          : currentTime > 0 ? 100 : 0
        
        labels.push({
          id: label.id,
          name: label.name,
          color: label.color,
          totalTime: currentTime,
          percentage: totalCurrentTime > 0 ? (currentTime / totalCurrentTime) * 100 : 0,
          trend: trendValue > 5 ? 'up' : trendValue < -5 ? 'down' : 'stable',
          trendValue: Math.round(Math.abs(trendValue)),
        })
      }
    }

    // Add unlabeled if there's any
    const unlabeledCurrentTime = currentLabelTime.get('unlabeled') || 0
    const unlabeledPreviousTime = previousLabelTime.get('unlabeled') || 0
    
    if (unlabeledCurrentTime > 0 || unlabeledPreviousTime > 0) {
      const trendValue = unlabeledPreviousTime > 0 
        ? ((unlabeledCurrentTime - unlabeledPreviousTime) / unlabeledPreviousTime) * 100 
        : unlabeledCurrentTime > 0 ? 100 : 0
      
      labels.push({
        id: 'unlabeled',
        name: 'Unlabeled',
        color: '#6b7280',
        totalTime: unlabeledCurrentTime,
        percentage: totalCurrentTime > 0 ? (unlabeledCurrentTime / totalCurrentTime) * 100 : 0,
        trend: trendValue > 5 ? 'up' : trendValue < -5 ? 'down' : 'stable',
        trendValue: Math.round(Math.abs(trendValue)),
      })
    }

    // Sort by total time descending
    labels.sort((a, b) => b.totalTime - a.totalTime)

    const analytics: LabelAnalytics = {
      labels,
      totalTrackedTime: totalCurrentTime,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching label analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch label analytics' },
      { status: 500 }
    )
  }
}
