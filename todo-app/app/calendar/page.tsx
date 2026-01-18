"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { CalendarLegend } from "@/components/calendar/calendar-legend";
import { StreakBadge } from "@/components/calendar/streak-badge";
import { DayPreviewSheet } from "@/components/calendar/day-preview-sheet";
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
  const [previewDate, setPreviewDate] = useState<Date | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data: calendarData, isLoading: calendarLoading } = useCalendarData(
    currentDate.getMonth() + 1,
    currentDate.getFullYear()
  );

  const { data: streakData } = useStreak();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => getPrevMonth(prev));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => getNextMonth(prev));
  }, []);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          handlePrevMonth();
          break;
        case "ArrowRight":
          handleNextMonth();
          break;
        case "t":
        case "T":
          handleToday();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevMonth, handleNextMonth, handleToday]);

  // Touch swipe handling
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      // Swipe threshold
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNextMonth();
        } else {
          handlePrevMonth();
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handlePrevMonth, handleNextMonth]);

  const handleDayClick = (date: Date) => {
    if (isMobile) {
      // On mobile, show preview sheet first
      setPreviewDate(date);
      setPreviewOpen(true);
    } else {
      // On desktop, navigate directly
      router.push(`/day/${formatDate(date)}`);
    }
  };

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

      <Card className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300">
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
          
          {/* Legend */}
          <div className="mt-6 border-t border-border/40 pt-4">
            <CalendarLegend />
          </div>
        </CardContent>
      </Card>

      {/* Mobile Keyboard Hint */}
      <div className="mt-4 hidden text-center text-xs text-muted-foreground md:block">
        <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">←</kbd>{" "}
        <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">→</kbd> to
        navigate months •{" "}
        <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">T</kbd> for
        today
      </div>

      {/* Mobile Day Preview Sheet */}
      <DayPreviewSheet
        date={previewDate}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </MainLayout>
  );
}
