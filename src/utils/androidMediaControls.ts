"use client";

// Global reference to audio element and state
let globalAudioRef: HTMLAudioElement | null = null;
let globalSetCurrentTime: ((time: number) => void) | null = null;
let globalResumeAudio: (() => void) | null = null;
let globalPauseAudio: (() => void) | null = null;

// Extend the Window interface for Android media callbacks
declare global {
  interface Window {
    handleAndroidMediaPlay?: () => void;
    handleAndroidMediaPause?: () => void;
    handleAndroidMediaSeek?: (position: number) => void;
  }
}

export function setupAndroidMediaControls(
  audioRef: HTMLAudioElement | null,
  setCurrentTime: (time: number) => void,
  resumeAudio: () => void,
  pauseAudio: () => void
) {
  // Always update the global references
  globalAudioRef = audioRef;
  globalSetCurrentTime = setCurrentTime;
  globalResumeAudio = resumeAudio;
  globalPauseAudio = pauseAudio;

  // Only set up callbacks once to avoid overwriting
  if (!window.handleAndroidMediaPlay) {
    console.log('Setting up Android media control callbacks');

    window.handleAndroidMediaPlay = () => {
      console.log('Android media play callback triggered');
      if (globalAudioRef && globalAudioRef.paused && globalResumeAudio) {
        console.log('Resuming audio from Android control');
        globalResumeAudio();
      }
    };

    window.handleAndroidMediaPause = () => {
      console.log('Android media pause callback triggered');
      if (globalAudioRef && !globalAudioRef.paused && globalPauseAudio) {
        console.log('Pausing audio from Android control');
        globalPauseAudio();
      }
    };

    window.handleAndroidMediaSeek = (position: number) => {
      console.log('Android media seek callback triggered, position:', position);
      if (globalAudioRef && globalSetCurrentTime) {
        console.log('Seeking to position:', position);
        globalAudioRef.currentTime = position;
        globalSetCurrentTime(position);
        
        // Also notify Android MediaService of the position update
        if (typeof window !== 'undefined' && (window as unknown as { Android?: unknown }).Android) {
          const androidInterface = (window as unknown as { Android: { updateMediaPosition?: (position: number, duration: number) => void } }).Android;
          if (androidInterface.updateMediaPosition && globalAudioRef.duration && !isNaN(globalAudioRef.duration)) {
            androidInterface.updateMediaPosition(
              Math.floor(position),
              Math.floor(globalAudioRef.duration)
            );
          }
        }
      }
    };
  } else {
    console.log('Android media callbacks already set up, updating references only');
  }
}

export function clearAndroidMediaControls() {
  globalAudioRef = null;
  globalSetCurrentTime = null;
  globalResumeAudio = null;
  globalPauseAudio = null;
  
  delete window.handleAndroidMediaPlay;
  delete window.handleAndroidMediaPause;
  delete window.handleAndroidMediaSeek;
}