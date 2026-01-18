"use client";

import { useMemo } from "react";
import { getMonthDays, formatDate } from "@/lib/utils/date";
import { CalendarDay } from "./calendar-day";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface TaskInfo {
  total: number;
  completed: number;
}

interface CalendarGridProps {
  currentDate: Date;
  taskData?: Record<string, TaskInfo>;
  streakDates?: string[];
  onDayClick: (date: Date) => void;
}

export function CalendarGrid({
  currentDate,
  taskData = {},
  streakDates = [],
  onDayClick,
}: CalendarGridProps) {
  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return getMonthDays(year, month);
  }, [currentDate]);

  const streakSet = useMemo(() => new Set(streakDates), [streakDates]);

  return (
    <div>
      {/* Weekday Headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
          const dateStr = formatDate(date);
          return (
            <CalendarDay
              key={dateStr}
              date={date}
              currentMonth={currentDate}
              taskInfo={taskData[dateStr]}
              isStreakDay={streakSet.has(dateStr)}
              onClick={onDayClick}
            />
          );
        })}
      </div>
    </div>
  );
}
