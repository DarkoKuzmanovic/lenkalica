"use client";

import { useAudio } from "@/context/AudioContext";
import { useState, useEffect } from "react";

type TTSButtonProps = {
  text: string;
  title: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TTSButton({ text, title }: TTSButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setAudio } = useAudio();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTTS = async () => {
    try {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      setIsGenerating(true);

      // Check if the browser supports speech synthesis
      if (!window.speechSynthesis) {
        throw new Error("Your browser doesn't support text to speech!");
      }

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Get available voices
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Some browsers need a small delay to load voices
        await new Promise((resolve) => {
          window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            resolve(true);
          };
        });
      }

      // Select a preferred voice with improved logic
      const preferredVoice =
        voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            (voice.name.includes("Natural") ||
              voice.name.includes("Premium") ||
              voice.name.includes("Enhanced") ||
              voice.name.includes("Neural") ||
              voice.name.includes("Google") ||
              voice.name.includes("Microsoft")) &&
            !voice.name.includes("Mobile")
        ) ||
        voices.find((voice) => voice.lang.startsWith("en")) ||
        voices[0];

      utterance.voice = preferredVoice;
      utterance.rate = 1;
      utterance.pitch = 1;

      // Start speaking
      window.speechSynthesis.speak(utterance);

      // Handle events
      utterance.onstart = () => {
        setIsGenerating(false);
        setIsPlaying(true);
      };

      utterance.onerror = (event) => {
        console.error("TTS Error:", event);
        setIsGenerating(false);
        setIsPlaying(false);
      };

      utterance.onend = () => {
        setIsGenerating(false);
        setIsPlaying(false);
      };
    } catch (error) {
      console.error("TTS Error:", error);
      setIsGenerating(false);
      setIsPlaying(false);
      alert("Sorry, there was an error generating the speech. Please try again.");
    }
  };

  return (
    <button onClick={handleTTS} disabled={isGenerating} className="btn btn-neutral gap-2">
      {/* Speaker Icon for Playing, Pause Icon for Paused */}
      {isPlaying ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            fillRule="evenodd"
            strokeWidth={2}
            d="M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M16 8.99998C16.5 9.49998 17 10.5 17 12C17 13.5 16.5 14.5 16 15M3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C14 21 14 3 12 3C9 3 7.5 7.5 5.5 8C3.5 8.5 3 9.39543 3 10.5Z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {isGenerating ? "Generating..." : isPlaying ? "Pause" : "Listen to Article"}
    </button>
  );
}
