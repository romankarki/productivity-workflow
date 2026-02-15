"use client";

import { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task } from "@/lib/types/task";
import { TaskItem } from "./task-item";
import { SortableTaskItem } from "./sortable-task-item";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, FilterX } from "lucide-react";
import { useTaskLabels } from "@/lib/hooks/use-labels";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onUpdateTask: (id: string, data: { title?: string; completed?: boolean }) => void;
  onDeleteTask: (id: string) => void;
  onReorderTask?: (id: string, newOrder: number) => void;
  filterLabelIds?: string[];
}

// Component to check if task has any of the filter labels
function TaskWithLabelFilter({ 
  task, 
  filterLabelIds, 
  children 
}: { 
  task: Task; 
  filterLabelIds: string[]; 
  children: (show: boolean) => React.ReactNode;
}) {
  const { data: labels = [] } = useTaskLabels(task.id);
  
  const show = filterLabelIds.length === 0 || 
    labels.some(label => filterLabelIds.includes(label.id));
  
  return <>{children(show)}</>;
}

export function TaskList({
  tasks,
  isLoading,
  onUpdateTask,
  onDeleteTask,
  onReorderTask,
  filterLabelIds = [],
}: TaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorderTask) {
      const oldIndex = incompleteTasks.findIndex((t) => t.id === active.id);
      const newIndex = incompleteTasks.findIndex((t) => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderTask(active.id as string, newIndex);
      }
    }
  };

  const hasFilters = filterLabelIds.length > 0;

  return (
    <div className="space-y-5">
      {/* Incomplete Tasks - Sortable, wrapped in a visual group container */}
      {incompleteTasks.length > 0 && (
        <div className="rounded-xl border border-border/30 bg-linear-to-b from-muted/20 to-muted/5 p-3 shadow-sm backdrop-blur-sm">
          {/* Section header for pending tasks */}
          <div className="mb-3 flex items-center gap-2 px-1">
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/80" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              In Progress
            </span>
            <span className="text-xs text-muted-foreground/60">
              ({incompleteTasks.length})
            </span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={incompleteTasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1.5">
                {incompleteTasks.map((task) => (
                  <TaskWithLabelFilter
                    key={task.id}
                    task={task}
                    filterLabelIds={filterLabelIds}
                  >
                    {(show) => show ? (
                      <SortableTaskItem
                        task={task}
                        onUpdate={(data) => onUpdateTask(task.id, data)}
                        onDelete={() => onDeleteTask(task.id)}
                      />
                    ) : null}
                  </TaskWithLabelFilter>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Completed Tasks - wrapped in a distinct visual group */}
      {completedTasks.length > 0 && (
        <div className="rounded-xl border border-border/20 bg-linear-to-b from-emerald-500/3 to-transparent p-3 shadow-sm">
          {/* Section header for completed tasks */}
          <div className="mb-3 flex items-center gap-2 px-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Completed
            </span>
            <span className="text-xs text-muted-foreground/60">
              ({completedTasks.length})
            </span>
          </div>

          <div className="space-y-1.5">
            {completedTasks.map((task) => (
              <TaskWithLabelFilter
                key={task.id}
                task={task}
                filterLabelIds={filterLabelIds}
              >
                {(show) => show ? (
                  <TaskItem
                    task={task}
                    onUpdate={(data) => onUpdateTask(task.id, data)}
                    onDelete={() => onDeleteTask(task.id)}
                  />
                ) : null}
              </TaskWithLabelFilter>
            ))}
          </div>
        </div>
      )}

      {/* Empty filter state */}
      {hasFilters && incompleteTasks.length === 0 && completedTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted/50 p-4">
            <FilterX className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No matching tasks</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            No tasks match the selected filters
          </p>
        </div>
      )}
    </div>
  );
}
