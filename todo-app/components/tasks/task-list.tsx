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
import { ClipboardList, FilterX, Tag } from "lucide-react";
import { useTaskLabels } from "@/lib/hooks/use-labels";
import type { GroupByMode } from "./task-filters";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onUpdateTask: (id: string, data: { title?: string; completed?: boolean }) => void;
  onDeleteTask: (id: string) => void;
  onReorderTask?: (id: string, newOrder: number) => void;
  onMoveTaskToNextDay?: (id: string) => void;
  movingTaskId?: string | null;
  filterLabelIds?: string[];
  /** Controls whether tasks are grouped by status or by label */
  groupBy?: GroupByMode;
  /** When set, list enters focus mode and renders only this task */
  focusTaskId?: string | null;
}

/** Represents one label bucket when grouping by label */
interface LabelGroup {
  labelId: string | null;   // null = unlabeled
  labelName: string;
  labelColor: string | null;
  tasks: Task[];
}

/* ------------------------------------------------------------------ */
/*  Helper: per-task label visibility filter                          */
/* ------------------------------------------------------------------ */

function TaskWithLabelFilter({
  task,
  filterLabelIds,
  children,
}: {
  task: Task;
  filterLabelIds: string[];
  children: (show: boolean) => React.ReactNode;
}) {
  const { data: labels = [] } = useTaskLabels(task.id);

  const show =
    filterLabelIds.length === 0 ||
    labels.some((label) => filterLabelIds.includes(label.id));

  return <>{children(show)}</>;
}

/* ------------------------------------------------------------------ */
/*  Helper: build label groups from tasks                             */
/* ------------------------------------------------------------------ */

