"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserId } from "./use-user";
import { Lap, Stopwatch, StopwatchWithTask } from "@/lib/types/stopwatch";

interface UseStopwatchReturn {
  // State
  isRunning: boolean;
  isPaused: boolean;
  isStopped: boolean;
  elapsedTime: number; // milliseconds
  laps: Lap[];
  stopwatch: StopwatchWithTask | null;

  // Actions
  start: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  addLap: (labelId?: string) => Promise<void>;
  reset: () => void;

  // Status
  isLoading: boolean;
  error: Error | null;
}

async function fetchStopwatch(taskId: string): Promise<StopwatchWithTask | null> {
  const userId = getUserId();
  if (!userId) return null;

  // Get the latest stopwatch for this task
  const response = await fetch(`/api/tasks/${taskId}/stopwatches`, {
    headers: { "x-user-id": userId },
  });

  if (!response.ok) return null;

  const data = await response.json();
  // Get the most recent active or latest stopwatch
  const active = data.stopwatches?.find((sw: Stopwatch) => sw.isActive);
  if (active) return active;

  // Return the latest one if any exists and is not ended
  const latest = data.stopwatches?.[0];
  return latest && !latest.endTime ? latest : null;
}

async function createStopwatch(taskId: string): Promise<StopwatchWithTask> {
  const userId = getUserId();
  if (!userId) throw new Error("Not authenticated");

  const response = await fetch("/api/stopwatches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify({ taskId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create stopwatch");
  }

  const data = await response.json();
  return data.stopwatch;
}

async function updateStopwatch(
  stopwatchId: string,
  action: "pause" | "resume" | "stop"
): Promise<StopwatchWithTask> {
  const userId = getUserId();
  if (!userId) throw new Error("Not authenticated");

  const response = await fetch(`/api/stopwatches/${stopwatchId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update stopwatch");
  }

  const data = await response.json();
  return data.stopwatch;
}

async function createLap(
  stopwatchId: string,
  labelId?: string
): Promise<Lap> {
  const userId = getUserId();
  if (!userId) throw new Error("Not authenticated");

  const response = await fetch(`/api/stopwatches/${stopwatchId}/laps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify({ labelId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create lap");
  }

  const data = await response.json();
  return data.lap;
}

export function useStopwatch(taskId: string): UseStopwatchReturn {
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  // Fetch existing stopwatch for task
  const { data: stopwatch, isLoading } = useQuery({
    queryKey: ["stopwatch", taskId],
    queryFn: () => fetchStopwatch(taskId),
    enabled: !!taskId,
    refetchOnWindowFocus: true,
  });

  // Calculate elapsed time from stopwatch state
  const calculateElapsedTime = useCallback((sw: StopwatchWithTask | null) => {
    if (!sw) return 0;

    let elapsed = sw.totalDuration;
    if (sw.isActive) {
      const startTime = new Date(sw.startTime).getTime();
      elapsed += Date.now() - startTime;
    }
    return elapsed;
  }, []);

  // Update elapsed time based on stopwatch state
  useEffect(() => {
    if (stopwatch?.isActive) {
      // Start interval for real-time updates
      setElapsedTime(calculateElapsedTime(stopwatch));
      
      intervalRef.current = setInterval(() => {
        setElapsedTime(calculateElapsedTime(stopwatch));
      }, 100);
    } else {
      // Clear interval and set final time
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setElapsedTime(calculateElapsedTime(stopwatch ?? null));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stopwatch, calculateElapsedTime]);

  // Mutations
  const startMutation = useMutation({
    mutationFn: () => createStopwatch(taskId),
    onSuccess: (data) => {
      queryClient.setQueryData(["stopwatch", taskId], data);
      queryClient.invalidateQueries({ queryKey: ["activeStopwatch"] });
    },
    onError: (err: Error) => setError(err),
  });

  const updateMutation = useMutation({
    mutationFn: ({ action }: { action: "pause" | "resume" | "stop" }) =>
      updateStopwatch(stopwatch!.id, action),
    onSuccess: (data) => {
      queryClient.setQueryData(["stopwatch", taskId], data);
      queryClient.invalidateQueries({ queryKey: ["activeStopwatch"] });
    },
    onError: (err: Error) => setError(err),
  });

  const lapMutation = useMutation({
    mutationFn: (labelId?: string) => createLap(stopwatch!.id, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stopwatch", taskId] });
    },
    onError: (err: Error) => setError(err),
  });

  // Actions
  const start = useCallback(async () => {
    setError(null);
    await startMutation.mutateAsync();
  }, [startMutation]);

  const pause = useCallback(async () => {
    if (!stopwatch) return;
    setError(null);
    await updateMutation.mutateAsync({ action: "pause" });
  }, [stopwatch, updateMutation]);

  const resume = useCallback(async () => {
    if (!stopwatch) return;
    setError(null);
    await updateMutation.mutateAsync({ action: "resume" });
  }, [stopwatch, updateMutation]);

  const stop = useCallback(async () => {
    if (!stopwatch) return;
    setError(null);
    await updateMutation.mutateAsync({ action: "stop" });
  }, [stopwatch, updateMutation]);

  const addLap = useCallback(
    async (labelId?: string) => {
      if (!stopwatch?.isActive) return;
      setError(null);
      await lapMutation.mutateAsync(labelId);
    },
    [stopwatch, lapMutation]
  );

  const reset = useCallback(() => {
    setElapsedTime(0);
    setError(null);
    queryClient.setQueryData(["stopwatch", taskId], null);
  }, [queryClient, taskId]);

  // Determine states
  const isRunning = !!stopwatch?.isActive;
  const isPaused = !!stopwatch && !stopwatch.isActive && !stopwatch.endTime;
  const isStopped = !!stopwatch?.endTime;

  return {
    isRunning,
    isPaused,
    isStopped,
    elapsedTime,
    laps: stopwatch?.laps || [],
    stopwatch: stopwatch ?? null,
    start,
    pause,
    resume,
    stop,
    addLap,
    reset,
    isLoading:
      isLoading ||
      startMutation.isPending ||
      updateMutation.isPending ||
      lapMutation.isPending,
    error,
  };
}
