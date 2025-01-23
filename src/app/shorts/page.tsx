"use client";

import type { Short } from "@/lib/shorts";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useEffect, useState } from "react";
import ShortsCard from "@/components/ShortsCard";
import { motion } from "framer-motion";
import Pagination from "@/components/Pagination";

interface PaginatedResponse {
  data: Short[];
  currentPage: number;
  totalPages: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function ShortCard({ short }: { short: Short }) {
  return (
    <a href={short.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
      <article className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200 h-full flex flex-col">
        {/* Image */}
        <figure className="relative aspect-square">
          <ImageWithFallback src={short.image} alt={short.title} />
        </figure>

        {/* Content */}
        <div className="card-body flex-1 flex flex-col justify-between">
          <h2 className="card-title text-lg group-hover:text-primary transition-colors duration-200 line-clamp-3">
            {short.title}
          </h2>
          <time className="text-sm text-base-content/60 mt-auto">
            {new Date(short.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </article>
    </a>
  );
}

export default function ShortsPage() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchShorts = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/shorts?page=${page}&limit=6`);
      const data: PaginatedResponse = await response.json();
      setShorts(data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error loading shorts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts(currentPage);
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="mb-4">Shorts</h1>
          <p className="text-base-content/70">A curated collection of interesting articles from around the web.</p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="mt-16 flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            <motion.div
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {shorts.map((short) => (
                <motion.div key={short.id} variants={item}>
                  <ShortsCard short={short} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </>
        )}
      </div>
    </div>
  );
}
