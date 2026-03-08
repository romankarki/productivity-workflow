"use client";

import { useMemo } from "react";

export function YearProgress() {
  const { percentElapsed, daysElapsed, daysRemaining, totalDays } =
    useMemo(() => {
      const now = new Date();
      const year = now.getFullYear();
      const start = new Date(year, 0, 1);
      const end = new Date(year + 1, 0, 1);
      const total = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      const elapsed = Math.ceil(
        (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      const remaining = total - elapsed;
      const percent = Math.min(
        100,
        Math.max(0, parseFloat(((elapsed / total) * 100).toFixed(1)))
      );

      return {
        percentElapsed: percent,
        daysElapsed: elapsed,
        daysRemaining: remaining,
        totalDays: total,
      };
    }, []);

  return (
    <div className="rounded-xl border border-border/40 bg-card/50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {new Date().getFullYear()} Progress
        </p>
        <span className="text-sm font-medium text-muted-foreground">
          {daysRemaining} days left
        </span>
      </div>

      <div className="mt-3 flex items-end gap-3">
        <span className="text-4xl font-bold tabular-nums tracking-tight">
          {percentElapsed}%
        </span>
        <span className="mb-1 text-sm text-muted-foreground">
          of the year is gone
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted/50">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-in-out"
          style={{ width: `${percentElapsed}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>
          Day {daysElapsed} of {totalDays}
        </span>
        <span>
          {(100 - percentElapsed).toFixed(1)}% remaining
        </span>
      </div>
    </div>
  );
}
