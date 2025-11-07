"use client";

import { useState, useEffect } from "react";
import type { Comic } from "@/lib/comics";

interface ComicFormProps {
  comic?: Comic;
  series: string[];
  onClose: () => void;
  onSave: (comicData: Comic) => void;
}

export default function ComicForm({ comic, series, onClose, onSave }: ComicFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    series: "",
    issueNumber: "",
    tags: "",
    publishDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (comic) {
      setFormData({
        title: comic.title,
        description: comic.description || "",
        series: comic.series || "",
        issueNumber: comic.issueNumber?.toString() || "",
        tags: comic.tags.join(", "),
        publishDate: new Date(comic.publishDate).toISOString().split('T')[0],
      });
    }
  }, [comic]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const comicData: Comic = {
        id: comic?.id || "",
        title: formData.title,
        description: formData.description || undefined,
        series: formData.series || undefined,
        issueNumber: formData.issueNumber ? parseInt(formData.issueNumber, 10) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        publishDate: new Date(formData.publishDate),
        image: comic?.image || "",
        createdAt: comic?.createdAt ? new Date(comic.createdAt) : new Date(),
        updatedAt: new Date(),
      };

      await onSave(comicData);
    } catch (error) {
      console.error("Error saving comic:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <h3 className="font-bold text-xl mb-4">
          {comic ? "Edit Comic" : "Add New Comic"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title *</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="Enter comic title"
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full h-24"
              placeholder="Enter comic description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Series */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Series</span>
              </label>
              <select
                name="series"
                value={formData.series}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="">Select series or create new</option>
                {series.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or create new series"
                className="input input-bordered input-sm w-full mt-2"
                onChange={(e) => {
                  if (e.target.value) {
                    setFormData(prev => ({ ...prev, series: e.target.value }));
                  }
                }}
              />
            </div>

            {/* Issue Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Issue Number</span>
              </label>
              <input
                type="number"
                name="issueNumber"
                value={formData.issueNumber}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Optional"
                min="1"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Tags</span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="Enter tags separated by commas"
            />
            <label className="label">
              <span className="label-text-alt">Separate multiple tags with commas</span>
            </label>
          </div>

          {/* Publish Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Publish Date</span>
            </label>
            <input
              type="date"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Comic Preview (if editing) */}
          {comic && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Comic Preview</span>
              </label>
              <div className="relative h-64 bg-base-200 rounded-lg overflow-hidden">
                <img
                  src={comic.image}
                  alt={comic.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !formData.title}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                "Save Comic"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}