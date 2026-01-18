"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Circle, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useTaskList } from "@/lib/hooks/use-tasklist";
import { formatDate } from "@/lib/utils/date";

interface DayPreviewSheetProps {
  date: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DayPreviewSheet({
  date,
  open,
  onOpenChange,
}: DayPreviewSheetProps) {
  const router = useRouter();
  const dateStr = date ? formatDate(date) : "";
  const { data: taskListData, isLoading } = useTaskList(dateStr, {
    enabled: !!date,
  });

  const tasks = taskListData?.tasks || [];
  const completedCount = tasks.filter((t) => t.completed).length;

  const handleViewDay = () => {
    if (date) {
      router.push(`/day/${formatDate(date)}`);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {date ? format(date, "EEEE, MMMM d, yyyy") : "Day Preview"}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Stats */}
          {tasks.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{tasks.length} tasks</span>
              <span>•</span>
              <span>{completedCount} completed</span>
            </div>
          )}

          {/* Task List Preview */}
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Circle className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">
                  No tasks for this day
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewDay}
                  className="mt-4"
                >
                  Add Tasks
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3"
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        task.completed
                          ? "border-emerald-500 bg-emerald-500/20"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {task.completed && (
                        <Check
                          className="h-3 w-3 text-emerald-500"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <span
                      className={`flex-1 text-sm ${
                        task.completed
                          ? "text-muted-foreground line-through"
                          : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Actions */}
          {tasks.length > 0 && (
            <Button onClick={handleViewDay} className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              Open Day View
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
