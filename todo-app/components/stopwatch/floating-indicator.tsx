"use client";

import { useStopwatchContext } from "@/lib/context/stopwatch-context";
import { formatTime } from "./time-display";
import { Button } from "@/components/ui/button";
import { Play, Pause, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStopwatch } from "@/lib/hooks/use-stopwatch";

export function FloatingIndicator() {
  const { activeStopwatch, elapsedTime, openModal } = useStopwatchContext();

  // Use the stopwatch hook for controls
  const taskId = activeStopwatch?.taskId || "";
  const { pause, resume, isLoading } = useStopwatch(taskId);

  if (!activeStopwatch || !activeStopwatch.isActive) {
    return null;
  }

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeStopwatch.isActive) {
      await pause();
    } else {
      await resume();
    }
  };

  const handleClick = () => {
    openModal(activeStopwatch.taskId, activeStopwatch.task.title);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-4">
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 rounded-full border border-border/60 bg-card/95 px-4 py-2 shadow-lg backdrop-blur transition-all",
          "hover:border-primary/50 hover:shadow-xl",
          "animate-in slide-in-from-bottom-5"
        )}
      >
        {/* Pulsing Indicator */}
        <div className="relative">
          <Timer className="h-4 w-4 text-primary" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-primary" />
        </div>

        {/* Time */}
        <span className="font-mono text-sm font-medium tabular-nums">
          {formatTime(elapsedTime)}
        </span>

        {/* Task Name */}
        <span className="max-w-[120px] truncate text-xs text-muted-foreground">
          {activeStopwatch.task.title}
        </span>

        {/* Control Button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleToggle}
          disabled={isLoading}
          className="h-7 w-7 rounded-full"
        >
          {activeStopwatch.isActive ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </Button>
      </button>
    </div>
  );
}
