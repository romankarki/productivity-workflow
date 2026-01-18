"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserId } from "./use-user";

interface TaskInfo {
  total: number;
  completed: number;
}

interface CalendarData {
  taskData: Record<string, TaskInfo>;
}

async function fetchCalendarData(
  month: number,
  year: number
): Promise<CalendarData> {
  const userId = getUserId();

  if (!userId) {
    return { taskData: {} };
  }

  const response = await fetch(
    `/api/tasklists?month=${month}&year=${year}`,
    {
      headers: { "x-user-id": userId },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch calendar data");
  }

  const data = await response.json();
  const taskData: Record<string, TaskInfo> = {};

  // Transform task lists into task data by date
  for (const taskList of data.taskLists || []) {
    const dateStr = new Date(taskList.date).toISOString().split("T")[0];
    
    // Fetch full task list to get completion info
    const detailResponse = await fetch(`/api/tasklists/${dateStr}`, {
      headers: { "x-user-id": userId },
    });
    
    if (detailResponse.ok) {
      const detailData = await detailResponse.json();
      const tasks = detailData.taskList?.tasks || [];
      taskData[dateStr] = {
        total: tasks.length,
        completed: tasks.filter((t: { completed: boolean }) => t.completed).length,
      };
    }
  }

  return { taskData };
}

export function useCalendarData(month: number, year: number) {
  return useQuery({
    queryKey: ["calendarData", month, year],
    queryFn: () => fetchCalendarData(month, year),
    staleTime: 30 * 1000, // 30 seconds
  });
}
