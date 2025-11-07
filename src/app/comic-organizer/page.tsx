"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import type { Comic } from "@/lib/comics";
import ComicCard from "@/components/ComicCard";
import ComicForm from "@/components/ComicForm";
import ComicUploader from "@/components/ComicUploader";

interface ComicsResponse {
  data: Comic[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  filters: {
    series?: string;
    search?: string;
    sortBy: string;
    sortOrder: string;
  };
}

export default function ComicManagerPage() {
  useTheme(); // Keep theme hook for theme functionality
  const [comics, setComics] = useState<Comic[]>([]);
  const [series, setSeries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedSeries, setSelectedSeries] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("publishDate");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // UI states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);

  // Load comics
  const loadComics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        sortBy,
        sortOrder,
      });

      if (selectedSeries) params.append("series", selectedSeries);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/comics?${params}`);
      if (!response.ok) throw new Error("Failed to fetch comics");

      const data: ComicsResponse = await response.json();
      setComics(data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comics");
    } finally {
      setLoading(false);
    }
  };

  // Load series
  const loadSeries = async () => {
    try {
      const response = await fetch("/api/comics/series");
      if (!response.ok) throw new Error("Failed to fetch series");
      const data = await response.json();
      setSeries(data.data);
    } catch (err) {
      console.error("Failed to load series:", err);
    }
  };

  // Handle comic creation/update
  const handleComicSave = async (comicData: Comic) => {
    try {
      if (selectedComic) {
        // Update existing comic
        const response = await fetch(`/api/comics/${selectedComic.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(comicData),
        });

        if (!response.ok) throw new Error("Failed to update comic");
      } else {
        // Create new comic - this would be handled by the upload modal
        // For now, let's just refresh the comics list
      }

      setShowEditModal(false);
      setSelectedComic(null);
      loadComics();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save comic");
    }
  };

  // Handle comic deletion
  const handleComicDelete = async (comicId: string) => {
    if (!confirm("Are you sure you want to delete this comic?")) return;

    try {
      const response = await fetch(`/api/comics/${comicId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete comic");

      loadComics();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comic");
    }
  };

  // Handle comic upload
  const handleComicUpload = async (formData: FormData) => {
    try {
      const response = await fetch("/api/comics", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload comic");
      }

      setShowUploadModal(false);
      loadComics();
      loadSeries(); // Reload series in case new series was added
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload comic");
    }
  };

  // Effects
  useEffect(() => {
    loadComics();
    loadSeries();
  }, [currentPage, selectedSeries, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [selectedSeries, searchQuery, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Comic Organizer</h1>
          <div className="flex justify-between items-center">
            <p className="text-lg opacity-75">
              Manage your comic collection with ease
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowUploadModal(true)}
            >
              Upload New Comic
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search comics..."
                  className="input input-bordered w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Series Filter */}
              <div className="form-control">
                <select
                  className="select select-bordered w-full"
                  value={selectedSeries}
                  onChange={(e) => setSelectedSeries(e.target.value)}
                >
                  <option value="">All Series</option>
                  {series.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="form-control">
                <select
                  className="select select-bordered w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="publishDate">Publish Date</option>
                  <option value="title">Title</option>
                  <option value="series">Series</option>
                  <option value="createdAt">Created Date</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="form-control">
                <select
                  className="select select-bordered w-full"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="form-control">
                <div className="flex items-center justify-center h-full">
                  <span className="text-sm opacity-75">
                    {totalItems} comics found
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comics Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : comics.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-4">No comics found</h3>
            <p className="opacity-75 mb-6">
              {searchQuery || selectedSeries
                ? "Try adjusting your filters or search terms."
                : "Upload your first comic to get started!"}
            </p>
            {!searchQuery && !selectedSeries && (
              <button
                className="btn btn-primary"
                onClick={() => setShowUploadModal(true)}
              >
                Upload Your First Comic
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {comics.map((comic) => (
                <ComicCard
                  key={comic.id}
                  comic={comic}
                  onEdit={(comic) => {
                    setSelectedComic(comic);
                    setShowEditModal(true);
                  }}
                  onDelete={handleComicDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="btn-group">
                  <button
                    className="btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    «
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`btn ${page === currentPage ? "btn-active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    className="btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <ComicUploader
            onClose={() => setShowUploadModal(false)}
            onUpload={handleComicUpload}
            series={series}
          />
        )}

        {/* Edit Modal */}
        {showEditModal && selectedComic && (
          <ComicForm
            comic={selectedComic}
            series={series}
            onClose={() => {
              setShowEditModal(false);
              setSelectedComic(null);
            }}
            onSave={handleComicSave}
          />
        )}
      </div>
    </div>
  );
}