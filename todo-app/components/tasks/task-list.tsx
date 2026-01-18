"use client";

import { Task } from "@/lib/types/task";
import { TaskItem } from "./task-item";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onUpdateTask: (id: string, data: { title?: string; completed?: boolean }) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({
  tasks,
  isLoading,
  onUpdateTask,
  onDeleteTask,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted/50 p-4">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No tasks yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first task below to get started
        </p>
      </div>
    );
  }

  // Sort tasks by order
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  // Separate completed and incomplete tasks
  const incompleteTasks = sortedTasks.filter((t) => !t.completed);
  const completedTasks = sortedTasks.filter((t) => t.completed);

  return (
    <div className="space-y-2">
      {/* Incomplete Tasks */}
      {incompleteTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={(data) => onUpdateTask(task.id, data)}
          onDelete={() => onDeleteTask(task.id)}
        />
      ))}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs font-medium text-muted-foreground">
              Completed ({completedTasks.length})
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={(data) => onUpdateTask(task.id, data)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
