"use client";

import Image from "next/image";
import Link from "next/link";
import type { Short } from "@/lib/shorts";
import { calculateReadingTime } from "@/utils/readingTime";
import { motion } from "framer-motion";
import { ClockIcon } from "@heroicons/react/20/solid";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

interface ShortCardProps {
  short: Short;
  variant?: "default" | "featured" | "compact" | "list" | "wide";
  priority?: boolean;
}

export default function ShortCard({ short, variant = "default", priority = false }: ShortCardProps) {
  const readingTime = calculateReadingTime(short.content);
  const readingMinutes = Number.parseInt(readingTime, 10) || 1;

  // Mark as new only if published within the last 3 days
  const isNew = Date.now() - new Date(short.date).getTime() < THREE_DAYS_MS;

  const getCardClasses = () => {
    const baseClasses =
      "card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale focus-ring group";
    const variantClasses = {
      default: "",
      featured: "card-featured lg:col-span-2",
      compact: "card-compact",
      list: "card-list",
      wide: "md:h-full",
    };
    return `${baseClasses} ${variantClasses[variant]}`;
  };

  const getFigureClasses = () => {
    const classes = {
      default: "aspect-square",
      featured: "aspect-square lg:aspect-video", // Square on mobile, video on large screens for featured
      compact: "aspect-square",
      list: "aspect-square",
      wide: "aspect-square md:aspect-[2/1]",
    };
    return classes[variant];
  };

  return (
    <motion.div
      whileHover={{ y: variant === "featured" ? -6 : -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={getCardClasses()}
    >
      <figure className={`relative ${getFigureClasses()} overflow-hidden`}>
        <Image
          src={short.coverImage}
          alt={short.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={priority}
          sizes={variant === "featured" ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        {/* 30% dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
        {isNew && <div className="absolute top-4 left-4 badge badge-accent badge-sm animate-pulse z-10">New</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-base-content/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </figure>

      <div className="card-body">
        <h3 className="card-title text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors duration-200">
          <Link href={`/shorts/${short.id}`} className="focus:outline-none focus:ring-2 focus:ring-primary rounded">
            {short.title}
          </Link>
        </h3>

        {short.excerpt && <p className="text-base-content/70 text-sm line-clamp-3 leading-relaxed">{short.excerpt}</p>}

        <div className="card-actions mt-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="badge badge-ghost badge-sm inline-flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{readingMinutes} min</span>
            </div>
            {short.category && (
              <div
                className="badge badge-secondary badge-sm inline-flex items-center max-w-[7rem] overflow-hidden whitespace-nowrap"
                title={short.category}
              >
                <span className="truncate">{short.category}</span>
              </div>
            )}
          </div>

          <time className="text-xs text-base-content/60" dateTime={short.date}>
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(new Date(short.date))}
          </time>
        </div>
      </div>
    </motion.div>
  );
}
