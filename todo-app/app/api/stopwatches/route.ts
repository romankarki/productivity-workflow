import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/stopwatches - Create new stopwatch
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Verify task belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        taskList: { userId },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Block if any unfinished stopwatch (running or paused) already exists
    const activeStopwatch = await prisma.stopwatch.findFirst({
      where: {
        endTime: null,
        task: {
          taskList: { userId },
        },
      },
    });

    if (activeStopwatch) {
      return NextResponse.json(
        { error: "Another stopwatch is already running" },
        { status: 409 }
      );
    }

    // Create new stopwatch
    const stopwatch = await prisma.stopwatch.create({
      data: {
        taskId,
        startTime: new Date(),
        isActive: true,
        totalDuration: 0,
      },
      include: {
        laps: {
          include: {
            label: true,
          },
          orderBy: { createdAt: "desc" },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ stopwatch }, { status: 201 });
  } catch (error) {
    console.error("Error creating stopwatch:", error);
    return NextResponse.json(
      { error: "Failed to create stopwatch" },
      { status: 500 }
    );
  }
}

// GET /api/stopwatches - Get active stopwatch for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find active or paused (not yet stopped) stopwatch
    const activeStopwatch = await prisma.stopwatch.findFirst({
      where: {
        endTime: null,
        task: {
          taskList: { userId },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        laps: {
          include: {
            label: true,
          },
          orderBy: { createdAt: "desc" },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ stopwatch: activeStopwatch });
  } catch (error) {
    console.error("Error fetching active stopwatch:", error);
    return NextResponse.json(
      { error: "Failed to fetch stopwatch" },
      { status: 500 }
    );
  }
}
