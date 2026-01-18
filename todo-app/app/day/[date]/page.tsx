"use client";

import { use, useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { DayHeader } from "@/components/tasks/day-header";
import { TaskList } from "@/components/tasks/task-list";
import { TaskInput } from "@/components/tasks/task-input";
import { TaskFilters } from "@/components/tasks/task-filters";
import { useUser } from "@/lib/hooks/use-user";
import { useTaskList } from "@/lib/hooks/use-tasklist";
import { useCreateTask, useUpdateTask, useDeleteTask, useReorderTask } from "@/lib/hooks/use-tasks";
import { UsernameDialog } from "@/components/onboarding/username-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface DayPageProps {
  params: Promise<{ date: string }>;
}

export default function DayPage({ params }: DayPageProps) {
  const { date } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const { data: user, isLoading: userLoading } = useUser();
  const { data: taskList, isLoading: taskListLoading } = useTaskList(date);

  const createTask = useCreateTask(date);
  const updateTask = useUpdateTask(date);
  const deleteTask = useDeleteTask(date);
  const reorderTask = useReorderTask(date);

  // Get filter from URL
  const labelFilters = searchParams.get("labels")?.split(",").filter(Boolean) || [];

  const handleToggleLabelFilter = (labelId: string) => {
    const newFilters = labelFilters.includes(labelId)
      ? labelFilters.filter((id) => id !== labelId)
      : [...labelFilters, labelId];
    
    const params = new URLSearchParams(searchParams);
    if (newFilters.length > 0) {
      params.set("labels", newFilters.join(","));
    } else {
      params.delete("labels");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("labels");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Filter tasks by selected labels
  const filteredTasks = useMemo(() => {
    if (!taskList?.tasks || labelFilters.length === 0) {
      return taskList?.tasks || [];
    }
    // For now, we'll need to filter on the client side
    // In a real app, this would ideally be done server-side
    return taskList.tasks;
  }, [taskList?.tasks, labelFilters]);

  // Show loading while checking user
  if (userLoading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto h-6 w-48" />
          <div className="mt-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show onboarding if no user
  if (!user) {
    return <UsernameDialog open={true} />;
  }

  const handleCreateTask = async (title: string) => {
    if (!taskList) return;

    try {
      await createTask.mutateAsync({
        taskListId: taskList.id,
        data: { title },
      });
      toast.success("Task added");
    } catch (error) {
      toast.error("Failed to create task");
      throw error;
    }
  };

  const handleUpdateTask = (
    id: string,
    data: { title?: string; completed?: boolean }
  ) => {
    updateTask.mutate(
      { id, data },
      {
        onSuccess: () => {
          if (data.completed !== undefined) {
            toast.success(data.completed ? "Task completed! 🎉" : "Task uncompleted");
          }
        },
        onError: () => {
          toast.error("Failed to update task");
        },
      }
    );
  };

  const handleDeleteTask = (id: string) => {
    deleteTask.mutate(id, {
      onSuccess: () => {
        toast.success("Task deleted");
      },
      onError: () => {
        toast.error("Failed to delete task");
      },
    });
  };

  const handleReorderTask = (id: string, newOrder: number) => {
    reorderTask.mutate(
      { id, order: newOrder },
      {
        onError: () => {
          toast.error("Failed to reorder task");
        },
      }
    );
  };

  return (
    <MainLayout>
      <DayHeader date={date} />

      {/* Filters */}
      <div className="mb-4">
        <TaskFilters
          selectedLabelIds={labelFilters}
          onToggleLabel={handleToggleLabelFilter}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Task List Area */}
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardContent className="p-6">
          <TaskList
            tasks={filteredTasks}
            isLoading={taskListLoading}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onReorderTask={handleReorderTask}
            filterLabelIds={labelFilters}
          />

          {/* Task Input */}
          {!taskListLoading && taskList && (
            <div className="mt-4 border-t border-border/40 pt-4">
              <TaskInput
                onSubmit={handleCreateTask}
                isLoading={createTask.isPending}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
