"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Loader2 } from "lucide-react";
import { useGoals, useUpdateGoals } from "@/lib/hooks/use-goals";
import { GoalProgress } from "./goal-progress";
import { toast } from "sonner";
import { format } from "date-fns";

interface GoalDialogProps {
  date: Date;
}

export function GoalDialog({ date }: GoalDialogProps) {
  const dateStr = format(date, "yyyy-MM-dd");
  const { data: goals, isLoading } = useGoals(dateStr);
  const updateGoals = useUpdateGoals();

  const [open, setOpen] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState<string>("");
  const [monthlyGoal, setMonthlyGoal] = useState<string>("");

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && goals) {
      setWeeklyGoal(goals.weekly.goal?.toString() || "");
      setMonthlyGoal(goals.monthly.goal?.toString() || "");
    }
    setOpen(isOpen);
  };

  const handleSave = async () => {
    try {
      await updateGoals.mutateAsync({
        date: dateStr,
        weeklyGoal: weeklyGoal ? parseInt(weeklyGoal) : undefined,
        monthlyGoal: monthlyGoal ? parseInt(monthlyGoal) : undefined,
      });
      toast.success("Goals updated");
      setOpen(false);
    } catch {
      toast.error("Failed to update goals");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Target className="h-4 w-4" />
          Goals
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Your Goals</DialogTitle>
          <DialogDescription>
            Set weekly and monthly task completion goals to stay motivated.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Weekly Goal */}
            <div className="space-y-3">
              <GoalProgress
                title="Weekly Progress"
                goal={goals?.weekly.goal || null}
                completed={goals?.weekly.completed || 0}
                total={goals?.weekly.total || 0}
                variant="weekly"
              />
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Weekly Goal:</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="e.g., 20"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">tasks</span>
              </div>
            </div>

            {/* Monthly Goal */}
            <div className="space-y-3">
              <GoalProgress
                title="Monthly Progress"
                goal={goals?.monthly.goal || null}
                completed={goals?.monthly.completed || 0}
                total={goals?.monthly.total || 0}
                variant="monthly"
              />
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Monthly Goal:</label>
                <Input
                  type="number"
                  min="1"
                  max="500"
                  placeholder="e.g., 80"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">tasks</span>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={updateGoals.isPending}
              className="w-full"
            >
              {updateGoals.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Goals"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
