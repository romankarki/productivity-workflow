"use client";

import { LeetCodeData } from "@/lib/hooks/use-leetcode";

interface LeetCodeStatsProps {
  data: LeetCodeData;
}

const DIFFICULTY_COLORS = {
  easy: "text-emerald-400",
  medium: "text-amber-400",
  hard: "text-red-400",
};

const DIFFICULTY_BG = {
  easy: "bg-emerald-400/20",
  medium: "bg-amber-400/20",
  hard: "bg-red-400/20",
};

export function LeetCodeStats({ data }: LeetCodeStatsProps) {
  return (
    <div className="space-y-4">
      {/* Problem Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg border border-border/40 bg-card/50 p-3 text-center">
          <p className="text-2xl font-bold">{data.totalSolved}</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Solved
          </p>
        </div>
        <div className="rounded-lg border border-border/40 bg-card/50 p-3 text-center">
          <p className={`text-2xl font-bold ${DIFFICULTY_COLORS.easy}`}>
            {data.easySolved}
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Easy
          </p>
        </div>
        <div className="rounded-lg border border-border/40 bg-card/50 p-3 text-center">
          <p className={`text-2xl font-bold ${DIFFICULTY_COLORS.medium}`}>
            {data.mediumSolved}
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Medium
          </p>
        </div>
        <div className="rounded-lg border border-border/40 bg-card/50 p-3 text-center">
          <p className={`text-2xl font-bold ${DIFFICULTY_COLORS.hard}`}>
            {data.hardSolved}
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Hard
          </p>
        </div>
      </div>

      {/* Difficulty Breakdown Bars */}
      <div className="space-y-2">
        {(["easy", "medium", "hard"] as const).map((diff) => {
          const count = data[`${diff}Solved` as keyof LeetCodeData] as number;
          const maxWidth = data.totalSolved > 0 ? (count / data.totalSolved) * 100 : 0;
          return (
            <div key={diff} className="flex items-center gap-3">
              <span
                className={`w-16 text-xs font-medium capitalize ${DIFFICULTY_COLORS[diff]}`}
              >
                {diff}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/50">
                <div
                  className={`h-full rounded-full ${DIFFICULTY_BG[diff]} transition-all duration-700`}
                  style={{ width: `${maxWidth}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs text-muted-foreground">
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Contest Info */}
      {data.contestRating && (
        <div className="grid grid-cols-3 gap-3 border-t border-border/40 pt-4">
          <div className="text-center">
            <p className="text-xl font-bold">{data.contestRating}</p>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Rating
            </p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{data.contestsAttended}</p>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Contests
            </p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">
              {data.topPercentage != null ? `${data.topPercentage}%` : "-"}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Top %
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
