"use client";

import { Label } from "@/lib/types/label";
import { LabelBadge } from "./label-badge";
import { cn } from "@/lib/utils";

interface LabelListProps {
  labels: Label[];
  size?: "sm" | "md";
  max?: number;
  onRemove?: (labelId: string) => void;
  onClick?: (labelId: string) => void;
  className?: string;
}

export function LabelList({
  labels,
  size = "sm",
  max,
  onRemove,
  onClick,
  className,
}: LabelListProps) {
  if (labels.length === 0) return null;

  const visibleLabels = max ? labels.slice(0, max) : labels;
  const hiddenCount = max ? Math.max(0, labels.length - max) : 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {visibleLabels.map((label) => (
        <LabelBadge
          key={label.id}
          label={label}
          size={size}
          removable={!!onRemove}
          onRemove={onRemove ? () => onRemove(label.id) : undefined}
          onClick={onClick ? () => onClick(label.id) : undefined}
        />
      ))}
      {hiddenCount > 0 && (
        <span
          className={cn(
            "text-muted-foreground",
            size === "sm" && "text-[10px]",
            size === "md" && "text-xs"
          )}
        >
          +{hiddenCount} more
        </span>
      )}
    </div>
  );
}
