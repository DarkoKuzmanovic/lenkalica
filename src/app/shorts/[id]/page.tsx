"use client";

import ArticleMeta from "@/components/ArticleMeta";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import type { Short } from "@/lib/shorts";

export default function ShortPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [short, setShort] = useState<Short | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Resolve params promise
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

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
    if (!id) return;
    
    const loadShort = async () => {
      try {
        const response = await fetch(`/api/shorts/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch short");
        }
        const data = await response.json();
        setShort(data);
      } catch (error) {
        console.error("Error loading short:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadShort();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p className="text-base-content/70">Loading short...</p>
        </div>
      </div>
    );
  }

  if (!short) {
    notFound();
  }

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-base-300 z-50">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <header className="mb-8">
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-6">
            <Image
              src={short.coverImage}
              alt={short.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight">
                {short.title}
              </h1>
              {short.excerpt && (
                <p className="text-lg opacity-90 max-w-2xl leading-relaxed">
                  {short.excerpt}
                </p>
              )}
            </div>
          </div>

          <ArticleMeta article={short} />
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none
            prose-headings:text-base-content 
            prose-p:text-base-content/90 
            prose-strong:text-base-content
            prose-em:text-base-content
            prose-blockquote:text-base-content/80
            prose-blockquote:border-l-primary
            prose-code:text-primary
            prose-code:bg-base-200
            prose-pre:bg-base-200
            prose-th:text-base-content
            prose-td:text-base-content
            prose-hr:border-base-300
            prose-li:text-base-content/90
            prose-a:text-primary
            prose-a:no-underline
            hover:prose-a:underline
            prose-img:rounded-lg
            prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: short.content }}
        />

        {/* Back to Shorts */}
        <div className="mt-12 pt-8 border-t border-base-300">
          <Link
            href="/shorts"
            className="btn btn-outline btn-primary"
          >
            ← Back to Shorts
          </Link>
        </div>
      </article>
    </>
  );
}