"use client";

import { LabelFilter } from "@/components/labels/label-filter";

interface TaskFiltersProps {
  selectedLabelIds: string[];
  onToggleLabel: (labelId: string) => void;
  onClearFilters: () => void;
}

export function TaskFilters({
  selectedLabelIds,
  onToggleLabel,
  onClearFilters,
}: TaskFiltersProps) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
      <LabelFilter
        selectedLabelIds={selectedLabelIds}
        onToggle={onToggleLabel}
        onClear={onClearFilters}
      />
    </div>
  );
}
