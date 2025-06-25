"use client";

import React, { createContext, useContext, useState } from "react";
import { getAndroidInterface, isLenkalicaApp } from "@/utils/androidDetection";

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

  const playAudio = (url: string, title: string) => {
    setCurrentAudio(url);
    setCurrentTitle(title);
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
  };

  const resumeAudio = () => {
    setIsPlaying(true);
  };

  const seekToPosition = () => {
    // This will be handled by the AudioPlayer component
    // We just need to provide the interface for Android callbacks
  };

  const stopAudio = () => {
    // Stop Android notification if running in app
    if (isLenkalicaApp()) {
      const androidInterface = getAndroidInterface();
      if (androidInterface) {
        androidInterface.stopMediaNotification();
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
