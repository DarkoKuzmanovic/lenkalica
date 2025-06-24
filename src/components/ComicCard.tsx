"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Comic } from "@/lib/comics";

interface ComicCardProps {
  comic: Comic;
  onClick: () => void;
}

export default function ComicCard({ comic, onClick }: ComicCardProps) {
  return (
    <motion.div
      className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      <figure className="relative h-64">
        <Image src={comic.image} alt={`Comic ${comic.id}`} fill className="object-contain" />
      </figure>
    </motion.div>
  );
}
