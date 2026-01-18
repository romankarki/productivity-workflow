"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Lap } from "@/lib/types/stopwatch";
import { LapItem } from "./lap-item";
import { formatTime } from "./time-display";
import { Clock } from "lucide-react";

interface LapListProps {
  laps: Lap[];
  maxHeight?: string;
}

export function LapList({ laps, maxHeight = "300px" }: LapListProps) {
  if (laps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mb-2 opacity-40" />
        <p className="text-sm">No laps recorded yet</p>
        <p className="text-xs">Press Lap to record a segment</p>
      </div>
    );
  }

  // Calculate total duration from laps
  const totalDuration = laps.reduce((acc, lap) => acc + lap.duration, 0);

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
        <span className="text-sm font-medium">{laps.length} laps</span>
        <span className="font-mono text-sm tabular-nums">
          Total: {formatTime(totalDuration)}
        </span>
      </div>

      {/* Lap List */}
      <ScrollArea style={{ maxHeight }} className="pr-4">
        <div className="space-y-2">
          {laps.map((lap, index) => (
            <LapItem
              key={lap.id}
              lap={lap}
              index={index}
              totalLaps={laps.length}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
