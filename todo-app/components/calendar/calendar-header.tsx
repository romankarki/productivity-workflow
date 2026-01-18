"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays, Flame } from "lucide-react";
import { formatMonthYear } from "@/lib/utils/date";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  streak?: number;
}

export function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  streak = 0,
}: CalendarHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Month Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevMonth}
          className="h-9 w-9 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <h1 className="min-w-[180px] text-center text-xl font-semibold tracking-tight sm:text-2xl">
          {formatMonthYear(currentDate)}
        </h1>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNextMonth}
          className="h-9 w-9 rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 sm:justify-end">
        {/* Streak Badge */}
        {streak > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-rose-500/10 px-3 py-1.5">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">
              {streak} day{streak !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        <Button variant="outline" size="sm" onClick={onToday} className="gap-2">
          <CalendarDays className="h-4 w-4" />
          Today
        </Button>
      </div>
    </div>
  );
}
