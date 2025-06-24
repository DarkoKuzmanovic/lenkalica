"use client";

import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/articles";

export default function PodcastCard({ podcast }: { podcast: Article }) {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <figure className="relative h-56 overflow-hidden">
        <Image
          src={podcast.coverImage}
          alt={podcast.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </figure>
      <div className="card-body p-6">
        <div className="flex-1">
          <Link href={`/articles/${podcast.id}`} className="block group">
            <h2 className="card-title text-xl mb-2 group-hover:text-primary transition-colors">{podcast.title}</h2>
          </Link>
          {podcast.excerpt && <p className="text-base-content/70 line-clamp-2 mb-4">{podcast.excerpt}</p>}
        </div>
        <div className="card-actions justify-between items-center pt-4 border-t border-base-300">
          <time dateTime={podcast.date} className="text-sm text-base-content/60">
            {new Date(podcast.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <Link href={`/articles/${podcast.id}`} className="btn btn-sm btn-primary gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Listen
          </Link>
        </div>
      </div>
    </div>
  );
}
