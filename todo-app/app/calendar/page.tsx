"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { useUser } from "@/lib/hooks/use-user";
import { UsernameDialog } from "@/components/onboarding/username-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getNextMonth, getPrevMonth, formatDate } from "@/lib/utils/date";

export default function CalendarPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());

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
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        streak={0}
      />

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardContent className="p-4 sm:p-6">
          <CalendarGrid
            currentDate={currentDate}
            onDayClick={handleDayClick}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
