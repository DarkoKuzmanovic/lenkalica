"use client";

import { useState, useEffect } from "react";
import NasaImageOfDay from "@/components/NasaImageOfDay";
import WordOfDay from "@/components/WordOfDay";
import ArtworkOfDay from "@/components/ArtworkOfDay";
import RandomFacts from "@/components/RandomFacts";
import DadJoke from "@/components/DadJoke";
import LiveWebcam from "@/components/LiveWebcam";
import { motion } from "framer-motion";

export default function HomePage() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setPageLoading(false);
  }, []);

  const handleKeyboardNavigation = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const sections = document.querySelectorAll("section");
      const currentSection = document.activeElement?.closest("section");
      const currentIndex = Array.from(sections).indexOf(currentSection as HTMLElement);
      const nextSection = sections[currentIndex + 1] || sections[0];
      (nextSection?.querySelector("h2, a, button") as HTMLElement)?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const sections = document.querySelectorAll("section");
      const currentSection = document.activeElement?.closest("section");
      const currentIndex = Array.from(sections).indexOf(currentSection as HTMLElement);
      const prevSection = sections[currentIndex - 1] || sections[sections.length - 1];
      (prevSection?.querySelector("h2, a, button") as HTMLElement)?.focus();
    }
  };

  if (pageLoading) {
    return (
      <div className="flex-1">
        <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-8">
          {/* Hero Section Skeleton */}
          <div className="hero mb-8">
            <div className="hero-content text-center py-12 px-0">
              <div className="max-w-2xl space-y-4 animate-pulse">
                <div className="h-12 bg-base-300 rounded-lg mx-auto w-3/4"></div>
                <div className="h-6 bg-base-300 rounded mx-auto w-1/2"></div>
              </div>
            </div>
          </div>

          {/* Content Sections Skeleton */}
          <div className="grid gap-6 lg:grid-cols-12 animate-pulse">
            {/* Featured content skeleton */}
            <div className="lg:col-span-8 card glass h-96 bg-base-300"></div>
            
            {/* Sidebar content skeleton */}
            <div className="lg:col-span-4 space-y-6">
              <div className="card glass h-48 bg-base-300"></div>
              <div className="card glass h-48 bg-base-300"></div>
            </div>

            {/* Bottom row skeleton */}
            <div className="lg:col-span-6 card glass h-64 bg-base-300"></div>
            <div className="lg:col-span-6 card glass h-64 bg-base-300"></div>
            
            {/* Full width skeleton */}
            <div className="lg:col-span-12 card glass h-80 bg-base-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.main className="flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="hero mb-8">
          <div className="hero-content text-center py-12 px-0">
            <div className="max-w-2xl">
              <h1 className="mb-4">Welcome to Lenkalica</h1>
              <p className="text-xl">Exploring stories about culture, history, and geography.</p>
            </div>
          </div>
        </div>

        {/* Content Sections - Dynamic Grid */}
        <div className="grid gap-6 lg:grid-cols-12" onKeyDown={handleKeyboardNavigation} tabIndex={-1}>
          {/* Featured Content - Large Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 card glass shadow-lg hover:shadow-xl transition-all duration-300 hover-lift-subtle"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-headline">NASA Astronomy Picture of the Day</h2>
              </div>
              <NasaImageOfDay />
            </div>
          </motion.section>

          {/* Sidebar Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Word of the Day */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card glass shadow-lg hover:shadow-xl transition-all duration-300 hover-lift-subtle"
            >
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-subheadline">Word of the Day</h3>
                </div>
                <WordOfDay />
              </div>
            </motion.section>

            {/* Dad Joke */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card glass shadow-lg hover:shadow-xl transition-all duration-300 hover-lift-subtle"
            >
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-subheadline">Dad Joke of the Day</h3>
                </div>
                <DadJoke />
              </div>
            </motion.section>
          </div>

          {/* Full Width Content Sections */}
          {/* Random Facts */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-6 card glass shadow-lg hover:shadow-xl transition-all duration-300 hover-lift-subtle"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-subheadline">Random Facts</h3>
              </div>
              <RandomFacts />
            </div>
          </motion.section>

          {/* Artwork */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-6 card glass shadow-lg hover:shadow-xl transition-all duration-300 hover-lift-subtle"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-subheadline">Artwork of the Day</h3>
              </div>
              <ArtworkOfDay />
            </div>
          </motion.section>

          {/* Live Webcam - Full Width */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-12 card glass shadow-lg hover:shadow-xl transition-all duration-300 hover-lift-subtle"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-headline">Daily Live Webcam from Around the World</h2>
              </div>
              <LiveWebcam />
            </div>
          </motion.section>
        </div>
      </div>
    </motion.main>
  );
}
