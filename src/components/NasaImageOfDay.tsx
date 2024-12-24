"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type NasaImage = {
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
  date: string;
  copyright?: string;
  media_type: string;
};

export default function NasaImageOfDay() {
  const [imageData, setImageData] = useState<NasaImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNasaImage() {
      try {
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=wuNXDNgvyUX0Ugg8MePc4IBitILtgMHh8nG9sscc`
        );
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || "Failed to fetch NASA image");
        }

        setImageData(data);
      } catch (error) {
        console.error("Error fetching NASA image:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch NASA image");
      } finally {
        setLoading(false);
      }
    }

    fetchNasaImage();
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
        {error || "Failed to load image"}
      </div>
    );
  }

  if (imageData.media_type !== "image") {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-gray-600 dark:text-gray-400">
        Today's astronomy picture is not an image. Please check back tomorrow!
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image src={imageData.url} alt={imageData.title} fill className="object-cover" priority />
      </div>
      <div className="p-6 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 text-white">
        <h2 className="text-2xl font-bold mb-2">{imageData.title}</h2>
        <p className="text-gray-200 mb-2 line-clamp-2">{imageData.explanation}</p>
        <div className="flex justify-between items-center text-sm text-gray-300">
          <p>Published {new Date(imageData.date).toLocaleDateString()}</p>
          {imageData.copyright && <p>© {imageData.copyright.trim()}</p>}
        </div>
        <a
          href={imageData.hdurl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors"
        >
          View Full Resolution
        </a>
      </div>
    </div>
  );
}
