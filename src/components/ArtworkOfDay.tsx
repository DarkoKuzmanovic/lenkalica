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

type StoredArtwork = {
  data: Artwork;
  expiryDate: string;
};

export default function ArtworkOfDay() {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchArtwork() {
      try {
        // Check if we have a cached artwork
        const storedArtworkJson = localStorage.getItem("artworkOfDay");
        if (storedArtworkJson && !refresh) {
          const storedArtwork: StoredArtwork = JSON.parse(storedArtworkJson);
          const expiryDate = new Date(storedArtwork.expiryDate);

          // If artwork has expired, remove it from localStorage
          if (expiryDate <= new Date()) {
            localStorage.removeItem("artworkOfDay");
          } else {
            // If artwork hasn't expired, use it
            setArtwork(storedArtwork.data);
            setLoading(false);
            return;
          }
        }

        // Reset refresh state
        setRefresh(false);

        // Get a random artwork from the public domain collection
        const randomPage = Math.floor(Math.random() * 100); // Random page between 0-99
        const response = await fetch(
          `https://api.artic.edu/api/v1/artworks/search?q=&query[term][is_public_domain]=true&limit=1&page=${randomPage}&fields=id,title,artist_display,date_display,medium_display,dimensions,image_id,description,credit_line`
        );
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
          throw new Error("No artwork found");
        }

        // Set expiry date to next day at midnight
        const tomorrow = new Date();
        tomorrow.setHours(24, 0, 0, 0);

        // Store in localStorage
        const storedArtwork: StoredArtwork = {
          data: data.data[0],
          expiryDate: tomorrow.toISOString(),
        };
        localStorage.setItem("artworkOfDay", JSON.stringify(storedArtwork));

        setArtwork(data.data[0]);
      } catch (error) {
        console.error("Error fetching artwork:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch artwork");
      } finally {
        setLoading(false);
      }
    }

    fetchArtwork();
  }, [refresh]);

  // Function to remove HTML tags from text
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleRefresh = () => {
    localStorage.removeItem("artworkOfDay"); // Clear the stored artwork
    setLoading(true); // Show loading state while fetching
    setRefresh(true); // Trigger re-fetch in useEffect
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !artwork) {
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
        <span>{error || "Failed to load artwork"}</span>
      </div>
    );
  }

  const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
  const highResImageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/1686,/0/default.jpg`;
  const cleanDescription = artwork.description ? stripHtml(artwork.description) : null;

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="relative aspect-[16/9] cursor-zoom-in" onClick={() => setIsZoomed(true)}>
        <Image
          src={imageUrl}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-300"
          priority
        />
        <div className="badge badge-lg badge-primary absolute bottom-4 right-4">Click to zoom</div>
      </figure>
      <div className="card-body">
        <h3 className="card-title">{artwork.title}</h3>
        <div className="space-y-4">
          <div>
            <p className="text-base-content/70">{artwork.artist_display}</p>
            <p className="text-sm text-base-content/60">{artwork.date_display}</p>
          </div>

          {cleanDescription && <p className="text-base-content/70">{cleanDescription}</p>}

          <div className="text-sm text-base-content/60 space-y-1">
            <p>{artwork.medium_display}</p>
            <p>{artwork.dimensions}</p>
            <p className="italic">{artwork.credit_line}</p>
          </div>
        </div>

        <div className="card-actions justify-end mt-6">
          <button className="btn btn-secondary btn-sm" onClick={handleRefresh}>
            Refresh Artwork
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="modal modal-open" onClick={() => setIsZoomed(false)}>
          <div className="modal-box max-w-7xl relative p-0 bg-transparent">
            <div className="relative aspect-[16/9]">
              <Image src={highResImageUrl} alt={artwork.title} fill className="object-contain" priority />
            </div>
            <div className="absolute bottom-0 left-4 right-4 bg-base-100/50 backdrop-blur-sm p-4 rounded-t-lg">
              <h4 className="text-xl font-bold mb-1">{artwork.title}</h4>
              <p className="text-sm opacity-90">{artwork.artist_display}</p>
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
