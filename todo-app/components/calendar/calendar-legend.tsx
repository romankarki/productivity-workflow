"use client";

import { Check, Flame, X, Circle } from "lucide-react";

export function CalendarLegend() {
  const items = [
    {
      icon: <Flame className="h-3 w-3 text-orange-500" />,
      label: "Current Streak",
      bg: "bg-gradient-to-br from-orange-500/15 to-rose-500/15",
    },
    {
      icon: <Check className="h-3 w-3 text-emerald-500" strokeWidth={3} />,
      label: "Completed",
      bg: "bg-emerald-500/10",
    },
    {
      icon: <X className="h-3 w-3 text-red-400" strokeWidth={3} />,
      label: "Missed",
      bg: "bg-red-500/5",
    },
    {
      icon: <Circle className="h-2 w-2 fill-muted-foreground/50 text-muted-foreground/50" />,
      label: "Has Tasks",
      bg: "bg-transparent",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className={`flex h-5 w-5 items-center justify-center rounded ${item.bg}`}>
            {item.icon}
          </div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
