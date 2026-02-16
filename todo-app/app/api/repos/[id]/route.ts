import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/repos/[id] - get repo details including notes
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const repo = await prisma.trackedRepo.findFirst({
      where: { id, userId },
    });

    if (!repo) {
      return NextResponse.json({ error: "Repo not found" }, { status: 404 });
    }

    return NextResponse.json({ repo });
  } catch (error) {
    console.error("Error fetching repo:", error);
    return NextResponse.json({ error: "Failed to fetch repo" }, { status: 500 });
  }
}

// PUT /api/repos/[id] - update repo notes
export async function PUT(
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
    const { notes } = body;

    // Verify ownership before updating
    const existing = await prisma.trackedRepo.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Repo not found" }, { status: 404 });
    }

    const repo = await prisma.trackedRepo.update({
      where: { id },
      data: { notes: notes ?? null },
    });

    return NextResponse.json({ repo });
  } catch (error) {
    console.error("Error updating repo notes:", error);
    return NextResponse.json({ error: "Failed to update notes" }, { status: 500 });
  }
}

// DELETE /api/repos/[id] - remove a tracked repo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const repo = await prisma.trackedRepo.findFirst({
      where: { id, userId },
    });

    if (!repo) {
      return NextResponse.json({ error: "Repo not found" }, { status: 404 });
    }

    await prisma.trackedRepo.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting repo:", error);
    return NextResponse.json(
      { error: "Failed to delete repo" },
      { status: 500 }
    );
  }
}
