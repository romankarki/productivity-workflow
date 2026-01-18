"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, CreateTaskInput, UpdateTaskInput, TaskList } from "@/lib/types/task";
import { getUserId } from "./use-user";
import { toastActions } from "./use-toast-actions";

// Create a new task
async function createTask(
  taskListId: string,
  data: CreateTaskInput
): Promise<Task> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/tasklists/${taskListId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create task");
  }

  const result = await response.json();
  return result.task;
}

// Update a task
async function updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update task");
  }

  const result = await response.json();
  return result.task;
}

// Delete a task
async function deleteTask(id: string): Promise<void> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: { "x-user-id": userId },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete task");
  }
}

// Update task order
async function updateTaskOrder(
  id: string,
  order: number,
  taskListId?: string
): Promise<Task> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/tasks/${id}/order`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify({ order, taskListId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update task order");
  }

  const result = await response.json();
  return result.task;
}

// Hook to create a task
export function useCreateTask(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskListId,
      data,
    }: {
      taskListId: string;
      data: CreateTaskInput;
    }) => createTask(taskListId, data),
    onMutate: async ({ taskListId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["taskList", date] });

      // Snapshot previous value
      const previousTaskList = queryClient.getQueryData<TaskList>([
        "taskList",
        date,
      ]);

      // Optimistically update
      if (previousTaskList) {
        const optimisticTask: Task = {
          id: `temp-${Date.now()}`,
          taskListId,
          title: data.title,
          description: data.description || null,
          completed: false,
          order: previousTaskList.tasks?.length || 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        queryClient.setQueryData<TaskList>(["taskList", date], {
          ...previousTaskList,
          tasks: [...(previousTaskList.tasks || []), optimisticTask],
        });
      }

      return { previousTaskList };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousTaskList) {
        queryClient.setQueryData(["taskList", date], context.previousTaskList);
      }
      toastActions.error("Failed to create task");
    },
    onSuccess: () => {
      toastActions.taskCreated();
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["taskList", date] });
    },
  });
}

// Hook to update a task
export function useUpdateTask(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["taskList", date] });

      const previousTaskList = queryClient.getQueryData<TaskList>([
        "taskList",
        date,
      ]);

      if (previousTaskList?.tasks) {
        queryClient.setQueryData<TaskList>(["taskList", date], {
          ...previousTaskList,
          tasks: previousTaskList.tasks.map((task) =>
            task.id === id ? { ...task, ...data } : task
          ),
        });
      }

      return { previousTaskList };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTaskList) {
        queryClient.setQueryData(["taskList", date], context.previousTaskList);
      }
      toastActions.error("Failed to update task");
    },
    onSuccess: (task, { data }) => {
      // Show special toast for completion
      if (data.completed === true) {
        toastActions.taskCompleted();
      } else if (data.completed === false) {
        toastActions.taskUncompleted();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["taskList", date] });
    },
  });
}

// Hook to delete a task
export function useDeleteTask(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["taskList", date] });

      const previousTaskList = queryClient.getQueryData<TaskList>([
        "taskList",
        date,
      ]);

      if (previousTaskList?.tasks) {
        queryClient.setQueryData<TaskList>(["taskList", date], {
          ...previousTaskList,
          tasks: previousTaskList.tasks.filter((task) => task.id !== id),
        });
      }

      return { previousTaskList };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTaskList) {
        queryClient.setQueryData(["taskList", date], context.previousTaskList);
      }
      toastActions.error("Failed to delete task");
    },
    onSuccess: () => {
      toastActions.taskDeleted();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["taskList", date] });
    },
  });
}

// Hook to reorder tasks
export function useReorderTask(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      order,
      taskListId,
    }: {
      id: string;
      order: number;
      taskListId?: string;
    }) => updateTaskOrder(id, order, taskListId),
    onMutate: async ({ id, order }) => {
      await queryClient.cancelQueries({ queryKey: ["taskList", date] });

      const previousTaskList = queryClient.getQueryData<TaskList>([
        "taskList",
        date,
      ]);

      if (previousTaskList?.tasks) {
        const tasks = [...previousTaskList.tasks];
        const taskIndex = tasks.findIndex((t) => t.id === id);

        if (taskIndex !== -1) {
          const [task] = tasks.splice(taskIndex, 1);
          tasks.splice(order, 0, task);

          // Update order numbers
          const reorderedTasks = tasks.map((t, i) => ({ ...t, order: i }));

          queryClient.setQueryData<TaskList>(["taskList", date], {
            ...previousTaskList,
            tasks: reorderedTasks,
          });
        }
      }

      return { previousTaskList };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTaskList) {
        queryClient.setQueryData(["taskList", date], context.previousTaskList);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["taskList", date] });
    },
  });
}
