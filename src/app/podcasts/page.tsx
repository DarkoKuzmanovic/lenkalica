"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Pagination from "@/components/Pagination";
import SkeletonGrid from "@/components/SkeletonGrid";
import type { Article } from "@/lib/articles";
import AudioButton from "@/components/AudioButton";
import { calculateReadingTime } from "@/utils/readingTime";
import { useAudioContext } from "@/context/AudioContext";

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

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { playAudio } = useAudioContext();

  const fetchPodcasts = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/podcasts?page=${page}&limit=6`);
      const data: PaginatedResponse = await response.json();
      setPodcasts(data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error loading podcasts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts(currentPage);
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
        {/* Hero Section */}
        <div className="hero bg-base-200 rounded-box p-8 mb-16">
          <div className="hero-content text-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">Podcasts</h1>
              <p className="text-xl text-base-content/80">
                Listen to our articles in audio format. Perfect for when you&apos;re on the go.
              </p>
              <div className="mt-6">
                <Link href="/api/podcast-xml" className="btn btn-primary gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                  Subscribe to RSS Feed
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="mt-16">
            <SkeletonGrid count={6} columns={2} type="mixed" />
          </div>
        ) : (
          <>
            <motion.div className="mt-12 space-y-6" variants={container} initial="hidden" animate="show">
              {podcasts.map((podcast) => (
                <motion.div
                  key={podcast.id}
                  variants={item}
                  className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Cover Image with Play Button Overlay */}
                    <figure className="relative w-full md:w-48 h-48 group cursor-pointer">
                      <Image src={podcast.coverImage} alt={podcast.title} fill className="object-cover" />
                      {podcast.audioFile && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button
                            onClick={() => playAudio(podcast.audioFile!, podcast.title)}
                            className="btn btn-circle btn-primary btn-lg bg-primary/80 hover:bg-primary border-none"
                          >
                            <svg
                              className="w-8 h-8"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </figure>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          {/* Meta Info */}
                          <div className="flex items-center gap-3 text-sm text-base-content/70 mb-2">
                            {podcast.category && <span className="badge badge-primary">{podcast.category}</span>}
                            <span className="text-base-content/60">{calculateReadingTime(podcast.content)}</span>
                          </div>

                          {/* Title */}
                          <Link href={`/articles/${podcast.id}`}>
                            <h2 className="text-xl font-semibold hover:text-primary transition-colors">
                              {podcast.title}
                            </h2>
                          </Link>

                          {/* Excerpt */}
                          {podcast.excerpt && (
                            <p className="mt-2 text-base-content/70 line-clamp-2">{podcast.excerpt}</p>
                          )}
                        </div>

                        {/* Bottom Section */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-300">
                          <time className="text-sm text-base-content/60">
                            {new Date(podcast.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                          {podcast.audioFile && <AudioButton audioUrl={podcast.audioFile} title={podcast.title} />}
                        </div>
                      </div>
                    </div>
                  </div>
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
