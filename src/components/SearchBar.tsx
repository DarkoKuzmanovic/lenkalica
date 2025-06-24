"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  type: "article" | "podcast" | "short";
  url: string;
  excerpt?: string;
  image?: string;
  date?: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchContent = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
        const data: SearchResponse = await response.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchContent, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (url: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
          </svg>
        );
      case "podcast":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-4.62c0-.819-.29-1.56-.8-2.16A3 3 0 0 0 12 9c.55 0 1.056.26 1.377.69.32.43.477.99.477 1.56v4.62c0 1.44 1.555 2.342 2.805 1.628A12.05 12.05 0 0 0 24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 3.445 1.451 6.563 3.805 8.44Z" />
          </svg>
        );
      case "short":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0119.5 6v6a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 12V6zM3 16.06V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input input-bordered input-sm w-full max-w-xs bg-base-200/30 focus:bg-base-200/70 transition-all duration-200 pl-9 pr-4 text-sm placeholder:text-base-content/50 border-base-300/50 focus:border-primary/50"
        />
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-base-content/50">
          {isLoading ? (
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-primary border-t-transparent"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300/60 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto backdrop-blur-sm"
          >
            <div className="p-1">
              {results.map((result, index) => (
                <motion.button
                  key={`${result.type}-${result.id}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleResultClick(result.url)}
                  className="w-full text-left p-2.5 rounded-md hover:bg-base-200/80 transition-all duration-150 border-none bg-transparent group"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex items-center gap-1.5 text-base-content/50 mt-0.5 min-w-0">
                      {getTypeIcon(result.type)}
                      <span className="text-xs uppercase tracking-wider font-medium text-base-content/40">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-base-content line-clamp-1 group-hover:text-primary transition-colors">
                        {result.title}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            
            {results.length > 0 && (
              <div className="border-t border-base-300/50 px-3 py-2 bg-base-200/30">
                <p className="text-xs text-base-content/50 text-center">
                  {results.length} result{results.length !== 1 ? 's' : ''} • ESC to close
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && query.trim().length >= 2 && results.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300/60 rounded-lg shadow-xl z-50 backdrop-blur-sm"
        >
          <div className="p-4 text-center">
            <div className="text-base-content/30 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mx-auto">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-base-content/60 text-sm mb-1">
              No results for &quot;{query}&quot;
            </p>
            <p className="text-base-content/40 text-xs">
              Try different keywords
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}