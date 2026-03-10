"use client";

import { LabelFilter } from "@/components/labels/label-filter";
import { Button } from "@/components/ui/button";
import { Layers, Tags } from "lucide-react";
import { cn } from "@/lib/utils";

// Supported grouping modes for the task list
export type GroupByMode = "status" | "label";

interface TaskFiltersProps {
  selectedLabelIds: string[];
  onToggleLabel: (labelId: string) => void;
  onClearFilters: () => void;
  groupBy?: GroupByMode;
  onGroupByChange?: (mode: GroupByMode) => void;
}

export function TaskFilters({
  selectedLabelIds,
  onToggleLabel,
  onClearFilters,
  groupBy = "status",
  onGroupByChange,
}: TaskFiltersProps) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/30 p-3 space-y-3">
      {/* Top row: label filters + group-by toggle */}
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 overflow-hidden">
          <LabelFilter
            selectedLabelIds={selectedLabelIds}
            onToggle={onToggleLabel}
            onClear={onClearFilters}
          />
        </div>

        {/* Group-by toggle pills */}
        {onGroupByChange && (
          <div className="ml-auto flex items-center shrink-0 rounded-lg border border-border/40 bg-muted/40 p-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onGroupByChange("status")}
              className={cn(
                "h-7 gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all",
                groupBy === "status"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              Status
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onGroupByChange("label")}
              className={cn(
                "h-7 gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all",
                groupBy === "label"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Tags className="h-3.5 w-3.5" />
              Labels
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

