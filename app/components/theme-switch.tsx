"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa6";

const storageKey = 'theme-preference';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export const ThemeSwitch: React.FC = () => {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark'>('light');

  const getColorPreference = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      const storedPreference = localStorage.getItem(storageKey);
      if (storedPreference) {
        return storedPreference as 'light' | 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; 
  };

  const reflectPreference = (theme: 'light' | 'dark') => {
    document.documentElement.classList.remove('bg-light', 'bg-dark');
    document.documentElement.classList.add(`bg-${theme}`);
    setCurrentTheme(theme);
    setTheme(theme);
  };

  React.useEffect(() => {
    setMounted(true);
    const initTheme = getColorPreference();
    reflectPreference(initTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const newTheme = mediaQuery.matches ? 'dark' : 'light';
      localStorage.setItem(storageKey, newTheme);
      reflectPreference(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem(storageKey, newTheme);
    reflectPreference(newTheme);
  };

  if (!mounted) {
    return (
      <div className="w-14 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700" />
    );
  }

  const isDark = currentTheme === 'dark';

  return (
    <button
      id="theme-toggle"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out ${
        isDark ? 'bg-neutral-700' : 'bg-neutral-300'
      } hover:opacity-80`}
    >
      {/* Toggle Circle */}
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-neutral-900 shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {/* Icon inside the circle */}
        {isDark ? (
          <FaMoon className="w-3.5 h-3.5 text-yellow-400 transition-all duration-300" />
        ) : (
          <FaSun className="w-3.5 h-3.5 text-yellow-500 transition-all duration-300" />
        )}
      </span>
    </button>
  );
};