"use client";

import { useState, useRef, useEffect, memo } from "react";
import { cn } from "@/lib/utils";
import { Task } from "@/lib/types/task";
import { TaskCheckbox } from "./task-checkbox";
import { MiniStopwatch } from "@/components/stopwatch/mini-stopwatch";
import { formatTime } from "@/components/stopwatch/time-display";
import { LabelList } from "@/components/labels/label-list";
import { LabelSelector } from "@/components/labels/label-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, GripVertical, Tag, Pause, Play, Square, ArrowRight, Loader2 } from "lucide-react";
import { useStopwatch } from "@/lib/hooks/use-stopwatch";
import { useTaskLabels, useAddTaskLabel, useRemoveTaskLabel } from "@/lib/hooks/use-labels";

function FlipClockTime({ milliseconds }: { milliseconds: number }) {
  const seconds = Math.floor(milliseconds / 1000);
  const value = formatTime(milliseconds, false);

  return (
    <div className="relative h-[1.15em] overflow-hidden leading-none">
      <span
        key={seconds}
        className="block animate-[timer-flip_320ms_cubic-bezier(0.2,0.8,0.2,1)]"
      >
        {value}
      </span>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  onUpdate: (data: { title?: string; completed?: boolean }) => void;
  onDelete: () => void;
  onMoveToNextDay?: () => void;
  isMovingToNextDay?: boolean;
  onOpenStopwatch?: (taskId: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
  isFocusMode?: boolean;
}

export const TaskItem = memo(function TaskItem({
  task,
  onUpdate,
  onDelete,
  onMoveToNextDay,
  isMovingToNextDay = false,
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

  const handleMoveToNextDay = () => {
    onMoveToNextDay?.();
  };

  const hasElapsedTime = elapsedTime > 0 || isRunning || isPaused || isStopped;

  if (isFocusMode) {
    return (
      <div className="overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-950">
        {/* Task header */}
        <div className="flex items-center gap-3 border-b border-zinc-800/50 px-4 py-3">
          <TaskCheckbox checked={task.completed} onChange={handleToggleComplete} />

          {isEditing ? (
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="h-7 flex-1 border-none bg-transparent px-0 text-sm text-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={cn(
                "flex-1 text-left text-sm transition-colors hover:text-zinc-300",
                task.completed ? "text-zinc-600 line-through" : "text-zinc-400"
              )}
            >
              {task.title}
            </button>
          )}

          <button
            onClick={onDelete}
            className="text-zinc-700 transition-colors hover:text-zinc-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Stopwatch body */}
        {!task.completed && (
          <div className="flex flex-col items-center px-6 py-10 sm:py-14">
            {/* Timer */}
            <div
              className={cn(
                "font-mono tabular-nums leading-none tracking-tight",
                "text-[4.5rem] font-thin sm:text-[6rem]",
                isRunning && "text-white",
                isPaused && "text-amber-300",
                isStopped && "text-zinc-700",
                !isRunning && !isPaused && !isStopped && "text-zinc-500"
              )}
            >
              <FlipClockTime milliseconds={elapsedTime} />
            </div>

            {/* Status */}
            <p
              className={cn(
                "mt-3 text-[11px] font-medium uppercase tracking-[0.15em]",
                isRunning && "text-emerald-400",
                isPaused && "text-amber-400/80",
                isStopped && "text-zinc-700",
                !isRunning && !isPaused && !isStopped && "text-zinc-600"
              )}
            >
              {isRunning ? "Running" : isPaused ? "Paused" : isStopped ? "Stopped" : "Ready"}
            </p>

            {/* Controls */}
            <div className="mt-10 flex items-end gap-10">
              {/* Stop — left circle */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleStopwatchStop}
                  disabled={!isRunning && !isPaused}
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 transition-all",
                    (isRunning || isPaused)
                      ? "hover:bg-zinc-700 active:scale-95"
                      : "cursor-not-allowed opacity-25"
                  )}
                >
                  <Square className="h-5 w-5 fill-zinc-300 text-zinc-300" />
                </button>
                <span className="text-[11px] text-zinc-600">Stop</span>
              </div>

              {/* Start / Pause — right circle */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleStopwatchToggle}
                  disabled={isStopped || isLoading}
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full transition-all active:scale-95",
                    isRunning
                      ? "bg-amber-400/15 hover:bg-amber-400/25"
                      : "bg-emerald-400/15 hover:bg-emerald-400/25",
                    (isStopped || isLoading) && "cursor-not-allowed opacity-25"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                  ) : isRunning ? (
                    <Pause className="h-5 w-5 text-amber-400" />
                  ) : (
                    <Play className="h-5 w-5 text-emerald-400" />
                  )}
                </button>
                <span
                  className={cn(
                    "text-[11px]",
                    isRunning ? "text-amber-400/70" : "text-emerald-400/70",
                    (isStopped || isLoading) && "text-zinc-600"
                  )}
                >
                  {isRunning ? "Pause" : isPaused ? "Resume" : "Start"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Labels footer */}
        {(taskLabels.length > 0 || !task.completed) && (
          <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800/50 px-4 py-3">
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
                  className="h-6 gap-1 px-2 text-xs text-zinc-600 hover:bg-transparent hover:text-zinc-400"
                >
                  <Tag className="h-3 w-3" />
                  {taskLabels.length === 0 && "Label"}
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
        {!task.completed && onMoveToNextDay && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMoveToNextDay}
            title="Move to next day"
            disabled={isMovingToNextDay || isLoading || isRunning || isPaused}
            className={cn(
              "h-8 w-8 sm:h-7 sm:w-7 shrink-0 text-muted-foreground transition-all hover:text-primary",
              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
              isDragging && "opacity-0"
            )}
          >
            <ArrowRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </Button>
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
