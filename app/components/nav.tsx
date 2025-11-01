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
    <nav className="lg:mb-7 mb-7 py-2 relative">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center" onClick={closeMenu}>
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
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-expanded={isMenuOpen}
            aria-controls="nav-dropdown"
            onClick={toggleMenu}
          >
            <span>Menu</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
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
          </button>
        </div>
      </div>

      <div
        id="nav-dropdown"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-30 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="flex flex-row gap-1 rounded-lg border border-neutral-200 dark:border-neutral-700 p-2 bg-white dark:bg-neutral-900 shadow-lg">
          {Object.entries(navItems).map(([path, { name }]) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                className={`transition-all px-1.5 py-2 rounded-md text-base font-small duration-200 flex-1 text-center ${
                  isActive
                    ? "bg-neutral-100 dark:bg-neutral-800"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
                onClick={closeMenu}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}