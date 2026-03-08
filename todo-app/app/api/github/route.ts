import { NextRequest, NextResponse } from "next/server";

// GET /api/github?username=xxx — fetch public GitHub contribution data
export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Use GitHub's GraphQL API (public, no auth needed for contribution data via the REST workaround)
    // Fetch the contributions page HTML and parse, or use the GitHub contributions API
    const year = new Date().getFullYear();
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${year}`,
      { next: { revalidate: 600 } }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch GitHub data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
