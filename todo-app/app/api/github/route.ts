import { NextRequest, NextResponse } from "next/server";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

// Scrape contribution data directly from GitHub's contributions page
async function scrapeGitHubContributions(
  username: string
): Promise<{ contributions: ContributionDay[]; total: number } | null> {
  const year = new Date().getFullYear();
  const url = `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${year}-01-01&to=${year}-12-31`;

  const response = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent": "Mozilla/5.0",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;

  const html = await response.text();

  // Parse contribution days from the HTML
  // GitHub renders tool-tip elements with dates and counts like:
  // <tool-tip ...>N contributions? on Month Day</tool-tip>
  // The td elements have data-date and data-level attributes
  const contributions: ContributionDay[] = [];

  // Match td elements with data-date and data-level
  const cellRegex =
    /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"[^>]*>/g;
  let cellMatch;
  const dateLevelMap = new Map<string, number>();

  while ((cellMatch = cellRegex.exec(html)) !== null) {
    dateLevelMap.set(cellMatch[1], parseInt(cellMatch[2], 10));
  }

  // Match tooltip text for counts: "N contribution(s) on Month Day(st|nd|rd|th)"
  // or "No contributions on Month Day"
  const tooltipRegex =
    /(?:(\d+)\s+contributions?|No contributions)\s+on\s+\w+\s+(\d+)(?:st|nd|rd|th)/g;

  // Better approach: match each date's count from the tooltip elements
  // Format: <tool-tip ...>5 contributions on January 3rd</tool-tip>
  // or: <tool-tip ...>No contributions on January 4th</tool-tip>
  const dayCountRegex =
    /(?:(\d+)\s+contributions?|No contributions)\s+on\s+(\w+)\s+(\d+)(?:st|nd|rd|th)?(?:,\s*(\d{4}))?/g;

  const monthMap: Record<string, string> = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  const dateCountMap = new Map<string, number>();
  let dayMatch;

  while ((dayMatch = dayCountRegex.exec(html)) !== null) {
    const count = dayMatch[1] ? parseInt(dayMatch[1], 10) : 0;
    const month = monthMap[dayMatch[2]];
    const day = dayMatch[3].padStart(2, "0");
    const matchYear = dayMatch[4] || year.toString();

    if (month) {
      const dateStr = `${matchYear}-${month}-${day}`;
      dateCountMap.set(dateStr, count);
    }
  }

  // Build contribution list from all dates found
  let total = 0;
  const allDates = new Set([...dateLevelMap.keys(), ...dateCountMap.keys()]);

  for (const date of Array.from(allDates).sort()) {
    const count = dateCountMap.get(date) ?? 0;
    const level = dateLevelMap.get(date) ?? 0;
    total += count;
    contributions.push({ date, count, level });
  }

  return { contributions, total };
}

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

    const result = await scrapeGitHubContributions(username);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to fetch GitHub data" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        contributions: result.contributions,
        total: { [new Date().getFullYear().toString()]: result.total },
      },
    });
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
