"use client";

import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/articles";
import { calculateReadingTime } from "@/utils/readingTime";
import { motion } from "framer-motion";

export default function ArticleCard({ article }: { article: Article }) {
  const readingTime = calculateReadingTime(article.content);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <figure className="relative h-56 overflow-hidden">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </figure>
      <div className="card-body p-6">
        <div className="flex-1">
          <div className="badge badge-primary mb-2">{article.category}</div>
          <Link href={`/articles/${article.id}`} className="block group">
            <h2 className="card-title text-xl mb-2 group-hover:text-primary transition-colors">{article.title}</h2>
          </Link>
          <p className="text-base-content/80 line-clamp-3 mb-6">{article.excerpt}</p>
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
