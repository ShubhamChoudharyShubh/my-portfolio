"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "./theme-switch";

const navItems = {
  "/": { name: "Home" },
  "/projects": { name: "Projects" },
  "/education": { name: "Education" },
  "/experience": { name: "Experience" },
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="relative mb-7 py-2 lg:mb-7 w-full">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
            aria-expanded={isMenuOpen}
            aria-controls="nav-dropdown"
            onClick={toggleMenu}
          >
            <span>Menu</span>
            {isMenuOpen ? (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        id="nav-dropdown"
        aria-hidden={!isMenuOpen}
        className={`overflow-hidden transition-[max-height,opacity,margin-top] duration-300 ease-in-out ${isMenuOpen
            ? "pointer-events-auto mt-4 max-h-56 opacity-100"
            : "pointer-events-none mt-0 max-h-0 opacity-0"
          }`}
      >
        <div
          className={`transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-y-0" : "-translate-y-2"
            }`}
        >
          <div className="flex flex-row gap-1 rounded-lg border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900">
            {Object.entries(navItems).map(([path, { name }]) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  onClick={closeMenu}
                  className={`flex-1 rounded-md px-1.5 py-2 text-center text-base ${isActive
                      ? "bg-neutral-100 dark:bg-neutral-800"
                      : "text-neutral-800 dark:text-neutral-100"
                    }`}
                >
                  {name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
