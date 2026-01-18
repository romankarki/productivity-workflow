import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/tasklists/[taskListId]/tasks - Create new task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskListId: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskListId } = await params;
    const body = await request.json();
    const { title, description } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Verify task list belongs to user
    const taskList = await prisma.taskList.findFirst({
      where: {
        id: taskListId,
        userId,
      },
    });

    if (!taskList) {
      return NextResponse.json(
        { error: "Task list not found" },
        { status: 404 }
      );
    }

    // Get the highest order number for this task list
    const lastTask = await prisma.task.findFirst({
      where: { taskListId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const nextOrder = (lastTask?.order ?? -1) + 1;

    const task = await prisma.task.create({
      data: {
        taskListId,
        title: title.trim(),
        description: description?.trim() || null,
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

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
