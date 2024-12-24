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

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        // Check if we have cached facts that haven't expired
        const storedFactsJson = localStorage.getItem("randomFacts");
        if (storedFactsJson) {
          const storedFacts: StoredFacts = JSON.parse(storedFactsJson);
          const expiryDate = new Date(storedFacts.expiryDate);

          // If facts haven't expired, use them
          if (expiryDate > new Date()) {
            setFacts(storedFacts.facts);
            setLoading(false);
            return;
          }
        }

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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || facts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-red-600 dark:text-red-400">
        {error || "No facts available"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {facts.map((fact) => (
        <div key={fact.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="min-h-[100px]">
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{fact.text}</p>
              <a
                href={fact.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
              >
                Source: {fact.source}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
