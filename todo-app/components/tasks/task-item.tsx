"use client";

import { useState, useRef, useEffect, memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Task } from "@/lib/types/task";
import { TaskCheckbox } from "./task-checkbox";
import { MiniStopwatch } from "@/components/stopwatch/mini-stopwatch";
import { LabelList } from "@/components/labels/label-list";
import { LabelSelector } from "@/components/labels/label-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, GripVertical, Tag } from "lucide-react";
import { useStopwatch } from "@/lib/hooks/use-stopwatch";
import { useTaskLabels, useAddTaskLabel, useRemoveTaskLabel } from "@/lib/hooks/use-labels";

interface TaskItemProps {
  task: Task;
  onUpdate: (data: { title?: string; completed?: boolean }) => void;
  onDelete: () => void;
  onOpenStopwatch?: (taskId: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}

export const TaskItem = memo(function TaskItem({
  task,
  onUpdate,
  onDelete,
  onOpenStopwatch,
  dragHandleProps,
  isDragging = false,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    elapsedTime,
    isRunning,
    isPaused,
    isStopped,
    isLoading,
    start,
    pause,
    resume,
  } = useStopwatch(task.id);

  const { data: taskLabels = [] } = useTaskLabels(task.id);
  const addLabel = useAddTaskLabel();
  const removeLabel = useRemoveTaskLabel();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdate({ title: trimmed });
    } else {
      setEditValue(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(task.title);
      setIsEditing(false);
    }
  };

  const handleToggleComplete = (checked: boolean) => {
    onUpdate({ completed: checked });
  };

  const handleStopwatchToggle = async () => {
    if (isRunning) {
      await pause();
    } else if (isPaused) {
      await resume();
    } else {
      await start();
    }
  };

  const handleOpenStopwatch = () => {
    onOpenStopwatch?.(task.id);
  };

  const handleToggleLabel = async (labelId: string) => {
    const hasLabel = taskLabels.some((l) => l.id === labelId);
    if (hasLabel) {
      await removeLabel.mutateAsync({ taskId: task.id, labelId });
    } else {
      await addLabel.mutateAsync({ taskId: task.id, labelId });
    }
  };

  const handleRemoveLabel = async (labelId: string) => {
    await removeLabel.mutateAsync({ taskId: task.id, labelId });
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border border-transparent bg-muted/30 px-3 py-3 sm:px-3 transition-all duration-200",
        "hover:border-border/60 hover:bg-muted/50",
        "active:bg-muted/60 touch-manipulation",
        task.completed && "opacity-60",
        isDragging && "border-primary/50 bg-card shadow-lg",
        isRunning && "border-primary/30 bg-primary/5"
      )}
    >
      {/* Main Row */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className={cn(
            "cursor-grab touch-none text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100",
            "p-1 -m-1", // Increase touch target
            isDragging && "cursor-grabbing opacity-100"
          )}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Checkbox - larger touch target on mobile */}
        <div className="p-1 -m-1">
          <TaskCheckbox
            checked={task.completed}
            onChange={handleToggleComplete}
          />
        </div>

        {/* Title / Edit Input */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="h-8 border-none bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={cn(
                "w-full text-left text-sm transition-colors py-1",
                task.completed
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              )}
            >
              {task.title}
            </button>
          )}
        </div>

        {/* Stopwatch - visible only on larger screens in row, moved to below on small */}
        {!task.completed && (
          <div className="hidden sm:block">
            <MiniStopwatch
              elapsedTime={elapsedTime}
              isRunning={isRunning}
              isPaused={isPaused}
              isStopped={isStopped}
              isLoading={isLoading}
              onToggle={handleStopwatchToggle}
              onClick={handleOpenStopwatch}
            />
          </div>
        )}

        {/* Delete Button - larger touch target */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className={cn(
            "h-8 w-8 sm:h-7 sm:w-7 shrink-0 text-muted-foreground transition-all hover:text-destructive",
            "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
            isDragging && "opacity-0"
          )}
        >
          <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
        </Button>
      </div>

      {/* Mobile: Stopwatch row */}
      {!task.completed && (isRunning || isPaused || elapsedTime > 0) && (
        <div className="flex sm:hidden items-center pl-10">
          <MiniStopwatch
            elapsedTime={elapsedTime}
            isRunning={isRunning}
            isPaused={isPaused}
            isStopped={isStopped}
            isLoading={isLoading}
            onToggle={handleStopwatchToggle}
            onClick={handleOpenStopwatch}
          />
        </div>
      )}

      {/* Labels Row */}
      {(taskLabels.length > 0 || !task.completed) && (
        <div className="flex items-center gap-2 pl-10 flex-wrap">
          <LabelList
            labels={taskLabels}
            size="sm"
            max={3}
            onRemove={!task.completed ? handleRemoveLabel : undefined}
          />
          
          {!task.completed && (
            <LabelSelector
              selectedLabels={taskLabels}
              onToggle={handleToggleLabel}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-7 sm:h-6 gap-1 px-2 sm:px-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Tag className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                {taskLabels.length === 0 && "Add label"}
              </Button>
            </LabelSelector>
          )}
        </div>
      )}
    </div>
  );
})
