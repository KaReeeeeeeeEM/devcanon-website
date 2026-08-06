"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return <button className="icon-button" type="button" aria-label={mounted && resolvedTheme === "dark" ? "Use light theme" : "Use dark theme"} onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
    {mounted && resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
  </button>;
}
