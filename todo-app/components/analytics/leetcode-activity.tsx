"use client";

import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeetCodeActivityProps {
  submissionCalendar: Record<string, number>;
  streak: number;
  totalActiveDays: number;
}

const LEVEL_COLORS = [
  "bg-zinc-800/60",
  "bg-amber-900/50",
  "bg-amber-700/50",
  "bg-amber-500/60",
  "bg-amber-400/80",
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface DayEntry {
  date: string;
  count: number;
  level: number;
}

export function LeetCodeActivity({
  submissionCalendar,
  streak,
  totalActiveDays,
}: LeetCodeActivityProps) {
  const { weeks, monthLabels, totalSubmissions } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);

    // Build day entries for the entire year up to today
    const days: DayEntry[] = [];
    const current = new Date(startOfYear);

    // Find max submissions in a day for level calculation
    const counts = Object.values(submissionCalendar);
    const maxCount = counts.length > 0 ? Math.max(...counts) : 1;

    // Sum all submissions from the calendar directly (handles any timestamp format)
    let total = 0;
    for (const [ts, count] of Object.entries(submissionCalendar)) {
      const d = new Date(Number(ts) * 1000);
      if (d.getUTCFullYear() === year) {
        total += count;
      }
    }

    // Build a lookup by YYYY-MM-DD using UTC dates from the calendar
    const calendarByDate: Record<string, number> = {};
    for (const [ts, count] of Object.entries(submissionCalendar)) {
      const d = new Date(Number(ts) * 1000);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
      calendarByDate[key] = (calendarByDate[key] || 0) + count;
    }

    while (current <= now) {
      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;

      const count = calendarByDate[dateStr] || 0;

      let level = 0;
      if (count > 0 && maxCount > 0) {
        const ratio = count / maxCount;
        if (ratio <= 0.25) level = 1;
        else if (ratio <= 0.5) level = 2;
        else if (ratio <= 0.75) level = 3;
        else level = 4;
      }

      days.push({
        date: dateStr,
        count,
        level,
      });

      current.setDate(current.getDate() + 1);
    }

    // Group into weeks
    const weekGroups: DayEntry[][] = [];
    let currentWeek: DayEntry[] = [];

    for (const day of days) {
      const dow = new Date(day.date).getDay();
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
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        labels.push({ label: MONTHS[month], col: i });
        lastMonth = month;
      }
    }

    return {
      weeks: weekGroups,
      monthLabels: labels,
      totalSubmissions: total,
    };
  }, [submissionCalendar]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">{totalSubmissions}</span>{" "}
          submissions this year
        </span>
        <span>
          <span className="font-medium text-foreground">{totalActiveDays}</span>{" "}
          active days
        </span>
        {streak > 0 && (
          <span>
            <span className="font-medium text-foreground">{streak}</span> day
            streak
          </span>
        )}
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
                        (d) => new Date(d.date).getDay() === di
                      );
                      if (!day) {
                        return <div key={di} className="h-[11px] w-[11px]" />;
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
                              {day.count} submission{day.count !== 1 ? "s" : ""}
                            </p>
                            <p className="text-muted-foreground">
                              {new Date(day.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
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
