"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserId } from "@/lib/hooks/use-user";
import { Stopwatch } from "@/lib/types/stopwatch";
import { SessionCard } from "./session-card";
import { formatTime } from "./time-display";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, History } from "lucide-react";

interface StopwatchHistoryProps {
  taskId: string;
  maxHeight?: string;
}

interface HistoryData {
  stopwatches: Stopwatch[];
  totalTimeTracked: number;
  sessionCount: number;
}

async function fetchHistory(taskId: string): Promise<HistoryData> {
  const userId = getUserId();
  if (!userId) {
    return { stopwatches: [], totalTimeTracked: 0, sessionCount: 0 };
  }

  const response = await fetch(`/api/tasks/${taskId}/stopwatches`, {
    headers: { "x-user-id": userId },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  return response.json();
}

export function StopwatchHistory({
  taskId,
  maxHeight = "400px",
}: StopwatchHistoryProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stopwatchHistory", taskId],
    queryFn: () => fetchHistory(taskId),
    enabled: !!taskId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
        Failed to load history
      </div>
    );
  }

  const sessions = data?.stopwatches.filter((sw) => sw.endTime) || [];
  const totalTime = data?.totalTimeTracked || 0;

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <History className="h-12 w-12 mb-3 opacity-40" />
        <p className="text-sm font-medium">No time tracked yet</p>
        <p className="text-xs">Start the stopwatch to begin tracking</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20">
            <Clock className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Time Tracked</p>
            <p className="font-mono text-xl font-bold tabular-nums">
              {formatTime(totalTime)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{sessions.length}</p>
          <p className="text-xs text-muted-foreground">
            session{sessions.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Session List */}
      <ScrollArea style={{ maxHeight }} className="pr-4">
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
