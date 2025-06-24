"use client";

import Image from "next/image";
import Link from "next/link";

interface Short {
  id: string;
  title: string;
  date: string;
  url: string;
  image: string;
}

export default function ShortsCard({ short }: { short: Short }) {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <figure className="relative h-56 overflow-hidden">
        <Image
          src={short.image}
          alt={short.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </figure>
      <div className="card-body p-6">
        <div className="flex-1">
          <Link href={short.url} className="block group">
            <h2 className="card-title text-xl mb-2 group-hover:text-primary transition-colors">{short.title}</h2>
          </Link>
        </div>
        <div className="card-actions justify-between items-center pt-4 border-t border-base-300">
          <time dateTime={short.date} className="text-sm text-base-content/60">
            {new Date(short.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
    </div>
  );
}
