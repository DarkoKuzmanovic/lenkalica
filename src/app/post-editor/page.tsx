"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function PostEditorPage() {
  const [postNumber, setPostNumber] = useState("");
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);

  useEffect(() => {
    // Set initial post number (007)
    setPostNumber("007");
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Update the content with the generated metadata
      setContent(`---
title: ${title}
date: "${new Date().toISOString().split("T")[0]}"
category: "${metadata.category}"
tags: ${JSON.stringify(metadata.tags, null, 2)}
excerpt: "${metadata.excerpt}"
author: "${metadata.author}"
---

${content}`);
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

      // Create FormData to send files
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

      // Send the data to our API endpoint
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

      // Increment post number
      const nextNumber = String(Number(postNumber) + 1).padStart(3, "0");
      setPostNumber(nextNumber);

      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8" data-color-mode="light">
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
                onChange={(e) => {
                  // Only allow 3 digits
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  if (value.length <= 3) {
                    setPostNumber(value.padStart(3, "0"));
                  }
                }}
                className="input input-bordered w-full"
                required
                pattern="\d{3}"
                title="Please enter a 3-digit number"
                placeholder="000"
              />
              <p className="text-xs text-base-content/70 mt-1">Enter a 3-digit number (e.g., 007)</p>
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
              onChange={handleImageChange}
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
            <label className="label">
              <span className="label-text">Content (Markdown)</span>
            </label>
            <div className="w-full" data-color-mode="light">
              <MDEditor value={content} onChange={(val) => setContent(val || "")} preview="edit" height={400} />
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
