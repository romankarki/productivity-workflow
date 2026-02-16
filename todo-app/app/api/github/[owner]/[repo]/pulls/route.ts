import { NextRequest, NextResponse } from "next/server";

const GH_HEADERS = { Accept: "application/vnd.github+json" };

// GET /api/github/[owner]/[repo]/pulls - list open pull requests
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;
    const page = request.nextUrl.searchParams.get("page") || "1";

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&sort=created&direction=desc&per_page=20&page=${page}`,
      { headers: GH_HEADERS, next: { revalidate: 120 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch pull requests from GitHub" },
        { status: res.status }
      );
    }

    const raw = await res.json();

    const pulls = raw.map((pr: Record<string, unknown>) => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      draft: pr.draft ?? false,
      author: (pr.user as Record<string, unknown>)?.login ?? "unknown",
      avatarUrl: (pr.user as Record<string, unknown>)?.avatar_url ?? "",
      labels: (pr.labels as Array<Record<string, unknown>>)?.map((l) => ({
        name: l.name,
        color: l.color,
      })) ?? [],
      comments: (pr.comments as number) + ((pr.review_comments as number) ?? 0),
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      url: pr.html_url,
    }));

    return NextResponse.json({ pulls });
  } catch (error) {
    console.error("Error proxying pulls:", error);
    return NextResponse.json({ error: "Failed to fetch pull requests" }, { status: 500 });
  }
}
