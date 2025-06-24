"use client";

import ArticleCard from "@/components/ArticleCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Article } from "@/lib/articles";
import Pagination from "@/components/Pagination";

interface PaginatedResponse {
  data: Article[];
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

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArticles = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/articles?page=${page}&limit=6`);
      const data: PaginatedResponse = await response.json();
      setArticles(data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
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
          <h1 className="mb-4">Articles & Stories</h1>
          <p className="text-lg leading-relaxed text-base-content/80">
            Discover fascinating stories about culture, history, and geography. Each article is carefully crafted to
            bring you unique insights and perspectives.
          </p>
        </div>
        {isLoading ? (
          <div className="mt-16 flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            <motion.div
              className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {articles.map((article) => (
                <motion.div key={article.id} variants={item}>
                  <ArticleCard article={article} />
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
