import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

// GET /api/goals - Get goal progress for week/month
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date") || new Date().toISOString();
    const date = new Date(dateParam);

    // Get week boundaries (Sunday to Saturday)
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 0 });

    // Get month boundaries
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    // Fetch weekly task lists
    const weeklyTaskLists = await prisma.taskList.findMany({
      where: {
        userId,
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        tasks: {
          select: { completed: true },
        },
      },
    });

    // Fetch monthly task lists
    const monthlyTaskLists = await prisma.taskList.findMany({
      where: {
        userId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        tasks: {
          select: { completed: true },
        },
      },
    });

    // Calculate weekly stats
    const weeklyTasks = weeklyTaskLists.flatMap((tl) => tl.tasks);
    const weeklyCompleted = weeklyTasks.filter((t) => t.completed).length;
    const weeklyGoal = weeklyTaskLists[0]?.weeklyGoal || null;

    // Calculate monthly stats
    const monthlyTasks = monthlyTaskLists.flatMap((tl) => tl.tasks);
    const monthlyCompleted = monthlyTasks.filter((t) => t.completed).length;
    const monthlyGoal = monthlyTaskLists[0]?.monthlyGoal || null;

    return NextResponse.json({
      weekly: {
        goal: weeklyGoal,
        completed: weeklyCompleted,
        total: weeklyTasks.length,
      },
      monthly: {
        goal: monthlyGoal,
        completed: monthlyCompleted,
        total: monthlyTasks.length,
      },
    });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

// PUT /api/goals - Update goals
export async function PUT(request: NextRequest) {
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

    const parsedDate = new Date(date);

    // Update or create task list with goals
    const taskList = await prisma.taskList.upsert({
      where: {
        userId_date: {
          userId,
          date: parsedDate,
        },
      },
      update: {
        ...(weeklyGoal !== undefined && { weeklyGoal }),
        ...(monthlyGoal !== undefined && { monthlyGoal }),
      },
      create: {
        userId,
        date: parsedDate,
        weeklyGoal: weeklyGoal || null,
        monthlyGoal: monthlyGoal || null,
      },
    });

    return NextResponse.json({ taskList });
  } catch (error) {
    console.error("Error updating goals:", error);
    return NextResponse.json(
      { error: "Failed to update goals" },
      { status: 500 }
    );
  }
}
