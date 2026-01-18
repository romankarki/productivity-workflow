"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserId } from "./use-user";
import { StopwatchWithTask } from "@/lib/types/stopwatch";

async function fetchActiveStopwatch(): Promise<StopwatchWithTask | null> {
  const userId = getUserId();
  if (!userId) return null;

  const response = await fetch("/api/stopwatches", {
    headers: { "x-user-id": userId },
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.stopwatch || null;
}

export function useActiveStopwatch() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["activeStopwatch"],
    queryFn: fetchActiveStopwatch,
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      // Poll more frequently when stopwatch is active
      return query.state.data?.isActive ? 5000 : false;
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["activeStopwatch"] });
  };

  return {
    ...query,
    invalidate,
  };
}
