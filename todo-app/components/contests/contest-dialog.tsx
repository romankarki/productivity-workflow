"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Contest } from "@/lib/types/contest";
import {
  useCreateContest,
  useUpdateContest,
} from "@/lib/hooks/use-contests";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ContestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contest?: Contest;
}

export function ContestDialog({
  open,
  onOpenChange,
  contest,
}: ContestDialogProps) {
  const [contestName, setContestName] = useState("");
  const [date, setDate] = useState("");
  const [rank, setRank] = useState("");
  const [score, setScore] = useState("");
  const [ratingBefore, setRatingBefore] = useState("");
  const [ratingAfter, setRatingAfter] = useState("");
  const [problemsSolved, setProblemsSolved] = useState("");
  const [totalProblems, setTotalProblems] = useState("");
  const [finishTime, setFinishTime] = useState("");
  const [notes, setNotes] = useState("");

  const createContest = useCreateContest();
  const updateContest = useUpdateContest();

  const isEditing = !!contest;
  const isPending = createContest.isPending || updateContest.isPending;

  useEffect(() => {
    if (open) {
      if (contest) {
        setContestName(contest.contestName);
        setDate(contest.date.slice(0, 10));
        setRank(contest.rank?.toString() ?? "");
        setScore(contest.score?.toString() ?? "");
        setRatingBefore(contest.ratingBefore?.toString() ?? "");
        setRatingAfter(contest.ratingAfter?.toString() ?? "");
        setProblemsSolved(contest.problemsSolved?.toString() ?? "");
        setTotalProblems(contest.totalProblems?.toString() ?? "");
        setFinishTime(contest.finishTime ?? "");
        setNotes(contest.notes ?? "");
      } else {
        setContestName("");
        setDate(new Date().toISOString().slice(0, 10));
        setRank("");
        setScore("");
        setRatingBefore("");
        setRatingAfter("");
        setProblemsSolved("");
        setTotalProblems("");
        setFinishTime("");
        setNotes("");
      }
    }
  }, [open, contest]);

  const parseIntOrNull = (val: string): number | null => {
    const n = parseInt(val, 10);
    return isNaN(n) ? null : n;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contestName.trim()) {
      toast.error("Contest name is required");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }

    const payload = {
      contestName: contestName.trim(),
      date,
      rank: parseIntOrNull(rank),
      score: parseIntOrNull(score),
      ratingBefore: parseIntOrNull(ratingBefore),
      ratingAfter: parseIntOrNull(ratingAfter),
      problemsSolved: parseIntOrNull(problemsSolved),
      totalProblems: parseIntOrNull(totalProblems),
      finishTime: finishTime.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      if (isEditing) {
        await updateContest.mutateAsync({ id: contest.id, data: payload });
      } else {
        await createContest.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {
      // handled by mutation hooks
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Contest" : "Add Contest"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your contest entry."
              : "Log a LeetCode contest performance."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Contest Name</label>
            <Input
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
              placeholder="e.g., Weekly Contest 430"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rank</label>
              <Input
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g., 1500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Score</label>
              <Input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="e.g., 18"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Finish Time</label>
              <Input
                value={finishTime}
                onChange={(e) => setFinishTime(e.target.value)}
                placeholder="e.g., 1:23:45"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Problems Solved</label>
              <Input
                type="number"
                value={problemsSolved}
                onChange={(e) => setProblemsSolved(e.target.value)}
                placeholder="e.g., 3"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Problems</label>
              <Input
                type="number"
                value={totalProblems}
                onChange={(e) => setTotalProblems(e.target.value)}
                placeholder="e.g., 4"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating Before</label>
              <Input
                type="number"
                value={ratingBefore}
                onChange={(e) => setRatingBefore(e.target.value)}
                placeholder="e.g., 1600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating After</label>
              <Input
                type="number"
                value={ratingAfter}
                onChange={(e) => setRatingAfter(e.target.value)}
                placeholder="e.g., 1650"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reflections, strategies, areas to improve..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : isEditing ? (
                "Update Contest"
              ) : (
                "Add Contest"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
