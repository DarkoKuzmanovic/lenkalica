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
      <div className="min-h-screen grid place-items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
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

        {/* Content Sections */}
        <div className="grid gap-8" onKeyDown={handleKeyboardNavigation} tabIndex={-1}>
          {/* Word of the Day */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2>Word of the Day</h2>
              </div>
              <WordOfDay />
            </div>
          </motion.section>

          {/* NASA Image */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2>NASA Astronomy Picture of the Day</h2>
              </div>
              <NasaImageOfDay />
            </div>
          </motion.section>

          {/* Random Facts */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2>Random Facts</h2>
              </div>
              <RandomFacts />
            </div>
          </motion.section>

          {/* Dad Joke */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2>Dad Joke of the Day</h2>
              </div>
              <DadJoke />
            </div>
          </motion.section>

          {/* Artwork */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2>Artwork of the Day</h2>
              </div>
              <ArtworkOfDay />
            </div>
          </motion.section>

          {/* Live Webcam */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2>Daily Live Webcam from Around the World</h2>
              </div>
              <LiveWebcam />
            </div>
          </motion.section>
        </div>
      </div>
    </motion.main>
  );
}
