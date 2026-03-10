import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/stopwatches/today - Get total duration of completed stopwatch sessions today
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Sum totalDuration for all fully stopped sessions today
    const stopwatches = await prisma.stopwatch.findMany({
      where: {
        endTime: { not: null },
        createdAt: { gte: startOfDay },
        task: {
          taskList: { userId },
        },
      },
      select: { totalDuration: true },
    });

    const totalDuration = stopwatches.reduce(
      (sum, sw) => sum + sw.totalDuration,
      0
    );

    return NextResponse.json({ totalDuration });
  } catch (error) {
    console.error("Error fetching today's total time:", error);
    return NextResponse.json(
      { error: "Failed to fetch today's time" },
      { status: 500 }
    );
  }
}
