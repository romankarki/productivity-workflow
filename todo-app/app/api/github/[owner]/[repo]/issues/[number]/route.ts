import { NextRequest, NextResponse } from "next/server";

const GH_HEADERS = {
  Accept: "application/vnd.github.html+json",
};

// GET /api/github/[owner]/[repo]/issues/[number] - issue detail + comments
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string; number: string }> }
) {
  try {
    const { owner, repo, number } = await params;

    // Fetch issue body and comments in parallel
    const [issueRes, commentsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${number}`, {
        headers: GH_HEADERS,
        next: { revalidate: 120 },
      }),
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues/${number}/comments?per_page=50`,
        { headers: GH_HEADERS, next: { revalidate: 120 } }
      ),
    ]);

    if (!issueRes.ok) {
      return NextResponse.json({ error: "Issue not found" }, { status: issueRes.status });
    }

    const issue = await issueRes.json();
    const rawComments = commentsRes.ok ? await commentsRes.json() : [];

    const comments = rawComments.map((c: Record<string, unknown>) => ({
      id: c.id,
      author: (c.user as Record<string, unknown>)?.login ?? "unknown",
      avatarUrl: (c.user as Record<string, unknown>)?.avatar_url ?? "",
      bodyHtml: c.body_html ?? c.body ?? "",
      createdAt: c.created_at,
    }));

    return NextResponse.json({
      issue: {
        number: issue.number,
        title: issue.title,
        state: issue.state,
        author: issue.user?.login ?? "unknown",
        avatarUrl: issue.user?.avatar_url ?? "",
        bodyHtml: issue.body_html ?? issue.body ?? "",
        labels: issue.labels?.map((l: Record<string, unknown>) => ({
          name: l.name,
          color: l.color,
        })) ?? [],
        comments: issue.comments,
        createdAt: issue.created_at,
        url: issue.html_url,
      },
      comments,
    });
  } catch (error) {
    console.error("Error proxying issue detail:", error);
    return NextResponse.json({ error: "Failed to fetch issue" }, { status: 500 });
  }
}
