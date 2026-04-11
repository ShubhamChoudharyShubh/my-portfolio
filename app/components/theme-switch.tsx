"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa6";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="theme-preference"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export const ThemeSwitch: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-7 w-14 rounded-full bg-neutral-300"
        aria-hidden
        suppressHydrationWarning
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      id="theme-toggle"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative h-7 w-14 rounded-full ${
        isDark ? "bg-neutral-700" : "bg-neutral-300"
      }`}
    >
      <span
        className={`absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-900 ${
          isDark ? "right-0.5 left-auto" : "left-0.5"
        }`}
      >
        {isDark ? (
          <FaMoon className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-300" />
        ) : (
          <FaSun className="h-3.5 w-3.5 text-neutral-600" />
        )}
      </span>
    </button>
  );
};
