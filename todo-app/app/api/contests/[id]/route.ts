import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contest = await prisma.contest.findFirst({
      where: { id, userId },
    });

    if (!contest) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    return NextResponse.json({ contest });
  } catch (error) {
    console.error("Error fetching contest:", error);
    return NextResponse.json(
      { error: "Failed to fetch contest" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      contestName,
      date,
      rank,
      score,
      ratingBefore,
      ratingAfter,
      problemsSolved,
      totalProblems,
      finishTime,
      notes,
    } = body;

    const existing = await prisma.contest.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    const contest = await prisma.contest.update({
      where: { id },
      data: {
        ...(contestName !== undefined && { contestName }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(rank !== undefined && { rank }),
        ...(score !== undefined && { score }),
        ...(ratingBefore !== undefined && { ratingBefore }),
        ...(ratingAfter !== undefined && { ratingAfter }),
        ...(problemsSolved !== undefined && { problemsSolved }),
        ...(totalProblems !== undefined && { totalProblems }),
        ...(finishTime !== undefined && { finishTime }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({ contest });
  } catch (error) {
    console.error("Error updating contest:", error);
    return NextResponse.json(
      { error: "Failed to update contest" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contest = await prisma.contest.findFirst({
      where: { id, userId },
    });

    if (!contest) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    await prisma.contest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting contest:", error);
    return NextResponse.json(
      { error: "Failed to delete contest" },
      { status: 500 }
    );
  }
}
