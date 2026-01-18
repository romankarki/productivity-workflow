"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserId } from "./use-user";

interface GoalData {
  weekly: {
    goal: number | null;
    completed: number;
    total: number;
  };
  monthly: {
    goal: number | null;
    completed: number;
    total: number;
  };
}

async function fetchGoals(date: string): Promise<GoalData> {
  const userId = getUserId();

  if (!userId) {
    return {
      weekly: { goal: null, completed: 0, total: 0 },
      monthly: { goal: null, completed: 0, total: 0 },
    };
  }

  const response = await fetch(`/api/goals?date=${date}`, {
    headers: { "x-user-id": userId },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch goals");
  }

  return response.json();
}

async function updateGoals(data: {
  date: string;
  weeklyGoal?: number;
  monthlyGoal?: number;
}) {
  const userId = getUserId();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const response = await fetch("/api/goals", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update goals");
  }

  return response.json();
}

export function useGoals(date: string) {
  return useQuery({
    queryKey: ["goals", date],
    queryFn: () => fetchGoals(date),
    staleTime: 30 * 1000,
  });
}

export function useUpdateGoals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGoals,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goals", variables.date] });
    },
  });
}
