"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Comic } from "@/lib/comics";
import ComicCard from "@/components/ComicCard";
import ImageViewer from "@/components/ImageViewer";
import Pagination from "@/components/Pagination";
import SkeletonGrid from "@/components/SkeletonGrid";

interface PaginatedResponse {
  data: Comic[];
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

export default function ComicsPage() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchComics = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/comics?page=${page}&limit=9`);
      const data: PaginatedResponse = await response.json();
      setComics(data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error loading comics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComics(currentPage);
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="mb-4">Comics</h1>
          <p className="text-lg leading-relaxed text-base-content/80">
            Enjoy our collection of comics and illustrations.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-16">
            <SkeletonGrid count={9} columns={3} type="images" />
          </div>
        ) : (
          <>
            <motion.div
              className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {comics.map((comic, index) => (
                <motion.div key={comic.id} variants={item}>
                  <ComicCard comic={comic} onClick={() => handleImageClick(index)} />
                </motion.div>
              ))}
            </motion.div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </>
        )}
      </div>

      <ImageViewer
        comics={comics}
        currentIndex={currentImageIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onNavigate={setCurrentImageIndex}
      />
    </div>
  );
}
