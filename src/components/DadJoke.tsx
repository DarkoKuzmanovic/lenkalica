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

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        // Check if we have a cached joke that hasn't expired
        const storedJokeJson = localStorage.getItem("dadJoke");
        if (storedJokeJson) {
          const storedJoke: StoredJoke = JSON.parse(storedJokeJson);
          const expiryDate = new Date(storedJoke.expiryDate);

          // If joke hasn't expired, use it
          if (expiryDate > new Date()) {
            setJoke(storedJoke.joke);
            setLoading(false);
            return;
          }
        }

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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !joke) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-red-600 dark:text-red-400">
        {error || "No joke available"}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="min-h-[100px] flex flex-col items-center justify-center text-center">
          <p className="text-gray-600 dark:text-gray-300 text-xl mb-4 font-medium">{joke.joke}</p>
          <a
            href={`https://icanhazdadjoke.com/j/${joke.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
          >
            View on icanhazdadjoke →
          </a>
        </div>
      </div>
    </div>
  );
}
