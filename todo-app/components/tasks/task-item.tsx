"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Task } from "@/lib/types/task";
import { TaskCheckbox } from "./task-checkbox";
import { MiniStopwatch } from "@/components/stopwatch/mini-stopwatch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, GripVertical } from "lucide-react";
import { useStopwatch } from "@/lib/hooks/use-stopwatch";

interface TaskItemProps {
  task: Task;
  onUpdate: (data: { title?: string; completed?: boolean }) => void;
  onDelete: () => void;
  onOpenStopwatch?: (taskId: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}

export function TaskItem({
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

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-lg border border-transparent bg-muted/30 px-3 py-3 transition-all duration-200",
        "hover:border-border/60 hover:bg-muted/50",
        task.completed && "opacity-60",
        isDragging && "border-primary/50 bg-card shadow-lg",
        isRunning && "border-primary/30 bg-primary/5"
      )}
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className={cn(
          "cursor-grab touch-none text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100",
          isDragging && "cursor-grabbing opacity-100"
        )}
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Checkbox */}
      <TaskCheckbox
        checked={task.completed}
        onChange={handleToggleComplete}
      />

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
              "w-full text-left text-sm transition-colors",
              task.completed
                ? "text-muted-foreground line-through"
                : "text-foreground"
            )}
          >
            {task.title}
          </button>
        )}
      </div>

      {/* Stopwatch */}
      {!task.completed && (
        <MiniStopwatch
          elapsedTime={elapsedTime}
          isRunning={isRunning}
          isPaused={isPaused}
          isStopped={isStopped}
          isLoading={isLoading}
          onToggle={handleStopwatchToggle}
          onClick={handleOpenStopwatch}
        />
      )}

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className={cn(
          "h-7 w-7 shrink-0 text-muted-foreground opacity-0 transition-all hover:text-destructive group-hover:opacity-100",
          isDragging && "opacity-0"
        )}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
