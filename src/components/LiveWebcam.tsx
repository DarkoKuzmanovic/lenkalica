"use client";

import { useState, useEffect } from "react";

type Webcam = {
  id: string;
  title: string;
  location: string;
  youtubeId: string;
};

const WEBCAMS: Webcam[] = [
  {
    id: "sydney-live",
    title: "Sydney Opera House",
    location: "Sydney, Australia",
    youtubeId: "5uZa3-RMFos",
  },
  {
    id: "shibuya-live",
    title: "Shibuya Crossing, Tokyo",
    location: "Tokyo, Japan",
    youtubeId: "TUd7JORZeWo",
  },
  {
    id: "newyork-live",
    title: "Times Square, New York",
    location: "New York, USA",
    youtubeId: "rnXIjl_Rzy4",
  },
];

type StoredWebcam = {
  webcam: Webcam;
  expiryDate: string;
};

export default function LiveWebcam() {
  const [webcam, setWebcam] = useState<Webcam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selectWebcam = () => {
      try {
        // Check if we have a cached webcam that hasn't expired
        const storedWebcamJson = localStorage.getItem("selectedWebcam");
        if (storedWebcamJson) {
          const storedWebcam: StoredWebcam = JSON.parse(storedWebcamJson);
          const expiryDate = new Date(storedWebcam.expiryDate);

          // If webcam hasn't expired, use it
          if (expiryDate > new Date()) {
            setWebcam(storedWebcam.webcam);
            setLoading(false);
            return;
          }
        }

        // Select a random webcam
        const randomIndex = Math.floor(Math.random() * WEBCAMS.length);
        const selectedWebcam = WEBCAMS[randomIndex];

        // Set expiry date to next day at midnight
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        // Store in localStorage
        const storedWebcam: StoredWebcam = {
          webcam: selectedWebcam,
          expiryDate: tomorrow.toISOString(),
        };
        localStorage.setItem("selectedWebcam", JSON.stringify(storedWebcam));

        setWebcam(selectedWebcam);
      } finally {
        setLoading(false);
      }
    };

    selectWebcam();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!webcam) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-600 dark:text-red-400">
        Failed to load webcam
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${webcam.youtubeId}?autoplay=1&mute=1`}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          title={`${webcam.title} Live Stream`}
        />
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{webcam.title}</h3>
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                LIVE
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{webcam.location}</p>
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${webcam.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
          >
            Watch on YouTube
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
