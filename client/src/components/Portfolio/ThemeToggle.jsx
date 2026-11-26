"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const KEY = "bk-theme";

/** Day/night switch, labelled with the mode it switches to. The saved value is applied before paint by the layout's inline script. */
export default function ThemeToggle() {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    setMode(document.documentElement.getAttribute("data-bk-theme") === "light" ? "light" : "dark");
  }, []);

  const next = mode === "dark" ? "light" : "dark";
  const Icon = mode === "dark" ? FiSun : FiMoon;

  const toggle = () => {
    setMode(next);
    document.documentElement.setAttribute("data-bk-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable: preference lasts for this page view only */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 border border-bk-line px-3 py-2.5 font-mono text-xs uppercase tracking-widest text-bk-muted transition-colors hover:border-bk-accent-ink hover:text-bk-accent-ink"
      aria-label={`Switch to ${next === "light" ? "day" : "night"} mode`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {next === "light" ? "day" : "night"}
    </button>
  );
}
