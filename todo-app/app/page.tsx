"use client";

import { format } from "date-fns";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { TodaySummary } from "@/components/dashboard/today-summary";
import { useUser } from "@/lib/hooks/use-user";
import { useTaskList } from "@/lib/hooks/use-tasklist";
import { useStreak } from "@/lib/hooks/use-streak";
import { useGoals } from "@/lib/hooks/use-goals";
import { useStopwatchContext } from "@/lib/context/stopwatch-context";
import { useCreateTask, useUpdateTask, useDeleteTask } from "@/lib/hooks/use-tasks";
import { UsernameDialog } from "@/components/onboarding/username-dialog";
import { Scratchpad } from "@/components/scratchpad/scratchpad";
import { useScratchpadPreferences } from "@/lib/hooks/use-scratchpad-preferences";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { formatTimeHuman } from "@/components/stopwatch/time-display";

export default function Home() {
  const { data: user, isLoading: userLoading } = useUser();
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: taskList, isLoading: taskListLoading } = useTaskList(today);
  const { data: streakData } = useStreak();
  const { data: goalsData } = useGoals(today);
  const { elapsedTime } = useStopwatchContext();

  const createTask = useCreateTask(today);
  const updateTask = useUpdateTask(today);
  const deleteTask = useDeleteTask(today);

  // Scratchpad preferences
  const { isExpanded: scratchpadExpanded, setIsExpanded: setScratchpadExpanded } = useScratchpadPreferences();

  // Show loading skeleton while checking user status
  if (userLoading) {
    return (
      <MainLayout>
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </MainLayout>
    );
  }

  // Show onboarding dialog if no user
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
    data: { title?: string; completed?: boolean; duration?: number }
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

  // Calculate stats
  const tasks = taskList?.tasks || [];
  const completedToday = tasks.filter((t) => t.completed).length;
  const totalToday = tasks.length;

  // Get greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, {user.username}!
          </h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats
          streak={streakData?.currentStreak || 0}
          todayCompleted={completedToday}
          todayTotal={totalToday}
          weekCompleted={goalsData?.weekly.completed || 0}
          timeTracked={formatTimeHuman(elapsedTime)}
        />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Tasks - Takes 2 columns */}
          <div className="lg:col-span-2">
            <TodaySummary
              tasks={tasks}
              taskListId={taskList?.id || null}
              isLoading={taskListLoading}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              isCreating={createTask.isPending}
            />
          </div>

          {/* Sidebar - Scratchpad & Quick Links */}
          <div className="space-y-4">
            {/* Scratchpad */}
            {!taskListLoading && taskList && (
              <Scratchpad
                taskListId={taskList.id}
                date={today}
                initialNotes={taskList.notes || ""}
                defaultExpanded={scratchpadExpanded}
                onToggle={setScratchpadExpanded}
              />
            )}

            {/* Quick Links */}
            <div className="flex gap-2">
              <Link href="/calendar" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-zinc-800/60 bg-zinc-900/50"
                  size="sm"
                >
                  <Calendar className="h-4 w-4 text-blue-400" />
                  Calendar
                </Button>
              </Link>
              <Link href="/analytics" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-zinc-800/60 bg-zinc-900/50"
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4 text-violet-400" />
                  Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
