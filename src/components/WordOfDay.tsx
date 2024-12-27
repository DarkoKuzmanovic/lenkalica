"use client";

import { useState, useEffect } from "react";

type WordData = {
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  date: string;
};

type StoredWord = {
  data: WordData;
  expiryDate: string;
};

export default function WordOfDay() {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        // Check if we have a cached word that hasn't expired
        const storedWordJson = localStorage.getItem("wordOfDay");
        if (storedWordJson) {
          const storedWord: StoredWord = JSON.parse(storedWordJson);
          const expiryDate = new Date(storedWord.expiryDate);

          // If word hasn't expired, use it
          if (expiryDate > new Date()) {
            setWordData(storedWord.data);
            setLoading(false);
            return;
          }
        }

        // Fetch new word from our API
        const response = await fetch("/api/word-of-day");
        if (!response.ok) {
          throw new Error("Failed to fetch word of the day");
        }
        const data = await response.json();

        // Set expiry date to next day at midnight
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        // Store in localStorage
        const storedWord: StoredWord = {
          data,
          expiryDate: tomorrow.toISOString(),
        };
        localStorage.setItem("wordOfDay", JSON.stringify(storedWord));

        setWordData(data);
      } catch (error) {
        console.error("Error setting up word of the day:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, []);

  const speak = () => {
    if (!wordData || speaking) return;

    const utterance = new SpeechSynthesisUtterance(wordData.word);
    utterance.rate = 0.8; // Slightly slower for better pronunciation
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!wordData) return null;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="card-title">{wordData.word}</h3>
              <button
                onClick={speak}
                disabled={speaking}
                className="btn btn-ghost btn-sm btn-circle"
                title="Listen to pronunciation"
              >
                {speaking ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1V8a1 1 0 011-1h1.586l4.707-4.707C10.923 1.663 12 2.109 12 3v16c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1V8a1 1 0 011-1h1.586l4.707-4.707C10.923 1.663 12 2.109 12 3v16c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <p className="font-mono text-base-content/70">/{wordData.pronunciation}/</p>
          </div>
          <span className="badge badge-ghost">{wordData.date}</span>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-1">Definition</h4>
            <p className="text-base-content/70">{wordData.definition}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-1">Example</h4>
            <p className="text-base-content/70 italic">&quot;{wordData.example}&quot;</p>
          </div>
        </div>

        <div className="card-actions justify-end mt-6">
          <a
            href="https://www.merriam-webster.com/word-of-the-day"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            Learn more on Merriam-Webster
            <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
