import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Types for the unified activity feed
interface ActivityItem {
  id: string;
  type: "commit" | "pr" | "issue";
  repo: string;
  title: string;
  url: string;
  author: string;
  avatarUrl: string;
  createdAt: string;
}

// Fetch recent commits for a repo (last 24h)
async function fetchCommits(
  owner: string,
  name: string,
  since: string
): Promise<ActivityItem[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${name}/commits?per_page=5&since=${since}`,
      { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 300 } }
    );
    if (!res.ok) return [];

    const data = await res.json();
    return data.map((c: Record<string, unknown>) => ({
      id: `commit-${(c.sha as string).slice(0, 7)}`,
      type: "commit" as const,
      repo: `${owner}/${name}`,
      title: ((c.commit as Record<string, unknown>)?.message as string)?.split("\n")[0] ?? "",
      url: c.html_url as string,
      author: (c.author as Record<string, unknown>)?.login as string ?? "unknown",
      avatarUrl: (c.author as Record<string, unknown>)?.avatar_url as string ?? "",
      createdAt: ((c.commit as Record<string, unknown>)?.author as Record<string, unknown>)?.date as string ?? "",
    }));
  } catch {
    return [];
  }
}

// Fetch recent pull requests
async function fetchPRs(
  owner: string,
  name: string,
  since: string
): Promise<ActivityItem[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${name}/pulls?state=all&sort=created&direction=desc&per_page=5`,
      { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 300 } }
    );
    if (!res.ok) return [];

    const data = await res.json();
    return data
      .filter((pr: Record<string, unknown>) => pr.created_at as string >= since)
      .map((pr: Record<string, unknown>) => ({
        id: `pr-${owner}/${name}-${pr.number}`,
        type: "pr" as const,
        repo: `${owner}/${name}`,
        title: pr.title as string,
        url: pr.html_url as string,
        author: (pr.user as Record<string, unknown>)?.login as string ?? "unknown",
        avatarUrl: (pr.user as Record<string, unknown>)?.avatar_url as string ?? "",
        createdAt: pr.created_at as string,
      }));
  } catch {
    return [];
  }
}

// Fetch recent issues (excludes PRs which GitHub also returns as issues)
async function fetchIssues(
  owner: string,
  name: string,
  since: string
): Promise<ActivityItem[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${name}/issues?state=all&sort=created&direction=desc&per_page=5&since=${since}`,
      { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 300 } }
    );
    if (!res.ok) return [];

    const data = await res.json();
    return data
      .filter((issue: Record<string, unknown>) => !issue.pull_request) // exclude PRs
      .map((issue: Record<string, unknown>) => ({
        id: `issue-${owner}/${name}-${issue.number}`,
        type: "issue" as const,
        repo: `${owner}/${name}`,
        title: issue.title as string,
        url: issue.html_url as string,
        author: (issue.user as Record<string, unknown>)?.login as string ?? "unknown",
        avatarUrl: (issue.user as Record<string, unknown>)?.avatar_url as string ?? "",
        createdAt: issue.created_at as string,
      }));
  } catch {
    return [];
  }
}

// GET /api/repos/activity - aggregated activity feed across all tracked repos
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repos = await prisma.trackedRepo.findMany({ where: { userId } });

    if (repos.length === 0) {
      return NextResponse.json({ activity: [] });
    }

    // Look back 24 hours by default
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Fetch all activity in parallel
    const results = await Promise.all(
      repos.flatMap((repo) => [
        fetchCommits(repo.owner, repo.name, since),
        fetchPRs(repo.owner, repo.name, since),
        fetchIssues(repo.owner, repo.name, since),
      ])
    );

    // Flatten & sort by date (newest first)
    const activity = results
      .flat()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
