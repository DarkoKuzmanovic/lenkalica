"use client";

import ArticleMeta from "@/components/ArticleMeta";
import Image from "next/image";
import { notFound } from "next/navigation";
import AudioButton from "@/components/AudioButton";
import TTSButton from "@/components/TTSButton";
import ArticleContent from "./ArticleContent";
import { useEffect, useState, use } from "react";
import type { Article } from "@/lib/articles";

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!article) return null;

  // Remove HTML tags for TTS
  const plainText = article.content.replace(/<[^>]*>/g, "");

  return (
    <div className="py-8">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="card bg-base-100 shadow-xl mb-12">
          <figure className="relative w-full h-[400px]">
            <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
          </figure>
        </div>

        {/* Article Header */}
        <header className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="mb-4">{article.title}</h1>
          <ArticleMeta article={article} />
          <div className="mt-6 flex items-center justify-center gap-4">
            {article.audioFile && <AudioButton audioUrl={article.audioFile} title={article.title} />}
            <TTSButton text={plainText} title={article.title} />
          </div>
        </header>

        {/* Article Content */}
        <ArticleContent content={article.content} tags={article.tags} />
      </article>
    </div>
  );
}
