"use client";

import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
}

export function ImageWithFallback({ src, alt }: ImageWithFallbackProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-200 group-hover:scale-105"
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        target.src = "/fallback-shorts/default.png";
      }}
    />
  );
}
