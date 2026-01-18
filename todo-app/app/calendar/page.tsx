"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { StreakBadge } from "@/components/calendar/streak-badge";
import { GoalDialog } from "@/components/goals/goal-dialog";
import { useUser } from "@/lib/hooks/use-user";
import { useCalendarData } from "@/lib/hooks/use-calendar-data";
import { useStreak } from "@/lib/hooks/use-streak";
import { UsernameDialog } from "@/components/onboarding/username-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getNextMonth, getPrevMonth, formatDate } from "@/lib/utils/date";

export default function CalendarPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { data: calendarData, isLoading: calendarLoading } = useCalendarData(
    currentDate.getMonth() + 1,
    currentDate.getFullYear()
  );
  
  const { data: streakData } = useStreak();

  // Loading state
  if (userLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </MainLayout>
    );
  }

  // Auth check
  if (!user) {
    return <UsernameDialog open={true} />;
  }

  const handlePrevMonth = () => {
    setCurrentDate(getPrevMonth(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(getNextMonth(currentDate));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    router.push(`/day/${formatDate(date)}`);
  };

  return (
    <MainLayout>
      {/* Header with Streak and Goals */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />
        <div className="flex items-center gap-3">
          <StreakBadge
            currentStreak={streakData?.currentStreak || 0}
            longestStreak={streakData?.longestStreak || 0}
          />
          <GoalDialog date={currentDate} />
        </div>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardContent className="p-4 sm:p-6">
          {calendarLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {[...Array(35)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <CalendarGrid
              currentDate={currentDate}
              taskData={calendarData?.taskData}
              streakDates={streakData?.streakDates}
              onDayClick={handleDayClick}
            />
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
