import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tasklists/[date] - Get or create task list for specific date
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date } = await params;

    // Parse date string (YYYY-MM-DD format)
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Try to find existing task list
    let taskList = await prisma.taskList.findUnique({
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

    return NextResponse.json({ taskList });
  } catch (error) {
    console.error("Error fetching task list:", error);
    return NextResponse.json(
      { error: "Failed to fetch task list" },
      { status: 500 }
    );
  }
}

// PUT /api/tasklists/[date] - Update task list goals
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date } = await params;
    const body = await request.json();
    const { weeklyGoal, monthlyGoal } = body;

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const taskList = await prisma.taskList.update({
      where: {
        userId_date: {
          userId,
          date: parsedDate,
        },
      },
      data: {
        ...(weeklyGoal !== undefined && { weeklyGoal }),
        ...(monthlyGoal !== undefined && { monthlyGoal }),
      },
    });

    return NextResponse.json({ taskList });
  } catch (error) {
    console.error("Error updating task list:", error);
    return NextResponse.json(
      { error: "Failed to update task list" },
      { status: 500 }
    );
  }
}
