import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/stopwatches/[id] - Get single stopwatch
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stopwatch = await prisma.stopwatch.findFirst({
      where: {
        id,
        task: {
          taskList: { userId },
        },
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

    if (!stopwatch) {
      return NextResponse.json(
        { error: "Stopwatch not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ stopwatch });
  } catch (error) {
    console.error("Error fetching stopwatch:", error);
    return NextResponse.json(
      { error: "Failed to fetch stopwatch" },
      { status: 500 }
    );
  }
}

// PUT /api/stopwatches/[id] - Update stopwatch (pause, resume, stop)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body as { action: 'pause' | 'resume' | 'stop' };

    if (!action || !['pause', 'resume', 'stop'].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'pause', 'resume', or 'stop'" },
        { status: 400 }
      );
    }

    // Get current stopwatch
    const currentStopwatch = await prisma.stopwatch.findFirst({
      where: {
        id,
        task: {
          taskList: { userId },
        },
      },
    });

    if (!currentStopwatch) {
      return NextResponse.json(
        { error: "Stopwatch not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    let updateData: {
      isActive?: boolean;
      startTime?: Date;
      endTime?: Date | null;
      totalDuration?: number;
    } = {};

    switch (action) {
      case 'pause':
        if (!currentStopwatch.isActive) {
          return NextResponse.json(
            { error: "Stopwatch is not running" },
            { status: 400 }
          );
        }
        // Calculate elapsed time since startTime and add to totalDuration
        const pauseElapsed = now.getTime() - currentStopwatch.startTime.getTime();
        updateData = {
          isActive: false,
          totalDuration: currentStopwatch.totalDuration + pauseElapsed,
        };
        break;

      case 'resume':
        if (currentStopwatch.isActive) {
          return NextResponse.json(
            { error: "Stopwatch is already running" },
            { status: 400 }
          );
        }
        if (currentStopwatch.endTime) {
          return NextResponse.json(
            { error: "Stopwatch has already been stopped" },
            { status: 400 }
          );
        }
        updateData = {
          isActive: true,
          startTime: now, // Reset startTime for accurate tracking
        };
        break;

      case 'stop':
        // Calculate final duration
        let finalDuration = currentStopwatch.totalDuration;
        if (currentStopwatch.isActive) {
          const stopElapsed = now.getTime() - currentStopwatch.startTime.getTime();
          finalDuration += stopElapsed;
        }
        updateData = {
          isActive: false,
          endTime: now,
          totalDuration: finalDuration,
        };
        break;
    }

    const stopwatch = await prisma.stopwatch.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ stopwatch });
  } catch (error) {
    console.error("Error updating stopwatch:", error);
    return NextResponse.json(
      { error: "Failed to update stopwatch" },
      { status: 500 }
    );
  }
}

// DELETE /api/stopwatches/[id] - Delete stopwatch
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const stopwatch = await prisma.stopwatch.findFirst({
      where: {
        id,
        task: {
          taskList: { userId },
        },
      },
    });

    if (!stopwatch) {
      return NextResponse.json(
        { error: "Stopwatch not found" },
        { status: 404 }
      );
    }

    await prisma.stopwatch.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting stopwatch:", error);
    return NextResponse.json(
      { error: "Failed to delete stopwatch" },
      { status: 500 }
    );
  }
}
