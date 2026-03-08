"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  BarChart3,
  Tags,
  Settings,
  Timer,
  Flame,
  Github,
  Trophy,
} from "lucide-react";
import { useUser } from "@/lib/hooks/use-user";
import { useStreak } from "@/lib/hooks/use-streak";
import { useStopwatchContext } from "@/lib/context/stopwatch-context";
import { formatTime } from "@/components/stopwatch/time-display";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/labels", icon: Tags, label: "Labels" },
  { href: "/contests", icon: Trophy, label: "Contests" },
  { href: "/opensource", icon: Github, label: "Open Source" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useUser();
  const { data: streakData } = useStreak();
  const { activeStopwatch, elapsedTime } = useStopwatchContext();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/40 bg-card/50 backdrop-blur-xl">
      {/* Logo & Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-border/40 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-500/20">
          <Timer className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold tracking-tight">Workflow</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Todo
          </span>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="border-b border-border/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-purple-600 text-sm font-medium text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.username}</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Flame className={cn("h-3 w-3", (streakData?.currentStreak || 0) > 0 ? "text-orange-500" : "text-muted-foreground/50")} />
                <span>{streakData?.currentStreak || 0} day streak</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                  isActive && "text-primary"
                )}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section -- iPhone-style clocked timer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border/40 p-4">
        <div
          className={cn(
            "rounded-xl p-4 transition-all",
            activeStopwatch?.isActive
              ? "bg-linear-to-br from-primary/15 to-primary/5 ring-1 ring-primary/30"
              : "bg-linear-to-br from-zinc-800/60 to-zinc-900/60"
          )}
        >
          {/* Label */}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Clocked
          </p>

          {/* Large monospace timer -- the hero element */}
          <p
            className={cn(
              "mt-1 font-mono text-[2rem] font-bold leading-none tabular-nums tracking-tight",
              activeStopwatch?.isActive ? "text-primary" : "text-foreground"
            )}
          >
            {activeStopwatch?.isActive
              ? formatTime(elapsedTime)
              : "00:00"}
          </p>

          {/* Currently tracked task name */}
          {activeStopwatch?.isActive && (
            <p className="mt-2 truncate text-xs font-medium text-muted-foreground">
              {activeStopwatch.task.title}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