function buildLabelGroups(tasks: Task[]): LabelGroup[] {
  const groupMap = new Map<string, LabelGroup>();

  // Ensure "Unlabeled" bucket exists for tasks without labels
  const UNLABELED_KEY = "__unlabeled__";

  for (const task of tasks) {
    const taskLabels = task.labels ?? [];

    if (taskLabels.length === 0) {
      // Task has no labels -> goes into the unlabeled group
      if (!groupMap.has(UNLABELED_KEY)) {
        groupMap.set(UNLABELED_KEY, {
          labelId: null,
          labelName: "Unlabeled",
          labelColor: null,
          tasks: [],
        });
      }
      groupMap.get(UNLABELED_KEY)!.tasks.push(task);
    } else {
      // Place the task in the group of its first label (avoids duplicates)
      const primary = taskLabels[0];
      const key = primary.labelId;
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          labelId: primary.labelId,
          labelName: primary.label?.name ?? "Unknown",
          labelColor: primary.label?.color ?? null,
          tasks: [],
        });
      }
      groupMap.get(key)!.tasks.push(task);
    }
  }

  // Sort: labeled groups alphabetically, unlabeled last
  const groups = Array.from(groupMap.values());
  groups.sort((a, b) => {
    if (a.labelId === null) return 1;
    if (b.labelId === null) return -1;
    return a.labelName.localeCompare(b.labelName);
  });

  return groups;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function TaskList({
  tasks,
  isLoading,
  onUpdateTask,
  onDeleteTask,
  onReorderTask,
  onMoveTaskToNextDay,
  movingTaskId = null,
  filterLabelIds = [],
  groupBy = "status",
  focusTaskId = null,
}: TaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Pre-sort once
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.order - b.order),
    [tasks]
  );

  // Label groups (computed only when needed)
  const labelGroups = useMemo(
    () => (groupBy === "label" ? buildLabelGroups(sortedTasks) : []),
    [groupBy, sortedTasks]
  );

  // Status groups
  const incompleteTasks = useMemo(
    () => sortedTasks.filter((t) => !t.completed),
    [sortedTasks]
  );
  const completedTasks = useMemo(
    () => sortedTasks.filter((t) => t.completed),
    [sortedTasks]
  );
  const focusTask = useMemo(
    () => (focusTaskId ? sortedTasks.find((task) => task.id === focusTaskId) ?? null : null),
    [focusTaskId, sortedTasks]
  );
  const isFocusMode = !!focusTask;

  /* ---- shared drag handler (only for status-based incomplete list) ---- */
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

  /* ---- loading state ---- */
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  /* ---- empty state ---- */
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

  if (isFocusMode && focusTask) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
        <TaskItem
          task={focusTask}
          onUpdate={(data) => onUpdateTask(focusTask.id, data)}
          onDelete={() => onDeleteTask(focusTask.id)}
          onMoveToNextDay={
            onMoveTaskToNextDay
              ? () => onMoveTaskToNextDay(focusTask.id)
              : undefined
          }
          isMovingToNextDay={movingTaskId === focusTask.id}
          isFocusMode={true}
        />
      </div>
    );
  }

  const hasFilters = filterLabelIds.length > 0;

  /* ================================================================ */
  /*  LABEL-GROUPED VIEW                                              */
  /* ================================================================ */
  if (groupBy === "label") {
    return (
      <div className="space-y-5">
        {labelGroups.map((group) => (
          <div
            key={group.labelId ?? "__unlabeled__"}
            className="rounded-xl border border-border/30 p-3 shadow-sm backdrop-blur-sm"
            style={{
              // Tint the container background with the label color
              background: group.labelColor
                ? `linear-gradient(to bottom, ${group.labelColor}08, transparent)`
                : undefined,
              borderColor: group.labelColor
                ? `${group.labelColor}25`
                : undefined,
            }}
          >
            {/* Label group header */}
            <div className="mb-3 flex items-center gap-2 px-1">
              {group.labelColor ? (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: group.labelColor }}
                />
              ) : (
                <Tag className="h-3.5 w-3.5 text-muted-foreground/60" />
              )}
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: group.labelColor ?? undefined }}
              >
                {group.labelName}
              </span>
              <span className="text-xs text-muted-foreground/60">
                ({group.tasks.length})
              </span>
            </div>

            {/* Tasks within this label group */}
            <div className="space-y-1.5">
              {group.tasks.map((task) => (
                <TaskWithLabelFilter
                  key={task.id}
                  task={task}
                  filterLabelIds={filterLabelIds}
                >
                  {(show) =>
                    show ? (
                      <TaskItem
                        task={task}
                        onUpdate={(data) => onUpdateTask(task.id, data)}
                        onDelete={() => onDeleteTask(task.id)}
                        onMoveToNextDay={
                          onMoveTaskToNextDay
                            ? () => onMoveTaskToNextDay(task.id)
                            : undefined
                        }
                        isMovingToNextDay={movingTaskId === task.id}
                      />
                    ) : null
                  }
                </TaskWithLabelFilter>
              ))}
            </div>
          </div>
        ))}

        {/* Empty filter state */}
        {hasFilters && labelGroups.length === 0 && (
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

  /* ================================================================ */
  /*  STATUS-GROUPED VIEW (default)                                   */
  /* ================================================================ */
  return (
    <div className="space-y-5">
      {/* Incomplete tasks -- sortable, in a visual group container */}
      {incompleteTasks.length > 0 && (
        <div className="rounded-xl border border-border/30 bg-linear-to-b from-muted/20 to-muted/5 p-3 shadow-sm backdrop-blur-sm">
          {/* Section header */}
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
                    {(show) =>
                      show ? (
                        <SortableTaskItem
                          task={task}
                          onUpdate={(data) => onUpdateTask(task.id, data)}
                          onDelete={() => onDeleteTask(task.id)}
                          onMoveToNextDay={
                            onMoveTaskToNextDay
                              ? () => onMoveTaskToNextDay(task.id)
                              : undefined
                          }
                          isMovingToNextDay={movingTaskId === task.id}
                        />
                      ) : null
                    }
                  </TaskWithLabelFilter>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Completed tasks -- distinct visual group */}
      {completedTasks.length > 0 && (
        <div className="rounded-xl border border-border/20 bg-linear-to-b from-emerald-500/3 to-transparent p-3 shadow-sm">
          {/* Section header */}
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
                {(show) =>
                  show ? (
                    <TaskItem
                      task={task}
                      onUpdate={(data) => onUpdateTask(task.id, data)}
                      onDelete={() => onDeleteTask(task.id)}
                      onMoveToNextDay={
                        onMoveTaskToNextDay
                          ? () => onMoveTaskToNextDay(task.id)
                          : undefined
                      }
                      isMovingToNextDay={movingTaskId === task.id}
                    />
                  ) : null
                }
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
