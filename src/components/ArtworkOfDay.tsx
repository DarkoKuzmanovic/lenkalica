"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Artwork = {
  id: number;
  title: string;
  artist_display: string;
  date_display: string;
  medium_display: string;
  dimensions: string;
  image_id: string;
  description: string | null;
  credit_line: string;
};

export default function ArtworkOfDay() {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    async function fetchArtwork() {
      try {
        // Get a random artwork from the public domain collection
        const response = await fetch(
          "https://api.artic.edu/api/v1/artworks/search?q=&query[term][is_public_domain]=true&limit=1&fields=id,title,artist_display,date_display,medium_display,dimensions,image_id,description,credit_line"
        );
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
          throw new Error("No artwork found");
        }

        setArtwork(data.data[0]);
      } catch (error) {
        console.error("Error fetching artwork:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch artwork");
      } finally {
        setLoading(false);
      }
    }

    fetchArtwork();
  }, []);

  // Function to remove HTML tags from text
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-600 dark:text-red-400">
        {error || "Failed to load artwork"}
      </div>
    );
  }

  const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
  const highResImageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/1686,/0/default.jpg`;
  const cleanDescription = artwork.description ? stripHtml(artwork.description) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden cursor-zoom-in" onClick={() => setIsZoomed(true)}>
        <Image
          src={imageUrl}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-300"
          priority
        />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-lg text-sm">
          Click to zoom
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{artwork.title}</h3>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400">{artwork.artist_display}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{artwork.date_display}</p>
          </div>

          {cleanDescription && <p className="text-gray-600 dark:text-gray-400">{cleanDescription}</p>}

          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p>{artwork.medium_display}</p>
            <p>{artwork.dimensions}</p>
            <p className="italic">{artwork.credit_line}</p>
          </div>
        </div>

        <div className="mt-6">
          <a
            href={`https://www.artic.edu/artworks/${artwork.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium inline-flex items-center"
          >
            View on Art Institute of Chicago
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

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative w-full max-w-7xl">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image src={highResImageUrl} alt={artwork.title} fill className="object-contain" priority />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
              <h4 className="text-xl font-bold mb-1">{artwork.title}</h4>
              <p className="text-sm text-gray-300">{artwork.artist_display}</p>
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
