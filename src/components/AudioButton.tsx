"use client";

import { useAudioContext } from "@/context/AudioContext";

interface AudioButtonProps {
  audioUrl: string;
  title: string;
}

export default function AudioButton({ audioUrl, title }: AudioButtonProps) {
  const { playAudio } = useAudioContext();

  return (
    <button onClick={() => playAudio(audioUrl, title)} className="btn btn-primary gap-2">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Listen to Podcast
    </button>
  );
}
