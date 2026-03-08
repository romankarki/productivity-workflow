"use client";

import { useMemo } from "react";
import { GitHubContribution } from "@/lib/hooks/use-github";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GitHubContributionsProps {
  contributions: GitHubContribution[];
}

const LEVEL_COLORS = [
  "bg-zinc-800/60",
  "bg-emerald-900/60",
  "bg-emerald-700/60",
  "bg-emerald-500/60",
  "bg-emerald-400/80",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Parse "YYYY-MM-DD" without timezone shift
function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function GitHubContributionsGraph({
  contributions,
}: GitHubContributionsProps) {
  const { weeks, monthLabels, totalContributions } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const today = `${year}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // Filter to current year, up to today only
    const sorted = [...contributions]
      .filter((c) => c.date >= `${year}-01-01` && c.date <= today)
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

    // Sum displayed contributions to match grid exactly
    let gridTotal = 0;
    for (const day of sorted) {
      gridTotal += day.count;
    }

    // Group into weeks (columns)
    const weekGroups: GitHubContribution[][] = [];
    let currentWeek: GitHubContribution[] = [];

    for (const day of sorted) {
      const dow = parseDate(day.date).getDay();
      if (dow === 0 && currentWeek.length > 0) {
        weekGroups.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    }
    if (currentWeek.length > 0) {
      weekGroups.push(currentWeek);
    }

    // Month labels
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    for (let i = 0; i < weekGroups.length; i++) {
      const firstDay = weekGroups[i][0];
      const month = parseDate(firstDay.date).getMonth();
      if (month !== lastMonth) {
        labels.push({ label: MONTHS[month], col: i });
        lastMonth = month;
      }
    }

    return {
      weeks: weekGroups,
      monthLabels: labels,
      totalContributions: gridTotal,
    };
  }, [contributions]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {totalContributions.toLocaleString()}
          </span>{" "}
          contributions in {new Date().getFullYear()}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          {/* Month labels */}
          <div className="mb-1 flex text-[10px] text-muted-foreground">
            <div className="w-7" />
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="absolute"
                style={{ marginLeft: `${m.col * 13 + 28}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="mt-4 flex gap-[2px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[2px] pr-1 text-[10px] text-muted-foreground">
              <div className="h-[11px]" />
              <div className="h-[11px] leading-[11px]">Mon</div>
              <div className="h-[11px]" />
              <div className="h-[11px] leading-[11px]">Wed</div>
              <div className="h-[11px]" />
              <div className="h-[11px] leading-[11px]">Fri</div>
              <div className="h-[11px]" />
            </div>

            {/* Grid */}
            <TooltipProvider delayDuration={100}>
              <div className="flex gap-[2px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[2px]">
                    {Array.from({ length: 7 }).map((_, di) => {
                      const day = week.find(
                        (d) => parseDate(d.date).getDay() === di
                      );
                      if (!day) {
                        return (
                          <div key={di} className="h-[11px] w-[11px]" />
                        );
                      }
                      return (
                        <Tooltip key={di}>
                          <TooltipTrigger asChild>
                            <div
                              className={`h-[11px] w-[11px] rounded-[2px] ${LEVEL_COLORS[day.level]} transition-colors duration-200 hover:ring-1 hover:ring-foreground/30`}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            <p className="font-medium">
                              {day.count} contribution
                              {day.count !== 1 ? "s" : ""}
                            </p>
                            <p className="text-muted-foreground">
                              {parseDate(day.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* Legend */}
          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
            <span>Less</span>
            {LEVEL_COLORS.map((color, i) => (
              <div
                key={i}
                className={`h-[11px] w-[11px] rounded-[2px] ${color}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
