"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format, addDays, subDays, isToday, parseISO } from "date-fns";

interface DayHeaderProps {
  date: string;
}

export function DayHeader({ date }: DayHeaderProps) {
  const router = useRouter();
  const currentDate = parseISO(date);

  const goToPrevDay = () => {
    const prevDay = subDays(currentDate, 1);
    router.push(`/day/${format(prevDay, "yyyy-MM-dd")}`);
  };

  const goToNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    router.push(`/day/${format(nextDay, "yyyy-MM-dd")}`);
  };

  const goToToday = () => {
    router.push(`/day/${format(new Date(), "yyyy-MM-dd")}`);
  };

  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");
  const isTodayDate = isToday(currentDate);

  return (
    <div className="mb-8">
      {/* Navigation Row */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevDay}
          className="h-9 w-9 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            {isTodayDate && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                Today
              </span>
            )}
          </div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            {formattedDate}
          </h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextDay}
          className="h-9 w-9 rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Actions */}
      {!isTodayDate && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="gap-2"
          >
            <CalendarDays className="h-4 w-4" />
            Go to Today
          </Button>
        </div>
      )}
    </div>
  );
}
