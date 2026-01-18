"use client";

import { cn } from "@/lib/utils";
import { isToday, isInMonth } from "@/lib/utils/date";
import { Check, Flame, X } from "lucide-react";
import { isBefore, startOfDay } from "date-fns";

interface TaskInfo {
  total: number;
  completed: number;
}

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  taskInfo?: TaskInfo;
  isStreakDay?: boolean;
  onClick: (date: Date) => void;
}

export function CalendarDay({
  date,
  currentMonth,
  taskInfo,
  isStreakDay = false,
  onClick,
}: CalendarDayProps) {
  const isCurrentMonth = isInMonth(date, currentMonth);
  const isTodayDate = isToday(date);
  const dayNumber = date.getDate();
  const isPast = isBefore(startOfDay(date), startOfDay(new Date())) && !isTodayDate;

  const hasTasks = taskInfo && taskInfo.total > 0;
  const allCompleted = taskInfo && taskInfo.total > 0 && taskInfo.completed === taskInfo.total;
  const hasPartial = taskInfo && taskInfo.completed > 0 && taskInfo.completed < taskInfo.total;
  const hasNoneCompleted = hasTasks && taskInfo.completed === 0;
  
  // Determine if this is a "missed" day (past day with incomplete tasks)
  const isMissedDay = isPast && hasTasks && !allCompleted;
  // Determine if this is a "success" day (past day with all tasks completed)
  const isSuccessDay = isPast && allCompleted;

  return (
    <button
      onClick={() => onClick(date)}
      className={cn(
        "group relative flex aspect-square flex-col items-center justify-center rounded-lg border border-transparent p-1 transition-all duration-200",
        "hover:border-border/60 hover:bg-muted/50",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        "active:scale-95 md:active:scale-100",
        !isCurrentMonth && "opacity-30",
        // Today styling
        isTodayDate && "border-primary/50 bg-primary/5",
        // Streak day styling (current streak)
        isStreakDay && "bg-gradient-to-br from-orange-500/15 to-rose-500/15 border-orange-500/30",
        // Success day (completed all tasks)
        isSuccessDay && !isStreakDay && "bg-emerald-500/10 border-emerald-500/20",
        // Missed day (had tasks but didn't complete all)
        isMissedDay && "bg-red-500/5 border-red-500/10"
      )}
    >
      {/* Day Number */}
      <span
        className={cn(
          "text-sm font-medium",
          isTodayDate && "text-primary",
          !isCurrentMonth && "text-muted-foreground",
          isStreakDay && "text-orange-500",
          isSuccessDay && !isStreakDay && "text-emerald-600",
          isMissedDay && "text-red-400"
        )}
      >
        {dayNumber}
      </span>

      {/* Status Indicator */}
      <div className="mt-1 flex h-4 items-center justify-center">
        {allCompleted ? (
          <div className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full",
            isStreakDay ? "bg-orange-500/20" : "bg-emerald-500/20"
          )}>
            {isStreakDay ? (
              <Flame className="h-2.5 w-2.5 text-orange-500" />
            ) : (
              <Check className="h-2.5 w-2.5 text-emerald-500" strokeWidth={3} />
            )}
          </div>
        ) : hasPartial ? (
          <div className="flex items-center gap-0.5">
            <span className={cn(
              "text-[10px]",
              isMissedDay ? "text-red-400" : "text-muted-foreground"
            )}>
              {taskInfo?.completed}/{taskInfo?.total}
            </span>
          </div>
        ) : hasNoneCompleted && isPast ? (
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20">
            <X className="h-2.5 w-2.5 text-red-400" strokeWidth={3} />
          </div>
        ) : hasTasks ? (
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
        ) : null}
      </div>

      {/* Streak Fire Badge */}
      {isStreakDay && (
        <div className="absolute -top-1 -right-1">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 shadow-sm">
            <Flame className="h-2.5 w-2.5 text-white" />
          </div>
        </div>
      )}

      {/* Today Ring */}
      {isTodayDate && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-primary/30 ring-offset-1 ring-offset-background" />
      )}
    </button>
  );
}
