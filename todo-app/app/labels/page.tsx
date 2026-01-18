"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { LabelCard } from "@/components/labels/label-card";
import { LabelDialog } from "@/components/labels/label-dialog";
import { useLabels, useDeleteLabel } from "@/lib/hooks/use-labels";
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
import { Plus, Tags, Loader2 } from "lucide-react";
import { Label } from "@/lib/types/label";
import { toast } from "sonner";

export default function LabelsPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: labels, isLoading: labelsLoading } = useLabels();
  const deleteLabel = useDeleteLabel();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | undefined>();
  const [deletingLabel, setDeletingLabel] = useState<Label | null>(null);

  // Loading state
  if (userLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // Auth check
  if (!user) {
    return <UsernameDialog open={true} />;
  }

  const handleEdit = (label: Label) => {
    setEditingLabel(label);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingLabel) return;

    try {
      await deleteLabel.mutateAsync(deletingLabel.id);
      toast.success("Label deleted");
      setDeletingLabel(null);
    } catch {
      toast.error("Failed to delete label");
    }
  };

  const handleCreateNew = () => {
    setEditingLabel(undefined);
    setDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Labels</h1>
            <p className="text-sm text-muted-foreground">
              Organize your tasks with custom labels
            </p>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            New Label
          </Button>
        </div>

        {/* Labels List */}
        {labelsLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : labels && labels.length > 0 ? (
          <div className="space-y-3">
            {labels.map((label) => (
              <LabelCard
                key={label.id}
                label={label}
                onEdit={() => handleEdit(label)}
                onDelete={() => setDeletingLabel(label)}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Tags className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No labels yet</h3>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Create labels to categorize and organize your tasks.
            </p>
            <Button onClick={handleCreateNew} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Label
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <LabelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        label={editingLabel}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingLabel}
        onOpenChange={(open) => !open && setDeletingLabel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Label</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingLabel?.name}&quot;? This
              will remove the label from all tasks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLabel.isPending ? (
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
