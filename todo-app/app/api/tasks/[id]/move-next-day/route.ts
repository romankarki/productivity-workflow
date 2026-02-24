import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { addDays, format } from "date-fns";

// POST /api/tasks/[id]/move-next-day - Move an incomplete task to the next day
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        taskList: { userId },
      },
      include: {
        taskList: {
          select: {
            id: true,
            date: true,
          },
        },
        stopwatches: {
          where: { endTime: null },
          select: { id: true },
        },
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (existingTask.completed) {
      return NextResponse.json(
        { error: "Only incomplete tasks can be moved" },
        { status: 400 }
      );
    }

    if (existingTask.stopwatches.length > 0) {
      return NextResponse.json(
        { error: "Stop the timer before moving this task" },
        { status: 409 }
      );
    }

    const sourceTaskListId = existingTask.taskList.id;
    const sourceOrder = existingTask.order;
    const targetDate = addDays(existingTask.taskList.date, 1);

    const result = await prisma.$transaction(async (tx) => {
      const targetTaskList = await tx.taskList.upsert({
        where: {
          userId_date: {
            userId,
            date: targetDate,
          },
        },
        create: {
          userId,
          date: targetDate,
        },
        update: {},
        select: {
          id: true,
        },
      });

      const lastTaskInTarget = await tx.task.findFirst({
        where: {
          taskListId: targetTaskList.id,
        },
        orderBy: {
          order: "desc",
        },
        select: {
          order: true,
        },
      });

      const nextOrder = (lastTaskInTarget?.order ?? -1) + 1;

      const movedTask = await tx.task.update({
        where: { id },
        data: {
          taskListId: targetTaskList.id,
          order: nextOrder,
        },
        include: {
          labels: {
            include: {
              label: true,
            },
          },
        },
      });

      await tx.task.updateMany({
        where: {
          taskListId: sourceTaskListId,
          order: {
            gt: sourceOrder,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });

      return movedTask;
    });

    return NextResponse.json({
      task: result,
      targetDate: format(targetDate, "yyyy-MM-dd"),
    });
  } catch (error) {
    console.error("Error moving task to next day:", error);
    return NextResponse.json(
      { error: "Failed to move task to next day" },
      { status: 500 }
    );
  }
}
