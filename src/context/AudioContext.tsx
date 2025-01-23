"use client";

import React, { createContext, useContext, useState } from "react";

interface AudioContextType {
  playAudio: (url: string, title: string) => void;
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

  const stopAudio = () => {
    setCurrentAudio(null);
    setCurrentTitle(null);
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider
      value={{
        playAudio,
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
