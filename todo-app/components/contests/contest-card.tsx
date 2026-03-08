"use client";

import { Contest } from "@/lib/types/contest";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Trophy,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";

interface ContestCardProps {
  contest: Contest;
  onEdit: () => void;
  onDelete: () => void;
}

export function ContestCard({ contest, onEdit, onDelete }: ContestCardProps) {
  const ratingChange =
    contest.ratingAfter != null && contest.ratingBefore != null
      ? contest.ratingAfter - contest.ratingBefore
      : null;

  const formattedDate = new Date(contest.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-lg border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{contest.contestName}</h3>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        {contest.rank != null && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="font-medium text-foreground">#{contest.rank}</span>
            rank
          </div>
        )}
        {contest.problemsSolved != null && (
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground">
              {contest.problemsSolved}
              {contest.totalProblems != null && `/${contest.totalProblems}`}
            </span>{" "}
            solved
          </div>
        )}
        {contest.score != null && (
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground">{contest.score}</span>{" "}
            pts
          </div>
        )}
        {contest.finishTime && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {contest.finishTime}
          </div>
        )}
        {ratingChange != null && (
          <div
            className={`flex items-center gap-1 font-medium ${
              ratingChange > 0
                ? "text-emerald-400"
                : ratingChange < 0
                  ? "text-destructive"
                  : "text-muted-foreground"
            }`}
          >
            {ratingChange > 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : ratingChange < 0 ? (
              <TrendingDown className="h-3.5 w-3.5" />
            ) : null}
            {ratingChange > 0 ? "+" : ""}
            {ratingChange}
          </div>
        )}
      </div>

      {contest.notes && (
        <p className="mt-2 text-sm text-muted-foreground">{contest.notes}</p>
      )}
    </div>
  );
}
