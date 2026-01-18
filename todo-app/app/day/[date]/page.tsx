"use client";

import { use } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DayHeader } from "@/components/tasks/day-header";
import { useUser } from "@/lib/hooks/use-user";
import { useTaskList } from "@/lib/hooks/use-tasklist";
import { UsernameDialog } from "@/components/onboarding/username-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

interface DayPageProps {
  params: Promise<{ date: string }>;
}

export default function DayPage({ params }: DayPageProps) {
  const { date } = use(params);
  const { data: user, isLoading: userLoading } = useUser();
  const { data: taskList, isLoading: taskListLoading } = useTaskList(date);

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

  return (
    <MainLayout>
      <DayHeader date={date} />

      {/* Task List Area */}
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardContent className="p-6">
          {taskListLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : taskList?.tasks && taskList.tasks.length > 0 ? (
            <div className="space-y-2">
              {/* Task list will be rendered here */}
              <p className="text-muted-foreground">
                {taskList.tasks.length} task(s) - Task components coming next!
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted/50 p-4">
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No tasks yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first task to get started
              </p>
            </div>
          )}

          {/* Task Input Placeholder */}
          <div className="mt-4 border-t border-border/40 pt-4">
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-border/60 bg-muted/20 px-4 py-3 text-muted-foreground">
              <span className="text-lg">+</span>
              <span className="text-sm">Add a task... (coming soon)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
