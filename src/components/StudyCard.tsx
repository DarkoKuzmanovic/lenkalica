"use client";

import Image from "next/image";
import Link from "next/link";
import type { Study } from "@/lib/studies";
import { motion } from "framer-motion";

interface StudyCardProps {
  study: Study;
  variant?: 'default' | 'featured' | 'compact' | 'list';
  priority?: boolean;
}

export default function StudyCard({ study, variant = 'default', priority = false }: StudyCardProps) {
  // Check if study is new (published within last 7 days)
  const isNew = new Date().getTime() - new Date(study.date).getTime() < 7 * 24 * 60 * 60 * 1000;
  
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
          src={study.coverImage || `/images/covers/${study.slug}.png`}
          alt={study.title}
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
        {study.hasInfographic && (
          <div className="absolute top-3 left-3">
            <span className="badge badge-secondary badge-sm">
              📊 Interactive
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
          <div className="badge badge-accent mb-2">{study.category}</div>
          <Link href={`/studies/${study.slug}`} className="block group">
            <h2 className={`card-title mb-2 group-hover:text-primary transition-colors ${
              variant === 'featured' ? 'text-2xl' : variant === 'compact' ? 'text-lg' : 'text-xl'
            }`}>{study.title}</h2>
          </Link>
          <p className={`text-base-content/80 ${
            variant === 'compact' ? 'line-clamp-2 mb-4' : variant === 'list' ? 'line-clamp-2 mb-4' : 'line-clamp-3 mb-6'
          }`}>{study.excerpt}</p>
        </div>
        <div className="card-actions justify-between items-center pt-4 border-t border-base-300">
          <time dateTime={study.date} className="text-sm text-base-content/60">
            {new Date(study.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <div className="flex items-center gap-4">
            {study.readingTime && (
              <div className="flex items-center text-sm text-base-content/60">
                <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {study.readingTime}
              </div>
            )}
            {study.wordCount && (
              <div className="flex items-center text-sm text-base-content/60">
                <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {study.wordCount.toLocaleString()} words
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}