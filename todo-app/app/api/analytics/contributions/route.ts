import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subYears, format, startOfDay, endOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const today = new Date()
    const yearAgo = subYears(today, 1)

    // Fetch all task lists for the past year
    const taskLists = await prisma.taskList.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay(yearAgo),
          lte: endOfDay(today),
        },
      },
      include: {
        tasks: {
          include: {
            stopwatches: true,
          },
        },
      },
    })

    // Build contribution data
    const contributions = taskLists.map(taskList => {
      const taskCount = taskList.tasks.length
      const completedCount = taskList.tasks.filter(t => t.completed).length
      
      // Calculate total time from stopwatches
      const totalTime = taskList.tasks.reduce((sum, task) => {
        return sum + task.stopwatches.reduce((swSum, sw) => swSum + sw.totalDuration, 0)
      }, 0)

      return {
        date: format(taskList.date, 'yyyy-MM-dd'),
        taskCount,
        completedCount,
        totalTime,
      }
    })

    return NextResponse.json({ contributions })
  } catch (error) {
    console.error('Error fetching contribution data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contribution data' },
      { status: 500 }
    )
  }
}
