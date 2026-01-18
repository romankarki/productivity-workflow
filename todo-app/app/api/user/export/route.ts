import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Fetch all user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        taskLists: {
          include: {
            tasks: {
              include: {
                labels: {
                  include: {
                    label: true,
                  },
                },
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
        },
        labels: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Format the export data
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        username: user.username,
        createdAt: user.createdAt,
      },
      labels: user.labels.map(label => ({
        name: label.name,
        color: label.color,
        createdAt: label.createdAt,
      })),
      taskLists: user.taskLists.map(taskList => ({
        date: taskList.date,
        weeklyGoal: taskList.weeklyGoal,
        monthlyGoal: taskList.monthlyGoal,
        tasks: taskList.tasks.map(task => ({
          title: task.title,
          description: task.description,
          completed: task.completed,
          order: task.order,
          createdAt: task.createdAt,
          labels: task.labels.map(tl => tl.label.name),
          stopwatches: task.stopwatches.map(sw => ({
            startTime: sw.startTime,
            endTime: sw.endTime,
            totalDuration: sw.totalDuration,
            laps: sw.laps.map(lap => ({
              duration: lap.duration,
              lapNumber: lap.lapNumber,
              label: lap.label?.name || null,
              startTime: lap.startTime,
              endTime: lap.endTime,
            })),
          })),
        })),
      })),
      statistics: {
        totalTasks: user.taskLists.reduce((sum, tl) => sum + tl.tasks.length, 0),
        completedTasks: user.taskLists.reduce(
          (sum, tl) => sum + tl.tasks.filter(t => t.completed).length, 
          0
        ),
        totalTimeTracked: user.taskLists.reduce(
          (sum, tl) => sum + tl.tasks.reduce(
            (taskSum, t) => taskSum + t.stopwatches.reduce(
              (swSum, sw) => swSum + sw.totalDuration, 
              0
            ), 
            0
          ), 
          0
        ),
        totalLabels: user.labels.length,
        totalDays: user.taskLists.length,
      },
    }

    return NextResponse.json(exportData)
  } catch (error) {
    console.error('Error exporting user data:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
