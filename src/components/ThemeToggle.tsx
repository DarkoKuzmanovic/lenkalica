"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsChecked(theme === "dark");
  }, [theme]);

  if (!mounted) {
    return (
      <div className="w-10 h-10 animate-pulse bg-base-200 rounded-full">
        <span className="sr-only">Loading theme toggle</span>
      </div>
    );
  }

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setIsChecked(newTheme === "dark");
    setTheme(newTheme);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileTap={{ scale: 0.9 }}>
      <label className="grid cursor-pointer place-items-center">
        <input
          type="checkbox"
          value="synthwave"
          className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
          checked={isChecked}
          onChange={handleToggle}
          aria-label="Toggle theme"
        />
        <svg
          className={`stroke-base-100 fill-base-100 col-start-1 row-start-1 transition-opacity duration-300 ${
            isChecked ? "opacity-0" : "opacity-100"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
        <svg
          className={`stroke-base-100 fill-base-100 col-start-2 row-start-1 transition-opacity duration-300 ${
            isChecked ? "opacity-100" : "opacity-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </label>
    </motion.div>
  );
}
