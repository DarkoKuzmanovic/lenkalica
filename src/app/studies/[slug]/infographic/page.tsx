"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Study } from "@/lib/studies";

export default function InfographicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [study, setStudy] = useState<Study | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [infographicContent, setInfographicContent] = useState<string>("");

  useEffect(() => {
    const loadStudyAndInfographic = async () => {
      try {
        // Load study metadata
        const studyResponse = await fetch(`/api/studies/${slug}`);
        if (!studyResponse.ok) {
          if (studyResponse.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch study");
        }
        const studyData = await studyResponse.json();
        setStudy(studyData);

        // Load infographic content
        const infographicResponse = await fetch(`/api/studies/${slug}/infographic`);
        if (!infographicResponse.ok) {
          throw new Error("Failed to fetch infographic");
        }
        const infographicHtml = await infographicResponse.text();
        setInfographicContent(infographicHtml);
      } catch (error) {
        console.error("Error loading study or infographic:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStudyAndInfographic();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!study || !infographicContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Infographic Not Found</h1>
          <p className="text-base-content/70 mb-6">The requested infographic could not be loaded.</p>
          <Link href="/studies" className="btn btn-primary">
            ← Back to Studies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header with back link */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/studies/${slug}`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Article
              </Link>
              <div className="divider divider-horizontal"></div>
              <h1 className="text-lg font-semibold truncate">{study.title}</h1>
            </div>
            <div className="badge badge-secondary">
              📊 Interactive Infographic
            </div>
          </div>
        </div>
      </div>

      {/* Infographic Content */}
      <div className="w-full h-[calc(100vh-73px)]">
        <iframe
          srcDoc={infographicContent}
          className="w-full h-full border-0"
          title={`${study.title} - Interactive Infographic`}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}