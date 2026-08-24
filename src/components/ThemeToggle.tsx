"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    // Skeleton matches the architectural grid opacities
    return (
      <div className="w-14 h-8 rounded-full bg-foreground/10 border border-foreground/5 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative flex items-center w-14 h-8 rounded-full p-1 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-scarab-gold/50 active:scale-95 ${
        isDark
          ? "bg-foreground/10 border border-white/20"
          : "bg-foreground/5 border border-foreground/10"
      }`}
      aria-label="Toggle theme"
    >
      {/* Background Icons (Stationary) */}
      <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none opacity-20">
        <Sun size={12} className="text-foreground" />
        <Moon size={12} className="text-foreground" />
      </div>

      {/* Moving Switcher Knob */}
      <div
        className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full shadow-lg transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDark
            ? "translate-x-6 bg-white text-black shadow-white/10"
            : "translate-x-0 bg-foreground text-background shadow-black/10"
        }`}
      >
        {isDark ? (
          <Moon size={14} strokeWidth={3} className="text-scarab-gold" />
        ) : (
          <Sun size={14} strokeWidth={3} className="text-scarab-gold" />
        )}
      </div>
    </button>
  );
}
