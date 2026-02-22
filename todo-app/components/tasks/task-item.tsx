"use client";

import { useState, useRef, useEffect, memo } from "react";
import { cn } from "@/lib/utils";
import { Task } from "@/lib/types/task";
import { TaskCheckbox } from "./task-checkbox";
import { MiniStopwatch } from "@/components/stopwatch/mini-stopwatch";
import { TimeDisplay } from "@/components/stopwatch/time-display";
import { LabelList } from "@/components/labels/label-list";
import { LabelSelector } from "@/components/labels/label-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, GripVertical, Tag, Pause, Play, Square, Timer } from "lucide-react";
import { useStopwatch } from "@/lib/hooks/use-stopwatch";
import { useTaskLabels, useAddTaskLabel, useRemoveTaskLabel } from "@/lib/hooks/use-labels";

interface TaskItemProps {
  task: Task;
  onUpdate: (data: { title?: string; completed?: boolean }) => void;
  onDelete: () => void;
  onOpenStopwatch?: (taskId: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
  isFocusMode?: boolean;
}

export const TaskItem = memo(function TaskItem({
  task,
  onUpdate,
  onDelete,
  onOpenStopwatch,
  dragHandleProps,
  isDragging = false,
  isFocusMode = false,
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
    stop,
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

  const handleStopwatchStop = async () => {
    if (isRunning || isPaused) {
      await stop();
    }
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

  const hasElapsedTime = elapsedTime > 0 || isRunning || isPaused || isStopped;

  if (isFocusMode) {
    return (
      <div
        className={cn(
          "group relative flex flex-col rounded-xl border border-border/40 bg-card/70 p-4 shadow-sm transition-all duration-300 sm:p-5",
          "animate-in fade-in zoom-in-95 duration-300",
          isRunning && "border-primary/40 bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="pt-1">
            <TaskCheckbox checked={task.completed} onChange={handleToggleComplete} />
          </div>

          <div className="min-w-0 flex-1">
            {isEditing ? (
              <Input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="h-11 border-none bg-transparent px-0 text-xl font-semibold sm:text-2xl focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={cn(
                  "w-full text-left text-xl font-semibold transition-colors sm:text-2xl",
                  task.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                )}
              >
                {task.title}
              </button>
            )}

            <div className="mt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Timer className={cn("h-3.5 w-3.5", isRunning && "text-primary")} />
              <span>
                {isRunning && "Running"}
                {isPaused && "Paused"}
                {!isRunning && !isPaused && !isStopped && "Ready"}
                {isStopped && "Stopped"}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 shrink-0 text-muted-foreground transition-all hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {!task.completed && (
          <div className="mt-4 rounded-2xl border border-border/50 bg-background/40 p-4 sm:p-6">
            <div className="flex justify-center">
              <TimeDisplay
                milliseconds={elapsedTime}
                size="lg"
                showMillis={isRunning}
                className={cn(
                  "text-6xl tracking-tight sm:text-7xl md:text-8xl",
                  isRunning && "text-primary",
                  isPaused && "text-yellow-500",
                  isStopped && "text-muted-foreground"
                )}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <Button
                onClick={handleStopwatchToggle}
                disabled={isLoading || isStopped}
                size="lg"
                className={cn(
                  "min-w-32 gap-2",
                  isRunning && "bg-yellow-500 text-black hover:bg-yellow-600",
                  !isRunning && "bg-primary hover:bg-primary/90"
                )}
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRunning ? "Pause" : isPaused ? "Resume" : "Start"}
              </Button>

              {(isRunning || isPaused) && (
                <Button
                  onClick={handleStopwatchStop}
                  disabled={isLoading}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              )}
            </div>

            {hasElapsedTime && (
              <div className="mt-3 text-center text-xs text-muted-foreground">
                Pause or stop to return to your full task list
              </div>
            )}
          </div>
        )}

        {(taskLabels.length > 0 || !task.completed) && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <LabelList
              labels={taskLabels}
              size="sm"
              max={6}
              onRemove={!task.completed ? handleRemoveLabel : undefined}
            />

            {!task.completed && (
              <LabelSelector selectedLabels={taskLabels} onToggle={handleToggleLabel}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {taskLabels.length === 0 && "Add label"}
                </Button>
              </LabelSelector>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        // Base card with subtle elevated feel
        "group relative flex flex-col gap-2 rounded-lg border border-border/20 bg-card/60 px-3 py-3 sm:px-3 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        // Hover: gentle lift with border highlight
        "hover:border-border/50 hover:bg-card/80 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)]",
        "active:bg-muted/60 touch-manipulation",
        // Completed tasks: dimmed with softer border
        task.completed && "opacity-50 shadow-none border-border/10 bg-muted/20",
        // Dragging: prominent elevation
        isDragging && "border-primary/50 bg-card shadow-lg scale-[1.01]",
        // Active stopwatch: subtle primary glow
        isRunning && "border-primary/30 bg-primary/5 shadow-[0_0_12px_rgba(var(--primary),0.06)]"
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
