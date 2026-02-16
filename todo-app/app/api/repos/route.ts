import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/repos - list all tracked repos for the user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repos = await prisma.trackedRepo.findMany({
      where: { userId },
      orderBy: { addedAt: "desc" },
    });

    return NextResponse.json({ repos });
  } catch (error) {
    console.error("Error fetching repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch repos" },
      { status: 500 }
    );
  }
}

// POST /api/repos - add a new tracked repo
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { owner, name } = body;

    if (!owner || !name) {
      return NextResponse.json(
        { error: "owner and name are required" },
        { status: 400 }
      );
    }

    // Validate repo exists on GitHub before saving
    const ghRes = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!ghRes.ok) {
      return NextResponse.json(
        { error: "Repository not found on GitHub" },
        { status: 404 }
      );
    }

    const repo = await prisma.trackedRepo.create({
      data: { userId, owner: owner.trim(), name: name.trim() },
    });

    return NextResponse.json({ repo }, { status: 201 });
  } catch (error: unknown) {
    // Handle duplicate entry gracefully
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "You are already tracking this repo" },
        { status: 409 }
      );
    }

    console.error("Error adding repo:", error);
    return NextResponse.json(
      { error: "Failed to add repo" },
      { status: 500 }
    );
  }
}
