"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TaskCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function TaskCheckbox({
  checked,
  onChange,
  disabled = false,
}: TaskCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "group relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
        checked
          ? "border-emerald-500 bg-emerald-500"
          : "border-muted-foreground/30 hover:border-emerald-500/50",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <Check
        className={cn(
          "h-3 w-3 text-white transition-all duration-200",
          checked ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
        strokeWidth={3}
      />
      {/* Ripple effect on check */}
      {checked && (
        <span className="absolute inset-0 animate-ping rounded-md bg-emerald-500 opacity-20" />
      )}
    </button>
  );
}
