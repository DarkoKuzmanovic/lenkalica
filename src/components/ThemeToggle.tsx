"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="relative inline-flex h-8 w-14 items-center rounded-full">
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="button"
      className={`
        relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
        ${isDark ? "bg-indigo-600" : "bg-gray-200"}
      `}
      role="switch"
      aria-checked={isDark ? "true" : "false"}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`
          pointer-events-none absolute left-0 inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0
          transition duration-200 ease-in-out
          ${isDark ? "translate-x-6" : "translate-x-0"}
        `}
      >
        <span
          className={`
            absolute inset-0 flex h-full w-full items-center justify-center transition-opacity
            ${isDark ? "opacity-0 duration-100 ease-out" : "opacity-100 duration-200 ease-in"}
          `}
          aria-hidden="true"
        >
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        </span>
        <span
          className={`
            absolute inset-0 flex h-full w-full items-center justify-center transition-opacity
            ${isDark ? "opacity-100 duration-200 ease-in" : "opacity-0 duration-100 ease-out"}
          `}
          aria-hidden="true"
        >
          <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        </span>
      </span>
    </button>
  );
}
