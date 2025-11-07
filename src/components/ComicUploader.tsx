"use client";

import { useState, useRef } from "react";

interface ComicUploaderProps {
  onClose: () => void;
  onUpload: (formData: FormData) => void;
  series: string[];
}

export default function ComicUploader({ onClose, onUpload, series }: ComicUploaderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    series: "",
    issueNumber: "",
    tags: "",
    publishDate: new Date().toISOString().split('T')[0],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file =>
      file.type.startsWith('image/') &&
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
    );

    if (imageFiles.length > 0) {
      handleFileSelect(imageFiles[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);

    // Generate title from filename if empty
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const title = fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      setFormData(prev => ({ ...prev, title }));
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !formData.title) {
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", selectedFile);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("series", formData.series);
      uploadFormData.append("issueNumber", formData.issueNumber);
      uploadFormData.append("tags", formData.tags);
      uploadFormData.append("publishDate", formData.publishDate);

      await onUpload(uploadFormData);
    } catch (error) {
      console.error("Error uploading comic:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <h3 className="font-bold text-xl mb-4">Upload New Comic</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Comic Image *</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-primary bg-primary/10'
                  : 'border-base-300 hover:border-base-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative h-64 mx-auto max-w-md">
                    <img
                      src={imagePreview}
                      alt="Comic preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <p className="text-sm opacity-75">
                    {selectedFile?.name}
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Choose Different Image
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-4xl">📸</div>
                  <div>
                    <p className="text-lg font-medium">Drop your comic image here</p>
                    <p className="text-sm opacity-75">or click to browse</p>
                  </div>
                  <p className="text-xs opacity-50">
                    Supports: JPG, PNG, GIF, WebP
                  </p>
                </div>
              )}
            </div>
          </div>

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
              disabled={isSubmitting || !selectedFile || !formData.title}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Uploading...
                </>
              ) : (
                "Upload Comic"
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