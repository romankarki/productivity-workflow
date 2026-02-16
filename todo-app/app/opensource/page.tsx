"use client";

import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RepoInput } from "@/components/opensource/repo-input";
import { RepoCard } from "@/components/opensource/repo-card";
import { ActivityFeed } from "@/components/opensource/activity-feed";
import {
  useTrackedRepos,
  useAddRepo,
  useRemoveRepo,
  useRepoActivity,
} from "@/lib/hooks/use-repos";
import { useUser } from "@/lib/hooks/use-user";
import { UsernameDialog } from "@/components/onboarding/username-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Github, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function OpenSourcePage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: repos = [], isLoading: reposLoading } = useTrackedRepos();
  const { data: activity = [], isLoading: activityLoading, isFetching } = useRepoActivity();
  const addRepo = useAddRepo();
  const removeRepo = useRemoveRepo();
  const queryClient = useQueryClient();

  if (userLoading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <UsernameDialog open={true} />;
  }

  const handleAddRepo = async (owner: string, name: string) => {
    await addRepo.mutateAsync({ owner, name });
    toast.success(`Now tracking ${owner}/${name}`);
  };

  const handleRemoveRepo = (id: string) => {
    const repo = repos.find((r) => r.id === id);
    removeRepo.mutate(id, {
      onSuccess: () => toast.success(`Removed ${repo?.owner}/${repo?.name}`),
      onError: () => toast.error("Failed to remove repo"),
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["repoActivity"] });
    toast.success("Refreshing activity...");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Open Source Monitor</h1>
          <p className="text-sm text-muted-foreground">
            Track repos, read issues and PRs without leaving the app.
          </p>
        </div>

        {/* Add repo input */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Github className="h-4 w-4" />
              Add Repository
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RepoInput onAdd={handleAddRepo} isLoading={addRepo.isPending} />
          </CardContent>
        </Card>

        {/* Repo cards grid */}
        {reposLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : repos.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                onRemove={handleRemoveRepo}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/40 py-12 text-center">
            <Github className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              No repos tracked yet. Add one above to start monitoring.
            </p>
          </div>
        )}

        {/* Recent activity -- capped at 6 items */}
        {repos.length > 0 && (
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isFetching}
                className="h-7 gap-1.5 text-xs"
              >
                <RefreshCw
                  className={cn("h-3 w-3", isFetching && "animate-spin")}
                />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <ActivityFeed
                activity={activity.slice(0, 6)}
                isLoading={activityLoading}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
