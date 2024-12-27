"use client";

import { useAudio } from "@/context/AudioContext";
import { useState } from "react";

type TTSButtonProps = {
  text: string;
  title: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TTSButton({ text, title }: TTSButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setAudio } = useAudio();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTTS = async () => {
    try {
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

      // Try to find a good English voice
      const preferredVoice =
        voices.find(
          (voice) => voice.lang.startsWith("en") && (voice.name.includes("Female") || voice.name.includes("Google"))
        ) || voices[0];

      utterance.voice = preferredVoice;
      utterance.rate = 1;
      utterance.pitch = 1;

      // Start speaking
      window.speechSynthesis.speak(utterance);

      // Handle events
      utterance.onstart = () => {
        setIsGenerating(false);
      };

      utterance.onerror = (event) => {
        console.error("TTS Error:", event);
        setIsGenerating(false);
      };

      utterance.onend = () => {
        setIsGenerating(false);
      };
    } catch (error) {
      console.error("TTS Error:", error);
      setIsGenerating(false);
      alert("Sorry, there was an error generating the speech. Please try again.");
    }
  };

  return (
    <button onClick={handleTTS} disabled={isGenerating} className="btn btn-neutral gap-2">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
      {isGenerating ? "Generating..." : "Listen to Article"}
    </button>
  );
}
