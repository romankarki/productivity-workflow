import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/labels - Get all labels for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const labels = await prisma.label.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ labels });
  } catch (error) {
    console.error("Error fetching labels:", error);
    return NextResponse.json(
      { error: "Failed to fetch labels" },
      { status: 500 }
    );
  }
}

// POST /api/labels - Create new label
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, color } = body;

    if (!name || !color) {
      return NextResponse.json(
        { error: "Name and color are required" },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const existing = await prisma.label.findFirst({
      where: { userId, name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Label with this name already exists" },
        { status: 409 }
      );
    }

    const label = await prisma.label.create({
      data: {
        userId,
        name,
        color,
      },
    });

    return NextResponse.json({ label }, { status: 201 });
  } catch (error) {
    console.error("Error creating label:", error);
    return NextResponse.json(
      { error: "Failed to create label" },
      { status: 500 }
    );
  }
}
