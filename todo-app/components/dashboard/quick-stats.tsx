"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Target, Clock, CalendarDays } from "lucide-react";

interface QuickStatsProps {
  streak: number;
  todayCompleted: number;
  todayTotal: number;
  weekCompleted: number;
  timeTracked: string;
}

export function QuickStats({
  streak,
  todayCompleted,
  todayTotal,
  weekCompleted,
  timeTracked,
}: QuickStatsProps) {
  const stats = [
    {
      title: "Current Streak",
      value: `${streak} day${streak !== 1 ? "s" : ""}`,
      subtitle: streak > 0 ? "Keep it going!" : "Start your streak today",
      icon: Flame,
      iconColor: "text-orange-500",
      bgGradient: "from-orange-500/10 to-rose-500/10",
    },
    {
      title: "Today's Progress",
      value: `${todayCompleted}/${todayTotal}`,
      subtitle:
        todayTotal === 0
          ? "No tasks yet"
          : todayCompleted === todayTotal
          ? "All done! 🎉"
          : `${todayTotal - todayCompleted} remaining`,
      icon: Target,
      iconColor: "text-emerald-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
    },
    {
      title: "Time Tracked",
      value: timeTracked,
      subtitle: "Today",
      icon: Clock,
      iconColor: "text-violet-500",
      bgGradient: "from-violet-500/10 to-purple-500/10",
    },
    {
      title: "This Week",
      value: `${weekCompleted}`,
      subtitle: "Tasks completed",
      icon: CalendarDays,
      iconColor: "text-blue-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`border-border/40 bg-gradient-to-br ${stat.bgGradient} backdrop-blur`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
