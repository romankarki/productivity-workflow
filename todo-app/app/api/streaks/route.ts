import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { calculateStreak } from "@/lib/utils/streak";
import { format, subDays } from "date-fns";

// GET /api/streaks - Get streak data for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch task lists for the last 365 days
    const startDate = subDays(new Date(), 365);
    const endDate = new Date();

    const taskLists = await prisma.taskList.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        tasks: {
          select: {
            completed: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Transform to day data for streak calculation
    const days = taskLists.map((tl) => ({
      date: format(tl.date, "yyyy-MM-dd"),
      hasCompletedTask: tl.tasks.some((t) => t.completed),
    }));

    const streakData = calculateStreak(days);

    return NextResponse.json(streakData);
  } catch (error) {
    console.error("Error fetching streak data:", error);
    return NextResponse.json(
      { error: "Failed to fetch streak data" },
      { status: 500 }
    );
  }
}
