"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { formatMonthYear } from "@/lib/utils/date";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center gap-4">
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

      {/* Today Button */}
      <Button variant="outline" size="sm" onClick={onToday} className="gap-2">
        <CalendarDays className="h-4 w-4" />
        Today
      </Button>
    </div>
  );
}
