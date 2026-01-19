"use client";

import { useTheme, themes, Theme } from "@/lib/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Check, Palette, Sun, Moon, Monitor } from "lucide-react";

const themeIcons: Record<Theme, React.ReactNode> = {
  light: <Sun className="w-4 h-4" />,
  dark: <Moon className="w-4 h-4" />,
  "pitch-black": <Monitor className="w-4 h-4" />,
  monokai: <Palette className="w-4 h-4" />,
};

export function ThemeSelector() {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="rounded-xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Palette className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">Appearance</h3>
            <p className="text-sm text-zinc-500">Choose your preferred theme</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-zinc-800/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-violet-500/10">
          <Palette className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100">Appearance</h3>
          <p className="text-sm text-zinc-500">Choose your preferred theme</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "relative group rounded-xl p-3 text-left transition-all duration-200",
              "border-2",
              theme === t.id
                ? "border-violet-500 bg-violet-500/10"
                : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800/50"
            )}
          >
            {/* Theme Preview */}
            <div
              className="h-12 rounded-lg mb-3 overflow-hidden flex items-end p-1.5 gap-1"
              style={{ backgroundColor: t.colors.bg }}
            >
              {/* Mini cards preview */}
              <div
                className="h-4 w-6 rounded"
                style={{ backgroundColor: t.colors.card }}
              />
              <div
                className="h-6 w-8 rounded"
                style={{ backgroundColor: t.colors.card }}
              />
              <div
                className="h-3 w-4 rounded"
                style={{ backgroundColor: t.colors.accent }}
              />
            </div>

            {/* Theme Info */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  theme === t.id ? "text-violet-300" : "text-zinc-300"
                )}
              >
                {t.name}
              </span>
              {theme === t.id && (
                <Check className="w-3.5 h-3.5 text-violet-400" />
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">{t.description}</p>

            {/* Selected indicator */}
            {theme === t.id && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
