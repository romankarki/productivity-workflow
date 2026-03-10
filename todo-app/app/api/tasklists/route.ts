import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tasklists - Get all task lists for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    // Build date filter if month/year provided
    let dateFilter = {};
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      dateFilter = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    const taskLists = await prisma.taskList.findMany({
      where: {
        userId,
        ...dateFilter,
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({ taskLists });
  } catch (error) {
    console.error("Error fetching task lists:", error);
    return NextResponse.json(
      { error: "Failed to fetch task lists" },
      { status: 500 }
    );
  }
}

// POST /api/tasklists - Create new task list
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { date, weeklyGoal, monthlyGoal } = body;

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    // Parse date string to Date object
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Check if task list already exists for this date
    const existing = await prisma.taskList.findUnique({
      where: {
        userId_date: {
          userId,
          date: parsedDate,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Task list already exists for this date" },
        { status: 409 }
      );
    }

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

    const taskList = await prisma.taskList.create({
      data: {
        userId,
        date: parsedDate,
        weeklyGoal: weeklyGoal ?? null,
        monthlyGoal: monthlyGoal ?? null,
      },
    });

    return NextResponse.json({ taskList }, { status: 201 });
  } catch (error) {
    console.error("Error creating task list:", error);
    return NextResponse.json(
      { error: "Failed to create task list" },
      { status: 500 }
    );
  }
}
