"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import MDEditor from "@uiw/react-md-editor";

export default function PostEditorPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [postNumber, setPostNumber] = useState("");
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-fetch the next post number
    const fetchNextPostNumber = async () => {
      try {
        const response = await fetch("/api/posts/next-number");
        if (response.ok) {
          const { nextNumber } = await response.json();
          setPostNumber(nextNumber);
        } else {
          console.error("Failed to fetch next post number");
          setPostNumber("013"); // fallback
        }
      } catch (error) {
        console.error("Error fetching next post number:", error);
        setPostNumber("013"); // fallback
      }
    };

    fetchNextPostNumber();
  }, []);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInlineImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const { imageUrl } = await response.json();
      // Insert markdown image syntax at cursor position
      const imageMarkdown = `![](${imageUrl})`;
      setContent((prev) => prev + "\n" + imageMarkdown + "\n");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert("Please drop image files only");
      return;
    }

    // Upload each image file
    imageFiles.forEach(file => {
      handleInlineImageUpload(file);
    });
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const formatFileName = (title: string) => {
    return title
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/__+/g, "_") // Replace multiple underscores with single
      .trim();
  };

  const handleGenerateMetadata = async () => {
    if (!content || !title) {
      alert("Please enter a title and content first");
      return;
    }

    setIsGeneratingMetadata(true);
    try {
      const response = await fetch("/api/generate-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate metadata");
      }

      const { metadata } = await response.json();
      const metadataContent = `---
title: ${title}
date: "${new Date().toISOString().split("T")[0]}"
category: "${metadata.category}"
tags: ${JSON.stringify(metadata.tags, null, 2)}
excerpt: "${metadata.excerpt}"
author: "${metadata.author}"
---

`;

      // Set the content with metadata
      setContent(metadataContent + content);
    } catch (error) {
      console.error("Error generating metadata:", error);
      alert("Failed to generate metadata. Please try again.");
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formattedTitle = formatFileName(title);
      const markdownFileName = `${postNumber}-${formattedTitle}.md`;
      const coverImageFileName = `${postNumber}-${formattedTitle}.png`;
      const audioFileName = audioFile ? `${postNumber}-${formattedTitle}.mp3` : null;

      const formData = new FormData();
      formData.append("markdownFileName", markdownFileName);
      formData.append("content", content);

      if (coverImage) {
        formData.append("coverImage", coverImage);
        formData.append("coverImageFileName", coverImageFileName);
      }

      if (audioFile && audioFileName) {
        formData.append("audioFile", audioFile);
        formData.append("audioFileName", audioFileName);
      }

      const response = await fetch("/api/posts/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      // Reset form on success
      setTitle("");
      setContent("");
      setCoverImage(null);
      setAudioFile(null);
      setImagePreview(null);

      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-base-content">Create New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Number and Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="postNumber" className="label">
                <span className="label-text">Post Number</span>
              </label>
              <input
                type="text"
                id="postNumber"
                value={postNumber}
                onChange={(e) => setPostNumber(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter post number"
                required
              />
            </div>
            <div>
              <label htmlFor="title" className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                required
              />
              {title && (
                <div className="mt-2 text-sm text-base-content/70">
                  <span className="font-medium">Filename preview:</span> {postNumber}-{formatFileName(title)}.md
                </div>
              )}
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label htmlFor="coverImage" className="label">
              <span className="label-text">Cover Image</span>
            </label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="file-input file-input-bordered w-full"
              required
            />
            {imagePreview && (
              <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden">
                <Image src={imagePreview} alt="Cover preview" fill className="object-cover" />
              </div>
            )}
          </div>

          {/* Audio Upload */}
          <div>
            <label htmlFor="audioFile" className="label">
              <span className="label-text">Audio File (MP3)</span>
            </label>
            <input
              type="file"
              id="audioFile"
              accept="audio/mp3"
              onChange={handleAudioChange}
              className="file-input file-input-bordered w-full"
            />
            {audioFile && <p className="mt-2 text-base-content/70">Selected file: {audioFile.name}</p>}
          </div>

          {/* Markdown Editor */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label">
                <span className="label-text">Content</span>
                <span className="label-text-alt text-base-content/60">Drag & drop images or use the button</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleInlineImageUpload(file);
                  }}
                  className="hidden"
                  id="inline-image-upload"
                />
                <label htmlFor="inline-image-upload" className="btn btn-sm btn-ghost gap-2 cursor-pointer">
                  <PhotoIcon className="h-4 w-4" />
                  Add Image
                </label>
              </div>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative ${isDragOver ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : ''}`}
            >
              {isDragOver && (
                <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary z-10 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <PhotoIcon className="h-12 w-12 mx-auto text-primary mb-2" />
                    <p className="text-primary font-medium">Drop images here to add them to your post</p>
                  </div>
                </div>
              )}
              {mounted ? (
                <div data-color-mode={theme === "dark" ? "dark" : "light"}>
                  <MDEditor
                    value={content}
                    onChange={(value) => setContent(value || "")}
                    preview="live"
                    height={600}
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="w-full h-[600px] bg-base-200 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="text-base-content/60">Loading editor...</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleGenerateMetadata}
              disabled={isGeneratingMetadata || !content || !title}
              className="btn btn-neutral"
            >
              {isGeneratingMetadata ? "Generating..." : "Create Metadata"}
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
