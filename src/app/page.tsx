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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="hero bg-base-200 rounded-box p-8 mb-16">
          <div className="hero-content text-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">Welcome to Lenkalica</h1>
              <p className="text-xl text-base-content/80">Exploring stories about culture, history, and geography.</p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16" onKeyDown={handleKeyboardNavigation} tabIndex={-1}>
          {/* Word of the Day */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Word of the Day</h2>
              <a
                href="https://www.merriam-webster.com/word-of-the-day"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary text-sm font-medium"
              >
                Visit Merriam-Webster →
              </a>
            </div>
            <WordOfDay />
          </motion.section>

          {/* NASA Image */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">NASA Astronomy Picture of the Day</h2>
              <a
                href="https://apod.nasa.gov/apod/"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary text-sm font-medium"
              >
                Visit APOD Website →
              </a>
            </div>
            <NasaImageOfDay />
          </motion.section>

          {/* Random Facts */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Random Facts</h2>
              <a
                href="https://uselessfacts.jsph.pl/"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary text-sm font-medium"
              >
                Visit Random Facts API →
              </a>
            </div>
            <RandomFacts />
          </motion.section>

          {/* Dad Joke */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Dad Joke of the Day</h2>
              <a
                href="https://icanhazdadjoke.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary text-sm font-medium"
              >
                Visit icanhazdadjoke →
              </a>
            </div>
            <DadJoke />
          </motion.section>

          {/* Artwork */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Artwork of the Day</h2>
              <a
                href="https://www.artic.edu/collection"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary text-sm font-medium"
              >
                Visit Art Institute of Chicago →
              </a>
            </div>
            <ArtworkOfDay />
          </motion.section>

          {/* Live Webcam */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Daily Live Webcam from Around the World</h2>
            </div>
            <LiveWebcam />
          </motion.section>
        </div>
      </div>
    </motion.main>
  );
}
