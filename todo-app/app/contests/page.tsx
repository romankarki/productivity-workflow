"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ContestCard } from "@/components/contests/contest-card";
import { ContestDialog } from "@/components/contests/contest-dialog";
import { useContests, useDeleteContest } from "@/lib/hooks/use-contests";
import { useUser } from "@/lib/hooks/use-user";
import { UsernameDialog } from "@/components/onboarding/username-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trophy, Loader2 } from "lucide-react";
import { Contest } from "@/lib/types/contest";

export default function ContestsPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: contests, isLoading: contestsLoading } = useContests();
  const deleteContest = useDeleteContest();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContest, setEditingContest] = useState<Contest | undefined>();
  const [deletingContest, setDeletingContest] = useState<Contest | null>(null);

  const stats = useMemo(() => {
    if (!contests || contests.length === 0) return null;

    const total = contests.length;

    const ranks = contests
      .map((c) => c.rank)
      .filter((r): r is number => r != null);
    const bestRank = ranks.length > 0 ? Math.min(...ranks) : null;

    const ratingChanges = contests
      .filter((c) => c.ratingAfter != null && c.ratingBefore != null)
      .map((c) => c.ratingAfter! - c.ratingBefore!);
    const avgRatingChange =
      ratingChanges.length > 0
        ? Math.round(
            ratingChanges.reduce((a, b) => a + b, 0) / ratingChanges.length
          )
        : null;

    return { total, bestRank, avgRatingChange };
  }, [contests]);

  if (userLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <UsernameDialog open={true} />;
  }

  const handleEdit = (contest: Contest) => {
    setEditingContest(contest);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingContest) return;

    try {
      await deleteContest.mutateAsync(deletingContest.id);
      setDeletingContest(null);
    } catch {
      // handled by mutation hook
    }
  };

  const handleCreateNew = () => {
    setEditingContest(undefined);
    setDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Contests</h1>
            <p className="text-sm text-muted-foreground">
              Track your LeetCode contest performance
            </p>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Contest
          </Button>
        </div>

        {/* Summary Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border/40 bg-card/50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Total
              </p>
              <p className="mt-1 text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-card/50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Best Rank
              </p>
              <p className="mt-1 text-2xl font-bold">
                {stats.bestRank != null ? `#${stats.bestRank}` : "-"}
              </p>
            </div>
            <div className="rounded-lg border border-border/40 bg-card/50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Avg Rating
              </p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  stats.avgRatingChange != null
                    ? stats.avgRatingChange > 0
                      ? "text-emerald-400"
                      : stats.avgRatingChange < 0
                        ? "text-destructive"
                        : ""
                    : ""
                }`}
              >
                {stats.avgRatingChange != null
                  ? `${stats.avgRatingChange > 0 ? "+" : ""}${stats.avgRatingChange}`
                  : "-"}
              </p>
            </div>
          </div>
        )}

        {/* Contest List */}
        {contestsLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : contests && contests.length > 0 ? (
          <div className="space-y-3">
            {contests.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                onEdit={() => handleEdit(contest)}
                onDelete={() => setDeletingContest(contest)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No contests yet</h3>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Start tracking your LeetCode contest performance.
            </p>
            <Button onClick={handleCreateNew} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Contest
            </Button>
          </div>
        )}
      </div>

      <ContestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        contest={editingContest}
      />

      <AlertDialog
        open={!!deletingContest}
        onOpenChange={(open) => !open && setDeletingContest(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingContest?.contestName}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteContest.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
