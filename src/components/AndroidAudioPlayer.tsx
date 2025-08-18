"use client";

import { useState, useEffect } from "react";
import { useAudioContext } from "@/context/AudioContext";
import { getAndroidInterface } from "@/utils/androidDetection";

// Android-native audio player that uses native MediaPlayer
export default function AndroidAudioPlayer() {
  const { currentAudio: audioUrl, currentTitle: title, isPlaying, stopAudio } = useAudioContext();
  const [isPinned, setIsPinned] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Handle play/pause through Android native controls
  const handlePlayPause = () => {
    const androidInterface = getAndroidInterface();
    if (!androidInterface) return;

    if (isPlaying) {
      androidInterface.pauseMediaNotification();
    } else {
      if (title) {
        androidInterface.startMediaNotification(title);
      }
    }
  };

  // Handle seeking through Android native controls
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    
    const androidInterface = getAndroidInterface();
    if (androidInterface) {
      if (androidInterface.seekToPosition) {
        androidInterface.seekToPosition(Math.floor(time));
      } else {
        androidInterface.updateMediaPosition(Math.floor(time), Math.floor(duration));
      }
    }
  };

  // Set up Android callbacks to receive playback state
  useEffect(() => {
    // Define callbacks for Android to update our UI
    (window as unknown as { updateWebPlayerState?: (playing: boolean, position: number, totalDuration: number) => void }).updateWebPlayerState = (playing: boolean, position: number, totalDuration: number) => {
      setCurrentTime(position);
      setDuration(totalDuration);
      setIsLoading(false);
    };

    (window as unknown as { onAndroidMediaLoading?: () => void }).onAndroidMediaLoading = () => {
      setIsLoading(true);
    };

    (window as unknown as { onAndroidMediaReady?: (totalDuration: number) => void }).onAndroidMediaReady = (totalDuration: number) => {
      setDuration(totalDuration);
      setIsLoading(false);
    };

    // Cleanup
    return () => {
      delete (window as unknown as { updateWebPlayerState?: unknown }).updateWebPlayerState;
      delete (window as unknown as { onAndroidMediaLoading?: unknown }).onAndroidMediaLoading;
      delete (window as unknown as { onAndroidMediaReady?: unknown }).onAndroidMediaReady;
    };
  }, []);

  // Start Android media when audio URL changes
  useEffect(() => {
    if (audioUrl && title) {
      setIsLoading(true);
      const androidInterface = getAndroidInterface();
      
      if (androidInterface) {
        
        if (androidInterface.loadAndPlayAudio) {
          androidInterface.loadAndPlayAudio(audioUrl, title);
        } else {
          androidInterface.startMediaNotification(title);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, [audioUrl, title]);

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
              <h3 className="text-sm sm:text-base font-medium truncate mb-2">
                {title} {isLoading && <span className="text-xs opacity-60">(Loading...)</span>}
              </h3>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm shrink-0">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  disabled={isLoading}
                  className="range range-primary range-sm flex-1"
                />
                <span className="text-xs sm:text-sm shrink-0">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right side: Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePlayPause}
                disabled={isLoading}
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

              <button 
                onClick={stopAudio} 
                disabled={isLoading}
                className="btn btn-circle btn-ghost btn-sm sm:btn-md"
              >
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
    </div>
  );
}