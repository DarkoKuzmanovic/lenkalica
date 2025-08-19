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
            
            {/* Interactive Infographic Link */}
            {study.hasInfographic && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href={`/studies/${study.slug}/infographic`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  📊 View Interactive Infographic
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <div className="badge badge-info gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Opens in new tab for better experience
                </div>
              </div>
            )}
          </header>

          {/* Content Display */}
          <StudyContent content={study.content} tags={study.tags} />
        </article>
      </div>
    </>
  );
}