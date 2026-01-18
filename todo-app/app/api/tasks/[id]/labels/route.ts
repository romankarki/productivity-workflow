import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tasks/[id]/labels - Get labels for a task
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
      include: {
        labels: {
          include: {
            label: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const labels = task.labels.map((tl) => tl.label);
    return NextResponse.json({ labels });
  } catch (error) {
    console.error("Error fetching task labels:", error);
    return NextResponse.json(
      { error: "Failed to fetch task labels" },
      { status: 500 }
    );
  }
}

// POST /api/tasks/[id]/labels - Add label to task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id: taskId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { labelId } = body;

    if (!labelId) {
      return NextResponse.json(
        { error: "Label ID is required" },
        { status: 400 }
      );
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

    // Verify label belongs to user
    const label = await prisma.label.findFirst({
      where: {
        id: labelId,
        userId,
      },
    });

    if (!label) {
      return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }

    // Check if already exists
    const existing = await prisma.taskLabel.findUnique({
      where: {
        taskId_labelId: {
          taskId,
          labelId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Label already added to task" },
        { status: 409 }
      );
    }

    // Create association
    const taskLabel = await prisma.taskLabel.create({
      data: {
        taskId,
        labelId,
      },
      include: {
        label: true,
      },
    });

    return NextResponse.json({ label: taskLabel.label }, { status: 201 });
  } catch (error) {
    console.error("Error adding label to task:", error);
    return NextResponse.json(
      { error: "Failed to add label to task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id]/labels - Remove label from task (with labelId in body)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id: taskId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const labelId = searchParams.get("labelId");

    if (!labelId) {
      return NextResponse.json(
        { error: "Label ID is required" },
        { status: 400 }
      );
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

    // Delete the association
    await prisma.taskLabel.deleteMany({
      where: {
        taskId,
        labelId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing label from task:", error);
    return NextResponse.json(
      { error: "Failed to remove label from task" },
      { status: 500 }
    );
  }
}
