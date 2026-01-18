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
import { useCreateTask, useUpdateTask, useDeleteTask } from "@/lib/hooks/use-tasks";
import { UsernameDialog } from "@/components/onboarding/username-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BarChart3, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const { data: user, isLoading: userLoading } = useUser();
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: taskList, isLoading: taskListLoading } = useTaskList(today);
  const { data: streakData } = useStreak();
  const { data: goalsData } = useGoals(today);

  const createTask = useCreateTask(today);
  const updateTask = useUpdateTask(today);
  const deleteTask = useDeleteTask(today);

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
          timeTracked="0h 0m"
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

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/calendar" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                    >
                      <Calendar className="h-4 w-4 text-blue-500" />
                      View Calendar
                    </Button>
                  </Link>
                  <Link href="/analytics" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                    >
                      <BarChart3 className="h-4 w-4 text-violet-500" />
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Motivational Card */}
            <Card className="border-border/40 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-violet-500/20 p-2">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Pro Tip</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Break large tasks into smaller ones. It&apos;s easier to
                      stay motivated when you can check things off frequently!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
