import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/stopwatches/[id]/laps - Create new lap
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id: stopwatchId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { labelId } = body;

    // Verify stopwatch ownership
    const stopwatch = await prisma.stopwatch.findFirst({
      where: {
        id: stopwatchId,
        task: {
          taskList: { userId },
        },
      },
      include: {
        laps: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!stopwatch) {
      return NextResponse.json(
        { error: "Stopwatch not found" },
        { status: 404 }
      );
    }

    if (!stopwatch.isActive) {
      return NextResponse.json(
        { error: "Stopwatch is not running" },
        { status: 400 }
      );
    }

    // Calculate lap timing
    const now = new Date();
    const lastLap = stopwatch.laps[0];
    const startTime = lastLap ? lastLap.endTime : stopwatch.startTime;
    const duration = now.getTime() - startTime.getTime();

    // Verify label belongs to user if provided
    if (labelId) {
      const label = await prisma.label.findFirst({
        where: {
          id: labelId,
          userId,
        },
      });

      if (!label) {
        return NextResponse.json(
          { error: "Label not found" },
          { status: 404 }
        );
      }
    }

    // Create lap
    const lap = await prisma.stopwatchLap.create({
      data: {
        stopwatchId,
        labelId: labelId || null,
        startTime,
        endTime: now,
        duration,
      },
      include: {
        label: true,
      },
    });

    return NextResponse.json({ lap }, { status: 201 });
  } catch (error) {
    console.error("Error creating lap:", error);
    return NextResponse.json(
      { error: "Failed to create lap" },
      { status: 500 }
    );
  }
}

// GET /api/stopwatches/[id]/laps - Get all laps for stopwatch
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id: stopwatchId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify stopwatch ownership
    const stopwatch = await prisma.stopwatch.findFirst({
      where: {
        id: stopwatchId,
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

    const laps = await prisma.stopwatchLap.findMany({
      where: { stopwatchId },
      include: {
        label: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ laps });
  } catch (error) {
    console.error("Error fetching laps:", error);
    return NextResponse.json(
      { error: "Failed to fetch laps" },
      { status: 500 }
    );
  }
}
