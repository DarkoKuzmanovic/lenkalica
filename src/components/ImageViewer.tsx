"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Comic } from "@/lib/comics";

interface ImageViewerProps {
  comics: Comic[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageViewer({ comics, currentIndex, isOpen, onClose, onNavigate }: ImageViewerProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          if (currentIndex > 0) onNavigate(currentIndex - 1);
          break;
        case "ArrowRight":
          if (currentIndex < comics.length - 1) onNavigate(currentIndex + 1);
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, comics.length, onNavigate, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      if (diff > 0 && currentIndex < comics.length - 1) {
        onNavigate(currentIndex + 1); // Swipe left
      } else if (diff < 0 && currentIndex > 0) {
        onNavigate(currentIndex - 1); // Swipe right
      }
    }
    setTouchStart(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={onClose}
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-base-content bg-base-100 hover:bg-base-200 p-2 rounded-full transition-colors"
              aria-label="Close viewer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation buttons */}
            <div className="absolute inset-y-0 left-4 flex items-center z-20">
              {currentIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onNavigate(currentIndex - 1);
                  }}
                  className="bg-base-100 hover:bg-base-200 p-3 rounded-full transition-colors cursor-pointer w-12 h-12 flex items-center justify-center"
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
            </div>

            <div className="absolute inset-y-0 right-4 flex items-center z-20">
              {currentIndex < comics.length - 1 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onNavigate(currentIndex + 1);
                  }}
                  className="bg-base-100 hover:bg-base-200 p-3 rounded-full transition-colors cursor-pointer w-12 h-12 flex items-center justify-center"
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Image */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative aspect-[4/3] w-full z-10"
            >
              <Image
                src={comics[currentIndex].image}
                alt={`Comic ${comics[currentIndex].id}`}
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Image counter */}
            <div className="absolute -bottom-12 left-0 text-base-100">
              {currentIndex + 1} / {comics.length}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
