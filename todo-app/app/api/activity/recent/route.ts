import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, subDays, format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      )
    }

    const endDate = new Date()
    const startDate = subDays(endDate, 13)

    const taskLists = await prisma.taskList.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      include: {
        tasks: {
          include: {
            labels: {
              include: {
                label: true,
              },
            },
            stopwatches: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { date: 'desc' },
    })

    const taskListMap = new Map(
      taskLists.map((tl) => [format(tl.date, 'yyyy-MM-dd'), tl])
    )

    const days = []

    for (let i = 0; i < 14; i++) {
      const date = subDays(endDate, i)
      const dateStr = format(date, 'yyyy-MM-dd')
      const taskList = taskListMap.get(dateStr)

      if (!taskList) {
        days.push({
          date: dateStr,
          tasks: [],
          notes: null,
          dailyWins: null,
          totalTime: 0,
          completedCount: 0,
          taskCount: 0,
        })
        continue
      }

      const tasks = taskList.tasks.map((task) => {
        const totalTimeTracked = task.stopwatches.reduce(
          (sum, sw) => sum + sw.totalDuration,
          0
        )

        return {
          id: task.id,
          title: task.title,
          completed: task.completed,
          labels: task.labels.map((tl) => ({
            id: tl.label.id,
            name: tl.label.name,
            color: tl.label.color,
          })),
          totalTimeTracked,
        }
      })

      const totalTime = tasks.reduce((sum, t) => sum + t.totalTimeTracked, 0)

      days.push({
        date: dateStr,
        tasks,
        notes: taskList.notes,
        dailyWins: taskList.dailyWins,
        totalTime,
        completedCount: tasks.filter((t) => t.completed).length,
        taskCount: tasks.length,
      })
    }

    return NextResponse.json({ data: days })
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    )
  }
}
