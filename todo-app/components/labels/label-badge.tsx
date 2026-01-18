"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/lib/types/label";
import { X } from "lucide-react";

interface LabelBadgeProps {
  label: Label;
  size?: "sm" | "md";
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}

export function LabelBadge({
  label,
  size = "sm",
  removable = false,
  onRemove,
  onClick,
}: LabelBadgeProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-1 text-xs",
        onClick && "cursor-pointer hover:opacity-80"
      )}
      style={{
        backgroundColor: `${label.color}20`,
        color: label.color,
        border: `1px solid ${label.color}40`,
      }}
    >
      <span
        className={cn(
          "rounded-full",
          size === "sm" && "h-1.5 w-1.5",
          size === "md" && "h-2 w-2"
        )}
        style={{ backgroundColor: label.color }}
      />
      {label.name}
      {removable && (
        <button
          onClick={handleRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
        >
          <X className={cn(size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3")} />
        </button>
      )}
    </span>
  );
}
