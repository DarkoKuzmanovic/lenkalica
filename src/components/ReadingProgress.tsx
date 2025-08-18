"use client";

import { useState, useEffect } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    const throttledUpdateProgress = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", throttledUpdateProgress);
    return () => window.removeEventListener("scroll", throttledUpdateProgress);
  }, []);

  return (
    <div 
      className="reading-progress" 
      style={{ width: `${progress}%` }}
      aria-label={`Reading progress: ${Math.round(progress)}%`}
    />
  );
}