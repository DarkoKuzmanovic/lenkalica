"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AudioContextType = {
  audioUrl: string | null;
  title: string | null;
  isPlaying: boolean;
  setAudio: (url: string, title: string) => void;
  clearAudio: () => void;
  togglePlayPause: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const setAudio = (url: string, title: string) => {
    setAudioUrl(url);
    setTitle(title);
    setIsPlaying(true);
  };

  const clearAudio = () => {
    setAudioUrl(null);
    setTitle(null);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <AudioContext.Provider
      value={{
        audioUrl,
        title,
        isPlaying,
        setAudio,
        clearAudio,
        togglePlayPause,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
