import { NextRequest, NextResponse } from "next/server";

const GH_HTML_HEADERS = { Accept: "application/vnd.github.html+json" };
const GH_HEADERS = { Accept: "application/vnd.github+json" };

// GET /api/github/[owner]/[repo]/pulls/[number] - PR detail + comments + files
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string; number: string }> }
) {
  try {
    const { owner, repo, number } = await params;
    const base = `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`;

    // Fetch PR body, review comments, and changed files in parallel
    const [prRes, commentsRes, filesRes] = await Promise.all([
      fetch(base, { headers: GH_HTML_HEADERS, next: { revalidate: 120 } }),
      fetch(`${base}/comments?per_page=50`, {
        headers: GH_HTML_HEADERS,
        next: { revalidate: 120 },
      }),
      fetch(`${base}/files?per_page=30`, {
        headers: GH_HEADERS,
        next: { revalidate: 120 },
      }),
    ]);

    if (!prRes.ok) {
      return NextResponse.json({ error: "PR not found" }, { status: prRes.status });
    }

    const pr = await prRes.json();
    const rawComments = commentsRes.ok ? await commentsRes.json() : [];
    const rawFiles = filesRes.ok ? await filesRes.json() : [];

    const comments = rawComments.map((c: Record<string, unknown>) => ({
      id: c.id,
      author: (c.user as Record<string, unknown>)?.login ?? "unknown",
      avatarUrl: (c.user as Record<string, unknown>)?.avatar_url ?? "",
      bodyHtml: c.body_html ?? c.body ?? "",
      path: c.path ?? null,
      line: c.line ?? c.original_line ?? null,
      createdAt: c.created_at,
    }));

    const files = rawFiles.map((f: Record<string, unknown>) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
      patch: f.patch ?? null,
    }));

    return NextResponse.json({
      pr: {
        number: pr.number,
        title: pr.title,
        state: pr.state,
        draft: pr.draft ?? false,
        merged: pr.merged ?? false,
        author: pr.user?.login ?? "unknown",
        avatarUrl: pr.user?.avatar_url ?? "",
        bodyHtml: pr.body_html ?? pr.body ?? "",
        labels: pr.labels?.map((l: Record<string, unknown>) => ({
          name: l.name,
          color: l.color,
        })) ?? [],
        additions: pr.additions,
        deletions: pr.deletions,
        changedFiles: pr.changed_files,
        createdAt: pr.created_at,
        url: pr.html_url,
      },
      comments,
      files,
    });
  } catch (error) {
    console.error("Error proxying PR detail:", error);
    return NextResponse.json({ error: "Failed to fetch PR" }, { status: 500 });
  }
}
