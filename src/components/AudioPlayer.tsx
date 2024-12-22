"use client";

import { useEffect, useRef } from "react";
import { useAudio } from "@/context/AudioContext";

export default function AudioPlayer() {
  const { audioUrl, title, isPlaying, togglePlayPause, clearAudio } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);

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
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={togglePlayPause}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Now Playing</p>
          </div>
        </div>
        <button
          onClick={clearAudio}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          aria-label="Close audio player"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <audio ref={audioRef} src={audioUrl} className="w-full mt-3" controls onEnded={clearAudio} />
    </div>
  );
}
