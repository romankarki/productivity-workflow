"use client";

import { formatTime } from "./time-display";
import { Lap } from "@/lib/types/stopwatch";
import { cn } from "@/lib/utils";

interface LapItemProps {
  lap: Lap;
  index: number;
  totalLaps: number;
}

export function LapItem({ lap, index, totalLaps }: LapItemProps) {
  const lapNumber = totalLaps - index;

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Lap {lapNumber}</span>
        {lap.label ? (
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: lap.label.color }}
            />
            <span className="text-xs text-muted-foreground">
              {lap.label.name}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/60 italic">
            No label
          </span>
        )}
      </div>
      <span
        className={cn(
          "font-mono text-sm tabular-nums",
          lapNumber === totalLaps && "text-primary font-medium"
        )}
      >
        {formatTime(lap.duration)}
      </span>
    </div>
  );
}
