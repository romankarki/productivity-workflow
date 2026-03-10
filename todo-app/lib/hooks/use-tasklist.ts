"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskList, UpdateTaskListInput } from "@/lib/types/task";
import { getUserId, clearUserId } from "./use-user";

// Fetch task list for a specific date
async function fetchTaskList(date: string): Promise<TaskList> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/tasklists/${date}`, {
    headers: { "x-user-id": userId },
  });

  if (!response.ok) {
    if (response.status === 404) {
      clearUserId();
    }
    throw new Error("Failed to fetch task list");
  }

  const data = await response.json();
  return data.taskList;
}

// Fetch all task lists for a month
async function fetchTaskLists(
  month: number,
  year: number
): Promise<TaskList[]> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(
    `/api/tasklists?month=${month}&year=${year}`,
    {
      headers: { "x-user-id": userId },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch task lists");
  }

  const data = await response.json();
  return data.taskLists;
}

// Update task list goals
async function updateTaskList(
  date: string,
  data: UpdateTaskListInput
): Promise<TaskList> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/tasklists/${date}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update task list");
  }

  const result = await response.json();
  return result.taskList;
}

// Hook to get task list for a specific date
export function useTaskList(
  date: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["taskList", date],
    queryFn: () => fetchTaskList(date),
    enabled: !!date && (options?.enabled ?? true),
  });
}

// Hook to get all task lists for a month
export function useTaskLists(month: number, year: number) {
  return useQuery({
    queryKey: ["taskLists", month, year],
    queryFn: () => fetchTaskLists(month, year),
  });
}

// Hook to update task list goals
export function useUpdateTaskList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, data }: { date: string; data: UpdateTaskListInput }) =>
      updateTaskList(date, data),
    onSuccess: (taskList, { date }) => {
      queryClient.setQueryData(["taskList", date], taskList);
    },
  });
}
