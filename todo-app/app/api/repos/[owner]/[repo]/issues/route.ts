import { NextRequest, NextResponse } from "next/server";

// GitHub API headers for public access
const GH_HEADERS = { Accept: "application/vnd.github+json" };

// GET /api/repos/[owner]/[repo]/issues - list open issues
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;
    const page = request.nextUrl.searchParams.get("page") || "1";

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=open&sort=created&direction=desc&per_page=20&page=${page}`,
      { headers: GH_HEADERS, next: { revalidate: 120 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch issues from GitHub" },
        { status: res.status }
      );
    }

    const raw = await res.json();

    // Filter out pull requests (GitHub returns PRs in the issues endpoint)
    const issues = raw
      .filter((item: Record<string, unknown>) => !item.pull_request)
      .map((item: Record<string, unknown>) => ({
        number: item.number,
        title: item.title,
        state: item.state,
        author: (item.user as Record<string, unknown>)?.login ?? "unknown",
        avatarUrl: (item.user as Record<string, unknown>)?.avatar_url ?? "",
        labels: (item.labels as Array<Record<string, unknown>>)?.map((l) => ({
          name: l.name,
          color: l.color,
        })) ?? [],
        comments: item.comments,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        url: item.html_url,
      }));

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("Error proxying issues:", error);
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}
