"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "theme";

type Theme = "light" | "dark";

const isTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark";

const getPreferredTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const initial = isTheme(stored) ? stored : getPreferredTheme();
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const handleToggle = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-100 dark:hover:bg-zinc-900"
      aria-pressed={theme === "dark"}
      aria-label="Toggle dark mode"
    >
      <span className="text-base">{theme === "dark" ? "🌙" : "☀️"}</span>
      {theme === "dark" ? "Dark" : "Light"} mode
    </button>
  );
}
