"use client";

import { useAudio } from "@/context/AudioContext";

type AudioButtonProps = {
  audioUrl: string;
  title: string;
};

export default function AudioButton({ audioUrl, title }: AudioButtonProps) {
  const { setAudio } = useAudio();

  return (
    <button onClick={() => setAudio(audioUrl, title)} className="btn btn-primary gap-2">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
      Listen to Podcast
    </button>
  );
}
