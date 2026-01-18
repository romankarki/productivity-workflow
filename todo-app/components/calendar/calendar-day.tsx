"use client";

import { cn } from "@/lib/utils";
import { isToday, isInMonth, formatDate } from "@/lib/utils/date";
import { Check, Flame } from "lucide-react";

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

  const hasTasks = taskInfo && taskInfo.total > 0;
  const allCompleted = taskInfo && taskInfo.total > 0 && taskInfo.completed === taskInfo.total;
  const hasPartial = taskInfo && taskInfo.completed > 0 && taskInfo.completed < taskInfo.total;

  return (
    <button
      onClick={() => onClick(date)}
      className={cn(
        "group relative flex aspect-square flex-col items-center justify-center rounded-lg border border-transparent p-1 transition-all duration-200",
        "hover:border-border/60 hover:bg-muted/50",
        !isCurrentMonth && "opacity-30",
        isTodayDate && "border-primary/50 bg-primary/5",
        isStreakDay && "bg-gradient-to-br from-orange-500/10 to-rose-500/10"
      )}
    >
      {/* Day Number */}
      <span
        className={cn(
          "text-sm font-medium",
          isTodayDate && "text-primary",
          !isCurrentMonth && "text-muted-foreground"
        )}
      >
        {dayNumber}
      </span>

      {/* Task Indicator */}
      <div className="mt-1 flex h-4 items-center justify-center">
        {allCompleted ? (
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20">
            <Check className="h-2.5 w-2.5 text-emerald-500" strokeWidth={3} />
          </div>
        ) : hasPartial ? (
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] text-muted-foreground">
              {taskInfo?.completed}/{taskInfo?.total}
            </span>
          </div>
        ) : hasTasks ? (
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
        ) : null}
      </div>

      {/* Streak Indicator */}
      {isStreakDay && (
        <div className="absolute -top-1 -right-1">
          <Flame className="h-3 w-3 text-orange-500" />
        </div>
      )}

      {/* Today Ring */}
      {isTodayDate && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-primary/30 ring-offset-1 ring-offset-background" />
      )}
    </button>
  );
}
