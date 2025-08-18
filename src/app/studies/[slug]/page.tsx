"use client";

import StudyMeta from "@/components/StudyMeta";
import Image from "next/image";
import { notFound } from "next/navigation";
import StudyContent from "./StudyContent";
import { useEffect, useState, use } from "react";
import type { Study } from "@/lib/studies";

export default function StudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [study, setStudy] = useState<Study | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showInfographic, setShowInfographic] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadStudy = async () => {
      try {
        const response = await fetch(`/api/studies/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch study");
        }
        const data = await response.json();
        setStudy(data);
      } catch (error) {
        console.error("Error loading study:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStudy();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!study) return null;

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-base-300 z-50">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="py-8">
        <article className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
          {/* Hero Section */}
          <div className="card bg-base-100 shadow-xl mb-12">
            <figure className="relative w-full h-[400px]">
              <Image 
                src={study.coverImage || `/images/covers/${study.slug}.png`} 
                alt={study.title} 
                fill 
                className="object-cover" 
                priority 
              />
            </figure>
          </div>

          {/* Study Header */}
          <header className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="mb-4">{study.title}</h1>
            <StudyMeta study={study} />
            
            {/* Interactive Toggle */}
            {study.hasInfographic && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="tabs tabs-boxed">
                  <button 
                    className={`tab ${!showInfographic ? 'tab-active' : ''}`}
                    onClick={() => setShowInfographic(false)}
                  >
                    📖 Article
                  </button>
                  <button 
                    className={`tab ${showInfographic ? 'tab-active' : ''}`}
                    onClick={() => setShowInfographic(true)}
                  >
                    📊 Interactive
                  </button>
                </div>
                <div className="badge badge-info gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Switch between reading and interactive modes
                </div>
              </div>
            )}
          </header>

          {/* Content Display */}
          {showInfographic && study.hasInfographic ? (
            <div className="w-full">
              <iframe
                src={`/api/studies/${study.slug}/infographic`}
                className="w-full h-screen border-0 rounded-lg shadow-lg"
                title={`${study.title} - Interactive Infographic`}
              />
            </div>
          ) : (
            <StudyContent content={study.content} tags={study.tags} />
          )}
        </article>
      </div>
    </>
  );
}