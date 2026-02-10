"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskList } from "@/components/tasks/task-list";
import { TaskInput } from "@/components/tasks/task-input";
import { Task } from "@/lib/types/task";
import { ArrowRight, CalendarDays } from "lucide-react";

interface TodaySummaryProps {
  tasks: Task[];
  taskListId: string | null;
  isLoading: boolean;
  onCreateTask: (title: string) => Promise<void>;
  onUpdateTask: (id: string, data: { title?: string; completed?: boolean; duration?: number }) => void;
  onDeleteTask: (id: string) => void;
  isCreating: boolean;
}

export function TodaySummary({
  tasks,
  taskListId,
  isLoading,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  isCreating,
}: TodaySummaryProps) {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Today&apos;s Tasks</CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d")}
          </p>
        </div>
        <Link href={`/day/${today}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {/* Show only first 5 tasks */}
        <TaskList
          tasks={tasks.slice(0, 5)}
          isLoading={isLoading}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />

        {/* Show "more tasks" indicator */}
        {tasks.length > 5 && (
          <Link
            href={`/day/${today}`}
            className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <CalendarDays className="h-4 w-4" />
            <span>+{tasks.length - 5} more tasks</span>
          </Link>
        )}

        {/* Task Input */}
        {taskListId && (
          <div className="mt-4 border-t border-border/40 pt-4">
            <TaskInput onSubmit={onCreateTask} isLoading={isCreating} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
