"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Calendar, ScrollText, BarChart3, Tags, Settings, Github } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/activity", icon: ScrollText, label: "Activity" },
  { href: "/analytics", icon: BarChart3, label: "Stats" },
  { href: "/labels", icon: Tags, label: "Labels" },
  { href: "/opensource", icon: Github, label: "OSS" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/95 backdrop-blur-xl md:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom,8px)]">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-4 py-2.5 min-w-[56px] transition-all active:scale-95",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground active:bg-zinc-800/50"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform",
                isActive && "text-primary scale-110"
              )} />
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "text-primary"
              )}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
