"use client";

import { motion } from "framer-motion";

interface ArticleContentProps {
  content: string;
  tags?: string[];
}

export default function ArticleContent({ content, tags }: ArticleContentProps) {
  return (
    <motion.div
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-headings:text-base-content prose-p:text-base-content/80 prose-a:text-primary hover:prose-a:text-primary/80"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Tags */}
      {tags && tags.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2 my-12 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {tags.map((tag, index) => (
            <motion.div
              key={tag}
              className="badge badge-lg badge-primary badge-outline"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
