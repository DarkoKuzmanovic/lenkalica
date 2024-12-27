"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/context/AudioContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AudioPlayer() {
  const { audioUrl, title, isPlaying, togglePlayPause, clearAudio } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPinned, setIsPinned] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  if (!audioUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`${
          isPinned ? "fixed bottom-0 left-0 right-0 z-50" : "relative"
        } bg-base-100 shadow-xl border-t border-base-300`}
      >
        <div className="max-w-3xl mx-auto w-full">
          <div className="p-3 md:p-4">
            {/* Controls and Title */}
            <div className="flex items-center justify-between gap-3 mb-2 md:mb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  onClick={togglePlayPause}
                  className="btn btn-circle btn-primary btn-sm md:btn-md"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm md:text-base font-medium text-base-content truncate">{title}</h3>
                  <p className="text-xs md:text-sm text-base-content/60 badge badge-ghost">Now Playing</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPinned(!isPinned)}
                  className={`btn btn-ghost btn-circle btn-sm ${isPinned ? "text-primary" : ""}`}
                  aria-label={isPinned ? "Unpin player" : "Pin player"}
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.9999 17V21M6.9999 12.6667V6C6.9999 4.89543 7.89533 4 8.9999 4H14.9999C16.1045 4 16.9999 4.89543 16.9999 6V12.6667L18.9135 15.4308C19.3727 16.094 18.898 17 18.0913 17H5.90847C5.1018 17 4.62711 16.094 5.08627 15.4308L6.9999 12.6667Z"
                    />
                  </svg>
                </button>
                <button
                  onClick={clearAudio}
                  className="btn btn-ghost btn-circle btn-sm hover:btn-error"
                  aria-label="Close audio player"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Audio Element */}
            <div className="w-full join">
              <audio
                ref={audioRef}
                src={audioUrl}
                className="w-full h-8 md:h-10 join-item"
                controls
                onEnded={clearAudio}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
