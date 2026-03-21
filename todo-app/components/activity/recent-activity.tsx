"use client";

import { format, parseISO, isToday, isYesterday } from "date-fns";
import { CheckCircle2, Circle, Clock, FileText, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useRecentActivity,
  ActivityDay,
  ActivityTask,
} from "@/lib/hooks/use-activity";
import { formatTimeHuman } from "@/components/stopwatch/time-display";
import { Skeleton } from "@/components/ui/skeleton";

function formatDateHeader(dateStr: string): { main: string; relative: string | null } {
  const date = parseISO(dateStr);
  const main = format(date, "EEEE, MMMM d");

  if (isToday(date)) return { main, relative: "Today" };
  if (isYesterday(date)) return { main, relative: "Yesterday" };
  return { main, relative: null };
}

function TaskItem({ task }: { task: ActivityTask }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/20 bg-card/60 px-3 py-2">
      {task.completed ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
      )}

      <span
        className={cn(
          "flex-1 text-sm",
          task.completed ? "text-muted-foreground line-through" : "text-foreground"
        )}
      >
        {task.title}
      </span>

      {task.labels.length > 0 && (
        <div className="flex items-center gap-1">
          {task.labels.map((label) => (
            <span
              key={label.id}
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}

      {task.totalTimeTracked > 0 && (
        <span className="text-xs font-mono tabular-nums text-muted-foreground">
          {formatTimeHuman(task.totalTimeTracked)}
        </span>
      )}
    </div>
  );
}

function DayCard({ day }: { day: ActivityDay }) {
  const { main, relative } = formatDateHeader(day.date);
  const hasActivity = day.taskCount > 0 || day.notes || day.dailyWins;
  const wins = day.dailyWins?.split("\n").filter(Boolean) ?? [];

  return (
    <div className="rounded-xl border border-border/40 bg-card/50 p-4">
      {/* Date header */}
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="text-sm font-semibold text-foreground">{main}</h3>
        {relative && (
          <span className="text-xs font-medium text-primary">{relative}</span>
        )}
      </div>

      {!hasActivity ? (
        <p className="text-sm text-muted-foreground/50 py-2">No activity</p>
      ) : (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {day.taskCount > 0 && (
              <span>
                {day.completedCount}/{day.taskCount} tasks completed
              </span>
            )}
            {day.totalTime > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTimeHuman(day.totalTime)}
              </span>
            )}
          </div>

          {/* Tasks */}
          {day.tasks.length > 0 && (
            <div className="space-y-1.5">
              {day.tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          )}

          {/* Notes */}
          {day.notes && (
            <div className="rounded-lg border border-border/20 bg-muted/20 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Notes
                </span>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {day.notes}
              </p>
            </div>
          )}

          {/* Daily Wins */}
          {wins.length > 0 && (
            <div className="rounded-lg border border-border/20 bg-muted/20 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Daily Wins
                </span>
              </div>
              <ul className="space-y-1">
                {wins.map((win, i) => (
                  <li key={i} className="text-sm text-foreground">
                    {win}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function RecentActivity() {
  const { data: days, isLoading, error } = useRecentActivity();

  if (isLoading) return <ActivitySkeleton />;

  if (error) {
    return (
      <p className="text-sm text-destructive py-4">
        Failed to load recent activity.
      </p>
    );
  }

  if (!days || days.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        No activity in the last 14 days.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {days.map((day) => (
        <DayCard key={day.date} day={day} />
      ))}
    </div>
  );
}
