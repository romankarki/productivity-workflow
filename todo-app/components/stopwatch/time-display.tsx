"use client";

import { cn } from "@/lib/utils";

interface TimeDisplayProps {
  milliseconds: number;
  size?: "sm" | "md" | "lg";
  showMillis?: boolean;
  className?: string;
}

export function formatTime(ms: number, showMillis: boolean = false): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor((ms % 1000) / 10);

  if (hours > 0) {
    const base = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    return showMillis ? `${base}.${millis.toString().padStart(2, "0")}` : base;
  }

  const base = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  return showMillis ? `${base}.${millis.toString().padStart(2, "0")}` : base;
}

export function TimeDisplay({
  milliseconds,
  size = "md",
  showMillis = false,
  className,
}: TimeDisplayProps) {
  const sizeClasses = {
    sm: "text-lg font-medium",
    md: "text-3xl font-bold",
    lg: "text-5xl font-bold tracking-tight",
  };

  return (
    <div
      className={cn(
        "font-mono tabular-nums",
        sizeClasses[size],
        className
      )}
    >
      {formatTime(milliseconds, showMillis)}
    </div>
  );
}
