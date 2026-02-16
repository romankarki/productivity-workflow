"use client";

import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RepoInput } from "@/components/opensource/repo-input";
import { RepoList } from "@/components/opensource/repo-list";
import { ActivityFeed } from "@/components/opensource/activity-feed";
import { useTrackedRepos, useAddRepo, useRemoveRepo, useRepoActivity } from "@/lib/hooks/use-repos";
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
          <Skeleton className="h-96" />
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
      onSuccess: () => {
        toast.success(`Removed ${repo?.owner}/${repo?.name}`);
      },
      onError: () => {
        toast.error("Failed to remove repo");
      },
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Open Source Monitor</h1>
            <p className="text-sm text-muted-foreground">
              Track commits, PRs and issues from repos you follow.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="gap-1.5"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Tracked repos management */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Github className="h-4 w-4" />
              Tracked Repositories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RepoInput onAdd={handleAddRepo} isLoading={addRepo.isPending} />
            <RepoList
              repos={repos}
              onRemove={handleRemoveRepo}
              isRemoving={removeRepo.isPending}
            />
            {repos.length === 0 && !reposLoading && (
              <p className="text-center text-sm text-muted-foreground py-4">
                No repos tracked yet. Add one above to start monitoring.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed
              activity={activity}
              isLoading={activityLoading}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
