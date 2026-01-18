import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/tasks/[id]/order - Update task order
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { order, taskListId } = body;

    if (typeof order !== "number" || order < 0) {
      return NextResponse.json(
        { error: "Valid order number is required" },
        { status: 400 }
      );
    }

    // Verify task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        taskList: { userId },
      },
      include: {
        taskList: true,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const targetTaskListId = taskListId || existingTask.taskListId;
    const oldOrder = existingTask.order;

    // If moving within the same list
    if (targetTaskListId === existingTask.taskListId) {
      if (order > oldOrder) {
        // Moving down: decrement orders of tasks between old and new position
        await prisma.task.updateMany({
          where: {
            taskListId: targetTaskListId,
            order: {
              gt: oldOrder,
              lte: order,
            },
          },
          data: {
            order: { decrement: 1 },
          },
        });
      } else if (order < oldOrder) {
        // Moving up: increment orders of tasks between new and old position
        await prisma.task.updateMany({
          where: {
            taskListId: targetTaskListId,
            order: {
              gte: order,
              lt: oldOrder,
            },
          },
          data: {
            order: { increment: 1 },
          },
        });
      }
    }

    // Update the task's order
    const task = await prisma.task.update({
      where: { id },
      data: {
        order,
        taskListId: targetTaskListId,
      },
      include: {
        labels: {
          include: {
            label: true,
          },
        },
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error updating task order:", error);
    return NextResponse.json(
      { error: "Failed to update task order" },
      { status: 500 }
    );
  }
}
