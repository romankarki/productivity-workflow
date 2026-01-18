"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Stopwatch } from "@/lib/types/stopwatch";
import { formatTime } from "./time-display";
import { cn } from "@/lib/utils";
import { ChevronDown, Clock, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SessionCardProps {
  session: Stopwatch;
}

export function SessionCard({ session }: SessionCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sessionDate = new Date(session.createdAt);
  const duration = session.totalDuration;
  const lapCount = session.laps?.length || 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border border-border/50 bg-muted/30 overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {format(sessionDate, "MMMM d, yyyy")}
              </span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {format(sessionDate, "h:mm a")}
                {lapCount > 0 && (
                  <>
                    <span>•</span>
                    <Flag className="h-3 w-3" />
                    {lapCount} lap{lapCount !== 1 ? "s" : ""}
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold tabular-nums">
                {formatTime(duration)}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {lapCount > 0 ? (
            <div className="border-t border-border/50 p-4">
              <div className="space-y-2">
                {session.laps?.map((lap, index) => (
                  <div
                    key={lap.id}
                    className="flex items-center justify-between rounded bg-muted/50 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        Lap {session.laps!.length - index}
                      </span>
                      {lap.label && (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: lap.label.color }}
                          />
                          <span className="text-xs">{lap.label.name}</span>
                        </span>
                      )}
                    </div>
                    <span className="font-mono tabular-nums">
                      {formatTime(lap.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-t border-border/50 p-4 text-center text-sm text-muted-foreground">
              No laps recorded in this session
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
