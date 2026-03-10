import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Helper to check if string is a date (YYYY-MM-DD format)
function isDateString(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

// GET /api/tasklists/[id] - Get task list by date or ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    let taskList;

    if (isDateString(id)) {
      // Treat as date lookup
      const parsedDate = new Date(id);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format. Use YYYY-MM-DD" },
          { status: 400 }
        );
      }

      // Try to find existing task list
      taskList = await prisma.taskList.findUnique({
        where: {
          userId_date: {
            userId,
            date: parsedDate,
          },
        },
        include: {
          tasks: {
            orderBy: { order: "asc" },
            include: {
              labels: {
                include: {
                  label: true,
                },
              },
            },
          },
        },
      });

      // Create if doesn't exist
      if (!taskList) {
        // Verify user exists before creating
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        taskList = await prisma.taskList.create({
          data: {
            userId,
            date: parsedDate,
          },
          include: {
            tasks: {
              orderBy: { order: "asc" },
              include: {
                labels: {
                  include: {
                    label: true,
                  },
                },
              },
            },
          },
        });
      }
    } else {
      // Treat as ID lookup
      taskList = await prisma.taskList.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          tasks: {
            orderBy: { order: "asc" },
            include: {
              labels: {
                include: {
                  label: true,
                },
              },
            },
          },
        },
      });

      if (!taskList) {
        return NextResponse.json(
          { error: "Task list not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ taskList });
  } catch (error) {
    console.error("Error fetching task list:", error);
    return NextResponse.json(
      { error: "Failed to fetch task list" },
      { status: 500 }
    );
  }
}

// PUT /api/tasklists/[id] - Update task list goals, notes, and daily wins
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { weeklyGoal, monthlyGoal, notes, dailyWins } = body;

    let taskList;

    if (isDateString(id)) {
      const parsedDate = new Date(id);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }

      taskList = await prisma.taskList.update({
        where: {
          userId_date: {
            userId,
            date: parsedDate,
          },
        },
        data: {
          ...(weeklyGoal !== undefined && { weeklyGoal }),
          ...(monthlyGoal !== undefined && { monthlyGoal }),
          ...(notes !== undefined && { notes }),
          ...(dailyWins !== undefined && { dailyWins }),
        },
      });
    } else {
      taskList = await prisma.taskList.updateMany({
        where: {
          id,
          userId,
        },
        data: {
          ...(weeklyGoal !== undefined && { weeklyGoal }),
          ...(monthlyGoal !== undefined && { monthlyGoal }),
          ...(notes !== undefined && { notes }),
          ...(dailyWins !== undefined && { dailyWins }),
        },
      });
    }

    return NextResponse.json({ taskList });
  } catch (error) {
    console.error("Error updating task list:", error);
    return NextResponse.json(
      { error: "Failed to update task list" },
      { status: 500 }
    );
  }
}
