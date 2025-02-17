// This file can be removed entirely since TTS functionality is no longer in use.

"use client";

import { useState } from "react";

interface TTSButtonProps {
  text: string;
}

export default function TTSButton({ text }: TTSButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTTS = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Check if speech synthesis is available
      if (!window.speechSynthesis) {
        throw new Error("Speech synthesis is not supported in this browser");
      }

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Configure the utterance
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter((voice) => voice.lang.startsWith("en-"));

      // Try to find a good voice, preferring Microsoft voices
      const preferredVoice =
        englishVoices.find((voice) => voice.name.includes("Microsoft") || voice.name.includes("Google")) ||
        englishVoices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Start speaking
      window.speechSynthesis.speak(utterance);

      // Handle events
      utterance.onstart = () => {
        setIsGenerating(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setError("Failed to generate speech");
        setIsGenerating(false);
      };

      utterance.onend = () => {
        setIsGenerating(false);
      };
    } catch (error) {
      console.error("TTS Error:", error);
      setError(error instanceof Error ? error.message : "Failed to generate audio");
      setIsGenerating(false);
    }
  };

  return (
    <div>
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
      {error && <p className="text-error text-sm mt-2">{error}</p>}
    </div>
  );
}
