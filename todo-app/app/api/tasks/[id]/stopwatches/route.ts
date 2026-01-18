import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tasks/[id]/stopwatches - Get stopwatch history for task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id: taskId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Get all stopwatches for this task
    const stopwatches = await prisma.stopwatch.findMany({
      where: { taskId },
      include: {
        laps: {
          include: {
            label: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate total time tracked
    const totalTimeTracked = stopwatches.reduce((acc, sw) => {
      if (sw.isActive) {
        // Add current elapsed time for active stopwatch
        const elapsed = new Date().getTime() - sw.startTime.getTime();
        return acc + sw.totalDuration + elapsed;
      }
      return acc + sw.totalDuration;
    }, 0);

    return NextResponse.json({
      stopwatches,
      totalTimeTracked,
      sessionCount: stopwatches.length,
    });
  } catch (error) {
    console.error("Error fetching task stopwatches:", error);
    return NextResponse.json(
      { error: "Failed to fetch stopwatches" },
      { status: 500 }
    );
  }
}
