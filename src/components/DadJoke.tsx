"use client";

import { useState, useEffect } from "react";

type DadJoke = {
  id: string;
  joke: string;
  status: number;
};

type StoredJoke = {
  joke: DadJoke;
  expiryDate: string;
};

export default function DadJoke() {
  const [joke, setJoke] = useState<DadJoke | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        // Check if we have a cached joke that hasn't expired
        const storedJokeJson = localStorage.getItem("dadJoke");
        if (storedJokeJson && !refresh) {
          const storedJoke: StoredJoke = JSON.parse(storedJokeJson);
          const expiryDate = new Date(storedJoke.expiryDate);

          // If joke hasn't expired, use it
          if (expiryDate > new Date()) {
            setJoke(storedJoke.joke);
            setLoading(false);
            return;
          }
        }

        // Reset refresh state
        setRefresh(false);

        // Fetch new joke
        const response = await fetch("https://icanhazdadjoke.com/", {
          headers: {
            Accept: "application/json",
            "User-Agent": "Lenkalica Website (https://github.com/lenkalica)",
          },
        });
        const data = await response.json();

        // Set expiry date to next day at midnight
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        // Store in localStorage
        const storedJoke: StoredJoke = {
          joke: data,
          expiryDate: tomorrow.toISOString(),
        };
        localStorage.setItem("dadJoke", JSON.stringify(storedJoke));

        setJoke(data);
      } catch (error) {
        console.error("Error fetching dad joke:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch dad joke");
      } finally {
        setLoading(false);
      }
    };

    fetchJoke();
  }, [refresh]);

  const handleRefresh = () => {
    localStorage.removeItem("dadJoke"); // Clear the stored joke
    setLoading(true); // Show loading state while fetching
    setRefresh(true); // Trigger re-fetch in useEffect
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !joke) {
    return (
      <div className="alert alert-error min-h-[200px] items-center justify-center">
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
        <span>{error || "No joke available"}</span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="min-h-[100px] flex flex-col items-center justify-center text-center">
          <p className="text-base-content text-xl mb-4 font-medium">{joke.joke}</p>
        </div>
        <div className="card-actions justify-end mt-6">
          <button
            className="btn btn-circle btn-ghost hover:rotate-180 transition-transform duration-300"
            onClick={handleRefresh}
            title="Get new joke"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
