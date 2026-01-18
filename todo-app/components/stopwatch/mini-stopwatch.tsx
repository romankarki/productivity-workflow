"use client";

import { Button } from "@/components/ui/button";
import { formatTime } from "./time-display";
import { Play, Pause, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniStopwatchProps {
  elapsedTime: number;
  isRunning: boolean;
  isPaused: boolean;
  isStopped: boolean;
  isLoading?: boolean;
  onToggle: () => void;
  onClick: () => void;
}

export function MiniStopwatch({
  elapsedTime,
  isRunning,
  isPaused,
  isStopped,
  isLoading = false,
  onToggle,
  onClick,
}: MiniStopwatchProps) {
  const hasTime = elapsedTime > 0;
  const isIdle = !isRunning && !isPaused && !isStopped;

  return (
    <div className="flex items-center gap-1.5">
      {/* Time Display - clickable to open modal */}
      {hasTime && (
        <button
          onClick={onClick}
          className={cn(
            "flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs tabular-nums transition-colors",
            "hover:bg-muted",
            isRunning && "text-primary bg-primary/10",
            isPaused && "text-yellow-500 bg-yellow-500/10",
            isStopped && "text-muted-foreground"
          )}
        >
          <Timer className="h-3 w-3" />
          {formatTime(elapsedTime)}
        </button>
      )}

      {/* Play/Pause Toggle */}
      {!isStopped && (
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          disabled={isLoading}
          className={cn(
            "h-6 w-6",
            isRunning && "text-primary hover:text-primary",
            isPaused && "text-yellow-500 hover:text-yellow-500"
          )}
        >
          {isRunning ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </Button>
      )}

      {/* Start button if no time yet */}
      {!hasTime && isIdle && (
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          disabled={isLoading}
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
        >
          <Timer className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
