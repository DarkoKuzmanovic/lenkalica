"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAndroidInterface, isLenkalicaApp } from "@/utils/androidDetection";
import { useAndroidDetection } from "@/hooks/useAndroidDetection";

interface AudioContextType {
  playAudio: (url: string, title: string) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  seekToPosition: () => void;
  isPlaying: boolean;
  currentTitle: string | null;
  currentAudio: string | null;
  stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const { isAndroid } = useAndroidDetection();

  // Set up Android state callbacks for native mode
  useEffect(() => {
    if (isAndroid) {
      // Define global callback for Android to update our state
      (window as any).updateAudioContextState = (playing: boolean) => {
        setIsPlaying(playing);
      };

      return () => {
        delete (window as any).updateAudioContextState;
      };
    }
  }, [isAndroid]);

  const playAudio = (url: string, title: string) => {
    setCurrentAudio(url);
    setCurrentTitle(title);
    
    if (isAndroid) {
      // For Android, don't set isPlaying here - let Android native update it
      // The AndroidAudioPlayer will handle the actual playback
    } else {
      // For web, set playing state immediately
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (isAndroid) {
      // For Android, the native player will update our state via callback
      const androidInterface = getAndroidInterface();
      if (androidInterface) {
        androidInterface.pauseMediaNotification();
      }
    } else {
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (isAndroid) {
      // For Android, the native player will update our state via callback
      const androidInterface = getAndroidInterface();
      if (androidInterface) {
        if (currentTitle) {
          androidInterface.startMediaNotification(currentTitle);
        }
      }
    } else {
      setIsPlaying(true);
    }
  };

  const seekToPosition = () => {
    // This will be handled by the AudioPlayer component
    // We just need to provide the interface for Android callbacks
  };

  const stopAudio = () => {
    if (isAndroid) {
      // For Android native mode
      const androidInterface = getAndroidInterface();
      if (androidInterface) {
        androidInterface.stopMediaNotification();
      }
    } else {
      // For web mode
      if (isLenkalicaApp()) {
        const androidInterface = getAndroidInterface();
        if (androidInterface) {
          androidInterface.stopMediaNotification();
        }
      }
    }

    setCurrentAudio(null);
    setCurrentTitle(null);
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider
      value={{
        playAudio,
        pauseAudio,
        resumeAudio,
        seekToPosition,
        isPlaying,
        currentTitle,
        currentAudio,
        stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
