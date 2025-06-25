"use client";

import { useRef, useState, useEffect } from "react";
import { useAudioContext } from "@/context/AudioContext";
import { useAndroidDetection } from "@/hooks/useAndroidDetection";
import { getAndroidInterface } from "@/utils/androidDetection";
import { setupAndroidMediaControls, clearAndroidMediaControls } from "@/utils/androidMediaControls";

export default function AudioPlayer() {
  const {
    currentAudio: audioUrl,
    currentTitle: title,
    isPlaying,
    stopAudio,
    pauseAudio,
    resumeAudio,
  } = useAudioContext();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPinned, setIsPinned] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { isAndroid } = useAndroidDetection();

  // Set up Android media control callbacks
  useEffect(() => {
    if (isAndroid && audioRef.current) {
      setupAndroidMediaControls(audioRef.current, setCurrentTime, resumeAudio, pauseAudio);
      
      // Cleanup function only clears if this component is unmounting completely
      return () => {
        // Only clear if no audio is playing (component being destroyed, not just re-rendered)
        if (!audioUrl) {
          clearAndroidMediaControls();
        }
      };
    }
  }, [isAndroid, resumeAudio, pauseAudio, audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioUrl]);

  // Android media notification integration
  useEffect(() => {
    if (isAndroid && title) {
      const androidInterface = getAndroidInterface();
      if (androidInterface) {
        androidInterface.startMediaNotification(title);
      }
    }
  }, [isAndroid, title]);

  useEffect(() => {
    if (isAndroid) {
      const androidInterface = getAndroidInterface();
      if (androidInterface) {
        if (isPlaying) {
          // Resume notification (startMediaNotification handles both start and resume)
          if (title) {
            androidInterface.startMediaNotification(title);
          }
        } else if (audioUrl) {
          // Pause notification
          androidInterface.pauseMediaNotification();
        }
      }
    }
  }, [isAndroid, isPlaying, audioUrl, title]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);

      // Update Android Media Player notification position
      if (isAndroid && total && !isNaN(total)) {
        const androidInterface = getAndroidInterface();
        if (androidInterface) {
          androidInterface.updateMediaPosition(Math.floor(current), Math.floor(total));
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const total = audioRef.current.duration;
      setDuration(total);

      // Send initial duration to Android Media Player notification
      if (isAndroid && total && !isNaN(total)) {
        const androidInterface = getAndroidInterface();
        if (androidInterface) {
          androidInterface.updateMediaPosition(0, Math.floor(total));
        }
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);

      // Update Android Media Player notification position when seeking
      if (isAndroid && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        const androidInterface = getAndroidInterface();
        if (androidInterface) {
          androidInterface.updateMediaPosition(Math.floor(time), Math.floor(audioRef.current.duration));
        }
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!audioUrl) return null;

  return (
    <div
      className={`fixed transition-all duration-300 ${
        isPinned ? "bottom-0" : "-bottom-20"
      } left-0 right-0 bg-base-200 shadow-lg z-50`}
      onMouseEnter={() => setIsPinned(true)}
      onMouseLeave={() => setIsPinned(true)}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Left side: Title and Progress */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="text-sm sm:text-base font-medium truncate mb-2">{title}</h3>

              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm shrink-0">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="range range-primary range-sm flex-1"
                />
                <span className="text-xs sm:text-sm shrink-0">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right side: Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (isPlaying) {
                    pauseAudio();
                  } else {
                    resumeAudio();
                  }
                }}
                className="btn btn-circle btn-primary btn-sm sm:btn-md"
              >
                {!isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 sm:w-6 sm:h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 sm:w-6 sm:h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <button onClick={stopAudio} className="btn btn-circle btn-ghost btn-sm sm:btn-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 sm:w-6 sm:h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onSeeked={() => {
          // Update position when seeking is complete
          if (audioRef.current && isAndroid && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
            const androidInterface = getAndroidInterface();
            if (androidInterface) {
              androidInterface.updateMediaPosition(
                Math.floor(audioRef.current.currentTime),
                Math.floor(audioRef.current.duration)
              );
            }
          }
        }}
      />
    </div>
  );
}
