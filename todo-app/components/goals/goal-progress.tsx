"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface GoalProgressProps {
  title: string;
  goal: number | null;
  completed: number;
  total: number;
  variant?: "weekly" | "monthly";
}

export function GoalProgress({
  title,
  goal,
  completed,
  total,
  variant = "weekly",
}: GoalProgressProps) {
  const hasGoal = goal !== null && goal > 0;
  const percentage = hasGoal ? Math.min((completed / goal) * 100, 100) : 0;
  const isComplete = hasGoal && completed >= goal;

  const gradientClasses = {
    weekly: "from-violet-500 to-purple-500",
    monthly: "from-blue-500 to-cyan-500",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        {hasGoal ? (
          <span className="text-sm text-muted-foreground">
            {completed}/{goal} tasks
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">No goal set</span>
        )}
      </div>

      {hasGoal && (
        <>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                gradientClasses[variant],
                isComplete && "animate-pulse"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{Math.round(percentage)}% complete</span>
            {isComplete && (
              <span className="font-medium text-emerald-500">Goal reached! 🎉</span>
            )}
          </div>
        </>
      )}

      {!hasGoal && (
        <div className="h-2 w-full rounded-full bg-muted/50" />
      )}
    </div>
  );
}
