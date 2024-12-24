"use client";

import { useState, useEffect } from "react";

type WordData = {
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  date: string;
};

export default function WordOfDay() {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    // For now, using static data as web scraping would require backend setup
    const mockData = {
      word: "delectation",
      pronunciation: "dee-lek-TAY-shun",
      definition: "a feeling of delight or enjoyment; it can also be used to refer to the source of such feelings",
      example: "The resort staff left a sampling of fine chocolate in our room for our delectation.",
      date: "December 23, 2024",
    };
    setWordData(mockData);
    setLoading(false);
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
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!wordData) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{wordData.word}</h3>
              <button
                onClick={speak}
                disabled={speaking}
                className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
            <p className="text-gray-600 dark:text-gray-400 font-mono">/{wordData.pronunciation}/</p>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{wordData.date}</span>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              Definition
            </h4>
            <p className="text-gray-600 dark:text-gray-400">{wordData.definition}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              Example
            </h4>
            <p className="text-gray-600 dark:text-gray-400 italic">&quot;{wordData.example}&quot;</p>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="https://www.merriam-webster.com/word-of-the-day"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium inline-flex items-center"
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
