import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contests = await prisma.contest.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ contests });
  } catch (error) {
    console.error("Error fetching contests:", error);
    return NextResponse.json(
      { error: "Failed to fetch contests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

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

    if (!contestName || !date) {
      return NextResponse.json(
        { error: "Contest name and date are required" },
        { status: 400 }
      );
    }

    const contest = await prisma.contest.create({
      data: {
        userId,
        contestName,
        date: new Date(date),
        rank: rank ?? null,
        score: score ?? null,
        ratingBefore: ratingBefore ?? null,
        ratingAfter: ratingAfter ?? null,
        problemsSolved: problemsSolved ?? null,
        totalProblems: totalProblems ?? null,
        finishTime: finishTime ?? null,
        notes: notes ?? null,
      },
    });

    return NextResponse.json({ contest }, { status: 201 });
  } catch (error) {
    console.error("Error creating contest:", error);
    return NextResponse.json(
      { error: "Failed to create contest" },
      { status: 500 }
    );
  }
}
