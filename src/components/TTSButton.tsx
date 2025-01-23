"use client";

import { useState } from "react";
import { useAudioContext } from "@/context/AudioContext";

interface TTSButtonProps {
  text: string;
  title: string;
}

export default function TTSButton({ text, title }: TTSButtonProps) {
  const { playAudio } = useAudioContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTTS = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      playAudio(audioUrl, title);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error generating TTS:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleTTS}
      disabled={isGenerating}
      className={`btn btn-primary gap-2 ${isGenerating ? "loading" : ""}`}
    >
      {!isGenerating && (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      )}
      {isGenerating ? "Generating Audio..." : "Listen to Article"}
    </button>
  );
}
