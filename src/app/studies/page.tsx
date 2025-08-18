"use client";

import StudyCard from "@/components/StudyCard";
import SkeletonCard from "@/components/SkeletonCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Study } from "@/lib/studies";
import Pagination from "@/components/Pagination";

interface PaginatedResponse {
  data: Study[];
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

export default function StudiesPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudies = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/studies?page=${page}&limit=6`);
      const data: PaginatedResponse = await response.json();
      setStudies(data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error loading studies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies(currentPage);
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-display mb-6">In-Depth Studies</h1>
          <p className="text-body-large">
            Comprehensive explorations of complex topics through research-backed analysis and interactive visualizations. 
            Each study offers deep insights into psychology, culture, science, and human behavior.
          </p>
        </div>
        {isLoading ? (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard variant="featured" />
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonCard key={index} variant="default" />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {studies.map((study, index) => (
                <motion.div key={study.slug} variants={item}>
                  <StudyCard 
                    study={study} 
                    variant={index === 0 && currentPage === 1 ? 'featured' : 'default'}
                    priority={index === 0}
                  />
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