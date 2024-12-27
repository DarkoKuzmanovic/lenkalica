"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type NasaImageData = {
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
  date: string;
  media_type: string;
  copyright?: string;
};

export default function NasaImageOfDay() {
  const [imageData, setImageData] = useState<NasaImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await fetch(
          "https://api.nasa.gov/planetary/apod?api_key=wuNXDNgvyUX0Ugg8MePc4IBitILtgMHh8nG9sscc"
        );
        const data = await response.json();
        setImageData(data);
      } catch (error) {
        console.error("Error fetching NASA image:", error);
        setError("Failed to fetch NASA image");
      } finally {
        setLoading(false);
      }
    }

    fetchImage();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !imageData) {
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
        <span>{error || "Failed to load NASA image"}</span>
      </div>
    );
  }

  if (imageData.media_type !== "image") {
    return (
      <div className="alert alert-info min-h-[400px] items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Today&apos;s astronomy picture is not an image. Please check back tomorrow!</span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="relative aspect-[16/9] cursor-zoom-in" onClick={() => setIsZoomed(true)}>
        <Image
          src={imageData.url}
          alt={imageData.title}
          fill
          className="object-cover transition-transform duration-300"
          priority
        />
        <div className="badge badge-lg badge-primary absolute bottom-4 right-4">Click to zoom</div>
      </figure>
      <div className="card-body">
        <h3 className="card-title">{imageData.title}</h3>
        <div className="space-y-4">
          <div>
            {imageData.copyright && <p className="text-sm text-base-content/60">© {imageData.copyright.trim()}</p>}
            <p className="text-sm text-base-content/60">Published {new Date(imageData.date).toLocaleDateString()}</p>
          </div>

          <p className="text-base-content/70">{imageData.explanation}</p>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="modal modal-open" onClick={() => setIsZoomed(false)}>
          <div className="modal-box max-w-7xl relative p-0 bg-transparent">
            <div className="relative aspect-[16/9]">
              <Image src={imageData.hdurl} alt={imageData.title} fill className="object-contain" priority />
            </div>
            <div className="absolute bottom-0 left-4 right-4 bg-base-100/50 backdrop-blur-sm p-4 rounded-t-lg">
              <h4 className="text-xl font-bold mb-1">{imageData.title}</h4>
              <p className="text-sm opacity-90">
                {imageData.copyright ? `© ${imageData.copyright.trim()}` : "NASA Astronomy Picture of the Day"}
              </p>
            </div>
            <button
              onClick={() => setIsZoomed(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
