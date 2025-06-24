"use client";

import { useState, useEffect } from "react";

type Fact = {
  id: string;
  text: string;
  source: string;
  sourceUrl: string;
  language: string;
};

type StoredFacts = {
  facts: Fact[];
  expiryDate: string;
};

export default function RandomFacts() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        // Check if we have cached facts that haven't expired
        const storedFactsJson = localStorage.getItem("randomFacts");
        if (storedFactsJson && !refresh) {
          const storedFacts: StoredFacts = JSON.parse(storedFactsJson);
          const expiryDate = new Date(storedFacts.expiryDate);

          // If facts haven't expired, use them
          if (expiryDate > new Date()) {
            setFacts(storedFacts.facts);
            setLoading(false);
            return;
          }
        }

        // Reset refresh state
        setRefresh(false);

        // Fetch 3 new facts
        const newFacts: Fact[] = [];
        for (let i = 0; i < 3; i++) {
          const response = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
          const data = await response.json();
          newFacts.push(data);
        }

        // Set expiry date to next day at midnight
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        // Store in localStorage
        const storedFacts: StoredFacts = {
          facts: newFacts,
          expiryDate: tomorrow.toISOString(),
        };
        localStorage.setItem("randomFacts", JSON.stringify(storedFacts));

        setFacts(newFacts);
      } catch (error) {
        console.error("Error fetching random facts:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch random facts");
      } finally {
        setLoading(false);
      }
    };

    fetchFacts();
  }, [refresh]);

  const handleRefresh = () => {
    localStorage.removeItem("randomFacts"); // Clear the stored facts
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

  if (error || facts.length === 0) {
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
        <span>{error || "No facts available"}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {facts.map((fact) => (
          <div key={fact.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="min-h-[100px]">
                <p className="text-base-content text-lg mb-4">{fact.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          className="btn btn-circle btn-ghost hover:rotate-180 transition-transform duration-300"
          onClick={handleRefresh}
          title="Get new facts"
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
  );
}
