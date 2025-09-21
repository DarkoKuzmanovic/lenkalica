"use client";

import Image from "next/image";
import Link from "next/link";
import type { Short } from "@/lib/shorts";
import { calculateReadingTime } from "@/utils/readingTime";
import { motion } from "framer-motion";

interface ShortCardProps {
  short: Short;
  variant?: 'default' | 'featured' | 'compact' | 'list';
  priority?: boolean;
}

export default function ShortCard({ short, variant = 'default', priority = false }: ShortCardProps) {
  const readingTime = calculateReadingTime(short.content);
  
  // Check if short is new (published within last 7 days)
  const isNew = new Date().getTime() - new Date(short.date).getTime() < 7 * 24 * 60 * 60 * 1000;
  
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
          src={short.coverImage}
          alt={short.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={priority}
          sizes={variant === 'featured' ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        {isNew && (
          <div className="absolute top-4 left-4 badge badge-accent badge-sm animate-pulse">
            New
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base-content/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </figure>
      
      <div className="card-body">
        <h3 className="card-title text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors duration-200">
          <Link 
            href={`/shorts/${short.id}`}
            className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            {short.title}
          </Link>
        </h3>
        
        {short.excerpt && (
          <p className="text-base-content/70 text-sm line-clamp-3 leading-relaxed">
            {short.excerpt}
          </p>
        )}
        
        <div className="card-actions justify-between items-center mt-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="badge badge-ghost badge-sm">
              {readingTime} min read
            </div>
            {short.category && (
              <div className="badge badge-secondary badge-sm">
                {short.category}
              </div>
            )}
          </div>
          
          <time className="text-xs text-base-content/60" dateTime={short.date}>
            {new Date(short.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
        </div>
      </div>
    </motion.div>
  );
}