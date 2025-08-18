"use client";

import { useState, useEffect } from "react";

interface StudyContentProps {
  content: string;
  tags?: string[];
}

export default function StudyContent({ content, tags }: StudyContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Study Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {/* Tags Section */}
      {tags && tags.length > 0 && (
        <div className="border-t border-base-300 pt-8 mt-12">
          <h3 className="text-xl font-bold mb-4">Topics Covered</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="badge badge-outline badge-lg">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Study Navigation */}
      <div className="flex justify-between items-center mt-16 pt-8 border-t border-base-300">
        <a href="/studies" className="btn btn-outline">
          ← Back to Studies
        </a>
        <div className="text-sm text-base-content/60">
          Scroll to top
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn btn-circle btn-sm ml-2"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}