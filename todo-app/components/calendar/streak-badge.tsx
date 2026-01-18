"use client";

import { Flame, Trophy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  if (currentStreak === 0) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 text-muted-foreground">
        <Flame className="h-4 w-4" />
        <span className="text-sm font-medium">No streak</span>
      </div>
    );
  }

  const isOnFire = currentStreak >= 7;
  const isRecord = currentStreak === longestStreak && currentStreak > 1;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
              isOnFire
                ? "bg-gradient-to-r from-orange-500/20 to-rose-500/20 shadow-lg shadow-orange-500/10"
                : "bg-gradient-to-r from-orange-500/10 to-rose-500/10"
            }`}
          >
            <Flame
              className={`h-4 w-4 ${
                isOnFire ? "text-orange-500 animate-pulse" : "text-orange-500"
              }`}
            />
            <span className="text-sm font-semibold">
              {currentStreak} day{currentStreak !== 1 ? "s" : ""}
            </span>
            {isRecord && <Trophy className="h-3.5 w-3.5 text-yellow-500" />}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-medium">Current Streak: {currentStreak} days</p>
            <p className="text-xs text-muted-foreground">
              Longest: {longestStreak} days
            </p>
            {isOnFire && (
              <p className="mt-1 text-xs text-orange-500">🔥 You&apos;re on fire!</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
