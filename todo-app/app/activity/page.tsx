"use client";

import { useState, useEffect } from "react";
import { ScrollText } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { RecentActivity } from "@/components/activity/recent-activity";
import { useUser } from "@/lib/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityPage() {
  const [mounted, setMounted] = useState(false);
  const { data: user, isLoading: userLoading } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || userLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="mb-1 h-7 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-3xl text-center py-12">
            <p className="text-muted-foreground">
              Please create an account first
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ScrollText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Recent Activity</h1>
              <p className="text-sm text-muted-foreground">
                Your last 14 days of tasks, notes, and wins
              </p>
            </div>
          </div>

          <RecentActivity />
        </div>
      </div>
    </MainLayout>
  );
}
