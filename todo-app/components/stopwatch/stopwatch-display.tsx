"use client";

import { Button } from "@/components/ui/button";
import { TimeDisplay } from "./time-display";
import { Play, Pause, Square, Flag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StopwatchDisplayProps {
  elapsedTime: number;
  isRunning: boolean;
  isPaused: boolean;
  isStopped: boolean;
  isLoading?: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onLap: () => void;
  size?: "compact" | "default" | "large";
}

export function StopwatchDisplay({
  elapsedTime,
  isRunning,
  isPaused,
  isStopped,
  isLoading = false,
  onStart,
  onPause,
  onResume,
  onStop,
  onLap,
  size = "default",
}: StopwatchDisplayProps) {
  const isIdle = !isRunning && !isPaused && !isStopped;

  const handleMainAction = () => {
    if (isLoading) return;
    if (isRunning) {
      onPause();
    } else if (isPaused) {
      onResume();
    } else {
      onStart();
    }
  };

  const timeSize = size === "large" ? "lg" : size === "compact" ? "sm" : "md";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4",
        size === "compact" && "gap-2"
      )}
    >
      {/* Time Display */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full",
          size === "large" && "h-48 w-48 bg-muted/30",
          size === "default" && "h-32 w-32 bg-muted/30",
          size === "compact" && "px-3 py-1 bg-muted/30 rounded-lg",
          isRunning && "animate-pulse"
        )}
      >
        {/* Pulse Ring */}
        {isRunning && size !== "compact" && (
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
        )}
        
        <TimeDisplay
          milliseconds={elapsedTime}
          size={timeSize}
          showMillis={size === "large"}
          className={cn(
            isRunning && "text-primary",
            isPaused && "text-yellow-500",
            isStopped && "text-muted-foreground"
          )}
        />
      </div>

      {/* Status Badge */}
      {size !== "compact" && (
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            isRunning && "bg-primary/10 text-primary",
            isPaused && "bg-yellow-500/10 text-yellow-500",
            isIdle && "bg-muted text-muted-foreground",
            isStopped && "bg-emerald-500/10 text-emerald-500"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isRunning && "bg-primary animate-pulse",
              isPaused && "bg-yellow-500",
              isIdle && "bg-muted-foreground",
              isStopped && "bg-emerald-500"
            )}
          />
          {isRunning && "Running"}
          {isPaused && "Paused"}
          {isIdle && "Ready"}
          {isStopped && "Completed"}
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          "flex items-center gap-2",
          size === "compact" && "gap-1"
        )}
      >
        {/* Main Action Button */}
        <Button
          onClick={handleMainAction}
          disabled={isLoading || isStopped}
          size={size === "compact" ? "sm" : "default"}
          className={cn(
            "gap-2",
            isRunning && "bg-yellow-500 hover:bg-yellow-600",
            isPaused && "bg-primary hover:bg-primary/90",
            isIdle && "bg-primary hover:bg-primary/90"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {size !== "compact" && (
            <span>
              {isRunning ? "Pause" : isPaused ? "Resume" : "Start"}
            </span>
          )}
        </Button>

        {/* Stop Button */}
        {(isRunning || isPaused) && (
          <Button
            onClick={onStop}
            variant="outline"
            size={size === "compact" ? "sm" : "default"}
            disabled={isLoading}
            className="gap-2"
          >
            <Square className="h-4 w-4" />
            {size !== "compact" && <span>Stop</span>}
          </Button>
        )}

        {/* Lap Button */}
        {isRunning && (
          <Button
            onClick={onLap}
            variant="outline"
            size={size === "compact" ? "sm" : "default"}
            disabled={isLoading}
            className="gap-2"
          >
            <Flag className="h-4 w-4" />
            {size !== "compact" && <span>Lap</span>}
          </Button>
        )}
      </div>
    </div>
  );
}
