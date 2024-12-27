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
    id: "shibuya-live",
    title: "Shibuya Crossing",
    location: "Tokyo, Japan",
    youtubeId: "TUd7JORZeWo",
  },
  {
    id: "sydney-live",
    title: "Sydney Opera House",
    location: "Sydney, Australia",
    youtubeId: "5uZa3-RMFos",
  },
  {
    id: "newyork-live",
    title: "Times Square",
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
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!webcam) {
    return (
      <div className="alert alert-error min-h-[400px] items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Failed to load webcam</span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${webcam.youtubeId}?autoplay=1&mute=1`}
          className="absolute inset-0 w-full h-full rounded-t-2xl"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          title={`${webcam.title} Live Stream`}
        />
      </div>
      <div className="card-body">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="card-title">{webcam.title}</h3>
              <span className="mb-2 badge badge-error badge-sm">LIVE</span>
            </div>
            <p className="text-sm text-base-content/70">{webcam.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
