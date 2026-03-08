import { NextRequest, NextResponse } from "next/server";

// GET /api/leetcode?username=xxx — fetch public LeetCode profile stats
export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();

    const query = `
      query getUserProfile($username: String!, $year: Int!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          userCalendar(year: $year) {
            activeYears
            streak
            totalActiveDays
            submissionCalendar
          }
        }
        userContestRanking(username: $username) {
          rating
          globalRanking
          attendedContestsCount
          topPercentage
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { username, year },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch LeetCode data" },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (result.errors || !result.data?.matchedUser) {
      return NextResponse.json(
        { error: "LeetCode user not found" },
        { status: 404 }
      );
    }

    const user = result.data.matchedUser;
    const contestRanking = result.data.userContestRanking;

    const submissions = user.submitStatsGlobal?.acSubmissionNum || [];
    const totalSolved =
      submissions.find(
        (s: { difficulty: string; count: number }) => s.difficulty === "All"
      )?.count || 0;
    const easySolved =
      submissions.find(
        (s: { difficulty: string; count: number }) => s.difficulty === "Easy"
      )?.count || 0;
    const mediumSolved =
      submissions.find(
        (s: { difficulty: string; count: number }) => s.difficulty === "Medium"
      )?.count || 0;
    const hardSolved =
      submissions.find(
        (s: { difficulty: string; count: number }) => s.difficulty === "Hard"
      )?.count || 0;

    // Parse submission calendar: { "unix_timestamp": count, ... }
    const calendar = user.userCalendar;
    let submissionCalendar: Record<string, number> = {};
    if (calendar?.submissionCalendar) {
      try {
        submissionCalendar = JSON.parse(calendar.submissionCalendar);
      } catch {
        // ignore parse errors
      }
    }

    return NextResponse.json({
      data: {
        username: user.username,
        ranking: user.profile?.ranking || null,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        contestRating: contestRanking?.rating
          ? Math.round(contestRanking.rating)
          : null,
        contestGlobalRanking: contestRanking?.globalRanking || null,
        contestsAttended: contestRanking?.attendedContestsCount || 0,
        topPercentage: contestRanking?.topPercentage
          ? parseFloat(contestRanking.topPercentage.toFixed(1))
          : null,
        streak: calendar?.streak || 0,
        totalActiveDays: calendar?.totalActiveDays || 0,
        submissionCalendar,
      },
    });
  } catch (error) {
    console.error("Error fetching LeetCode data:", error);
    return NextResponse.json(
      { error: "Failed to fetch LeetCode data" },
      { status: 500 }
    );
  }
}
