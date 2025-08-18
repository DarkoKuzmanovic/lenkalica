"use client";

import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/articles";
import { calculateReadingTime } from "@/utils/readingTime";
import { motion } from "framer-motion";

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact' | 'list';
  priority?: boolean;
}

export default function ArticleCard({ article, variant = 'default', priority = false }: ArticleCardProps) {
  const readingTime = calculateReadingTime(article.content);
  
  // Check if article is new (published within last 7 days)
  const isNew = new Date().getTime() - new Date(article.date).getTime() < 7 * 24 * 60 * 60 * 1000;
  
  const getCardClasses = () => {
    const baseClasses = "card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale focus-ring group";
    const variantClasses = {
      default: "",
      featured: "card-featured lg:col-span-2",
      compact: "card-compact",
      list: "card-list"
    };
    return `${baseClasses} ${variantClasses[variant]}`;
  };
  
  const getFigureHeight = () => {
    const heights = {
      default: "h-56",
      featured: "h-72",
      compact: "h-32", 
      list: "h-32"
    };
    return heights[variant];
  };

  return (
    <motion.div
      whileHover={{ y: variant === 'featured' ? -6 : -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={getCardClasses()}
    >
      <figure className={`relative ${getFigureHeight()} overflow-hidden`}>
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
        />
        {variant === 'featured' && (
          <div className="absolute top-4 left-4">
            <span className="badge badge-primary badge-lg">
              ⭐ Featured
            </span>
          </div>
        )}
        {isNew && !['featured'].includes(variant) && (
          <div className="absolute top-3 right-3">
            <span className="status-badge status-new">
              ✨ New
            </span>
          </div>
        )}
        {isNew && variant === 'featured' && (
          <div className="absolute top-4 right-4">
            <span className="status-badge status-new">
              ✨ New
            </span>
          </div>
        )}
      </figure>
      <div className={`card-body ${variant === 'compact' ? 'p-4' : 'p-6'}`}>
        <div className="flex-1">
          <div className="badge badge-primary mb-2">{article.category}</div>
          <Link href={`/articles/${article.id}`} className="block group">
            <h2 className={`card-title mb-2 group-hover:text-primary transition-colors ${
              variant === 'featured' ? 'text-2xl' : variant === 'compact' ? 'text-lg' : 'text-xl'
            }`}>{article.title}</h2>
          </Link>
          <p className={`text-base-content/80 ${
            variant === 'compact' ? 'line-clamp-2 mb-4' : variant === 'list' ? 'line-clamp-2 mb-4' : 'line-clamp-3 mb-6'
          }`}>{article.excerpt}</p>
        </div>
        <div className="card-actions justify-between items-center pt-4 border-t border-base-300">
          <time dateTime={article.date} className="text-sm text-base-content/60">
            {new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <div className="flex items-center text-sm text-base-content/60">
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {readingTime}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
