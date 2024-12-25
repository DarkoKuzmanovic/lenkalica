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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !imageData) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-600 dark:text-red-400">
        {error || "Failed to load NASA image"}
      </div>
    );
  }

  if (imageData.media_type !== "image") {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-gray-600 dark:text-gray-400">
        Today&apos;s astronomy picture is not an image. Please check back tomorrow!
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden cursor-zoom-in" onClick={() => setIsZoomed(true)}>
        <Image
          src={imageData.url}
          alt={imageData.title}
          fill
          className="object-cover transition-transform duration-300"
          priority
        />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-lg text-sm">
          Click to zoom
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{imageData.title}</h3>
        <div className="space-y-4">
          <div>
            {imageData.copyright && (
              <p className="text-sm text-gray-500 dark:text-gray-400">© {imageData.copyright.trim()}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Published {new Date(imageData.date).toLocaleDateString()}
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-400">{imageData.explanation}</p>

          <div className="mt-6">
            <a
              href={imageData.hdurl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium inline-flex items-center"
            >
              View on NASA
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

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative w-full max-w-7xl">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image src={imageData.hdurl} alt={imageData.title} fill className="object-contain" priority />
            </div>
            <div className="absolute bottom-0 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
              <h4 className="text-xl font-bold mb-1">{imageData.title}</h4>
              <p className="text-sm text-gray-300">
                {imageData.copyright ? `© ${imageData.copyright.trim()}` : "NASA Astronomy Picture of the Day"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close zoom view"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
