"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Comic } from "@/lib/comics";

interface ComicCardProps {
  comic: Comic;
  onClick?: () => void;
  onEdit?: (comic: Comic) => void;
  onDelete?: (comicId: string) => void;
  showControls?: boolean;
}

export default function ComicCard({
  comic,
  onClick,
  onEdit,
  onDelete,
  showControls = true
}: ComicCardProps) {
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(comic);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(comic.id);
    }
  };

  return (
    <motion.div
      className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      whileHover={{ y: -5 }}
      onClick={handleCardClick}
    >
      <figure className="relative h-64">
        <Image
          src={comic.image}
          alt={`Comic ${comic.title || comic.id}`}
          fill
          className="object-contain"
        />

        {/* Series Badge */}
        {comic.series && (
          <div className="absolute top-2 left-2 badge badge-primary">
            {comic.series}
            {comic.issueNumber && ` #${comic.issueNumber}`}
          </div>
        )}
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title text-lg font-semibold line-clamp-2">
          {comic.title}
        </h2>

        {comic.description && (
          <p className="text-sm opacity-75 line-clamp-3">
            {comic.description}
          </p>
        )}

        {/* Tags */}
        {comic.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {comic.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="badge badge-outline badge-sm">
                {tag}
              </span>
            ))}
            {comic.tags.length > 3 && (
              <span className="badge badge-outline badge-sm">
                +{comic.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Publish Date */}
        <div className="text-xs opacity-50 mt-2">
          Published: {new Date(comic.publishDate).toLocaleDateString()}
        </div>

        {/* Control Buttons */}
        {showControls && (onEdit || onDelete) && (
          <div className="card-actions justify-end mt-4">
            {onEdit && (
              <button
                className="btn btn-sm btn-outline btn-primary"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-sm btn-outline btn-error"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}