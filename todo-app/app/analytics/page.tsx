"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import { StatsGrid } from "@/components/analytics/stats-grid";
import { YearProgress } from "@/components/dashboard/year-progress";
import {
  AnalyticsChartSkeleton,
  AnalyticsPieSkeleton,
  AnalyticsInsightsSkeleton,
} from "@/components/analytics/analytics-skeleton";
import { DateRangeOption } from "@/lib/types/analytics";
import { useAnalytics } from "@/lib/hooks/use-analytics";
import { useUser } from "@/lib/hooks/use-user";
import { useGitHubContributions } from "@/lib/hooks/use-github";
import { useLeetCodeStats } from "@/lib/hooks/use-leetcode";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";

const WeeklyChart = dynamic(
  () =>
    import("@/components/analytics/weekly-chart").then((mod) => ({
      default: mod.WeeklyChart,
    })),
  { loading: () => <AnalyticsChartSkeleton />, ssr: false }
);

const LabelPieChart = dynamic(
  () =>
    import("@/components/analytics/label-pie-chart").then((mod) => ({
      default: mod.LabelPieChart,
    })),
  { loading: () => <AnalyticsPieSkeleton />, ssr: false }
);

const LabelInsights = dynamic(
  () =>
    import("@/components/analytics/label-insights").then((mod) => ({
      default: mod.LabelInsights,
    })),
  { loading: () => <AnalyticsInsightsSkeleton />, ssr: false }
);

const GitHubContributionsGraph = dynamic(
  () =>
    import("@/components/analytics/github-contributions").then((mod) => ({
      default: mod.GitHubContributionsGraph,
    })),
  {
    loading: () => <Skeleton className="h-[150px] w-full rounded-lg" />,
    ssr: false,
  }
);

const LeetCodeStats = dynamic(
  () =>
    import("@/components/analytics/leetcode-stats").then((mod) => ({
      default: mod.LeetCodeStats,
    })),
  {
    loading: () => <Skeleton className="h-[200px] w-full rounded-lg" />,
    ssr: false,
  }
);

function IntegrationPlaceholder({ service }: { service: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-sm text-muted-foreground">
        Set your {service} username in{" "}
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <Settings className="h-3.5 w-3.5" />
          Settings
        </Link>{" "}
        to see your stats here.
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRangeOption>("this-week");
  const [mounted, setMounted] = useState(false);
  const { timeData, labelData, isLoading, isWeekly } =
    useAnalytics(dateRange);
  const { data: user, isLoading: userLoading } = useUser();

  const { data: githubData, isLoading: githubLoading } =
    useGitHubContributions(user?.githubUsername);
  const { data: leetcodeData, isLoading: leetcodeLoading } =
    useLeetCodeStats(user?.leetcodeUsername);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || userLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div>
                  <Skeleton className="mb-1 h-7 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-10 w-[160px]" />
            </div>
            <div className="grid gap-6">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-[180px] w-full rounded-xl" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl text-center py-12">
            <p className="text-muted-foreground">
              Please create an account first
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <AnalyticsHeader
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          <div className="grid gap-6 animate-in fade-in-50 duration-500">
            {/* Year Progress */}
            <YearProgress />

            {/* GitHub Contributions */}
            <div className="rounded-xl border border-border/40 bg-card/50 p-4 transition-all duration-300 hover:border-border/60">
              <h2 className="mb-4 text-lg font-semibold">
                GitHub Contributions
              </h2>
              {!user.githubUsername ? (
                <IntegrationPlaceholder service="GitHub" />
              ) : githubLoading ? (
                <Skeleton className="h-[150px] w-full rounded-lg" />
              ) : githubData?.contributions ? (
                <GitHubContributionsGraph
                  contributions={githubData.contributions}
                  total={githubData.total}
                />
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Could not load GitHub data. Check your username in Settings.
                </p>
              )}
            </div>

            {/* LeetCode Stats */}
            <div className="rounded-xl border border-border/40 bg-card/50 p-4 transition-all duration-300 hover:border-border/60">
              <h2 className="mb-4 text-lg font-semibold">LeetCode Progress</h2>
              {!user.leetcodeUsername ? (
                <IntegrationPlaceholder service="LeetCode" />
              ) : leetcodeLoading ? (
                <Skeleton className="h-[200px] w-full rounded-lg" />
              ) : leetcodeData ? (
                <LeetCodeStats data={leetcodeData} />
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Could not load LeetCode data. Check your username in Settings.
                </p>
              )}
            </div>

            {/* Task Completion Stats */}
            <StatsGrid data={timeData} isLoading={isLoading} />

            {/* Time Chart + Label Breakdown */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-border/40 bg-card/50 p-4 transition-all duration-300 hover:border-border/60">
                <h2 className="mb-4 text-lg font-semibold">
                  {isWeekly
                    ? "Time Tracked This Week"
                    : "Time Tracked This Month"}
                </h2>
                {isLoading ? (
                  <AnalyticsChartSkeleton />
                ) : timeData?.days ? (
                  <WeeklyChart days={timeData.days} isWeekly={isWeekly} />
                ) : null}
              </div>

              <div className="rounded-xl border border-border/40 bg-card/50 p-4 transition-all duration-300 hover:border-border/60">
                <h2 className="mb-4 text-lg font-semibold">Time by Label</h2>
                {isLoading ? (
                  <AnalyticsPieSkeleton />
                ) : (
                  <LabelPieChart data={labelData} />
                )}
              </div>
            </div>

            {/* Label Insights */}
            <div className="rounded-xl border border-border/40 bg-card/50 p-4 transition-all duration-300 hover:border-border/60">
              <h2 className="mb-4 text-lg font-semibold">Label Insights</h2>
              {isLoading ? (
                <AnalyticsInsightsSkeleton />
              ) : (
                <LabelInsights data={labelData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
