"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { marked } from "marked";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapUnderline from "@tiptap/extension-underline";
import {
  PhotoIcon,
  BoltIcon as BoldIcon,
  DocumentTextIcon as ItalicIcon,
  MinusIcon as UnderlineIcon,
  ListBulletIcon,
  QueueListIcon as ListNumberedIcon,
  HashtagIcon as Heading1Icon,
  HashtagIcon as Heading2Icon,
  CodeBracketIcon as CodeIcon,
  ChatBubbleLeftRightIcon as QuoteIcon,
  MinusIcon as DividerHorizontalIcon,
} from "@heroicons/react/24/outline";

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const insertMarkdown = (markdown: string) => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);
    editor
      .chain()
      .focus()
      .insertContent(text ? `${markdown}${text}${markdown}` : markdown)
      .run();
  };

  return (
    <div className="border-b border-base-300 p-2 flex flex-wrap gap-1 bg-base-200">
      <button onClick={() => insertMarkdown("**")} className="btn btn-sm btn-ghost" title="Bold">
        <BoldIcon className="h-4 w-4" />
      </button>
      <button onClick={() => insertMarkdown("*")} className="btn btn-sm btn-ghost" title="Italic">
        <ItalicIcon className="h-4 w-4" />
      </button>
      <div className="divider divider-horizontal mx-1"></div>
      <button
        onClick={() => editor.chain().focus().insertContent("\n# ").run()}
        className="btn btn-sm btn-ghost"
        title="Heading 1"
      >
        <Heading1Icon className="h-4 w-4" />
        <span className="text-xs">1</span>
      </button>
      <button
        onClick={() => editor.chain().focus().insertContent("\n## ").run()}
        className="btn btn-sm btn-ghost"
        title="Heading 2"
      >
        <Heading2Icon className="h-4 w-4" />
        <span className="text-xs">2</span>
      </button>
      <div className="divider divider-horizontal mx-1"></div>
      <button
        onClick={() => editor.chain().focus().insertContent("\n- ").run()}
        className="btn btn-sm btn-ghost"
        title="Bullet List"
      >
        <ListBulletIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().insertContent("\n1. ").run()}
        className="btn btn-sm btn-ghost"
        title="Numbered List"
      >
        <ListNumberedIcon className="h-4 w-4" />
      </button>
      <div className="divider divider-horizontal mx-1"></div>
      <button
        onClick={() => editor.chain().focus().insertContent("\n```\n\n```\n").run()}
        className="btn btn-sm btn-ghost"
        title="Code Block"
      >
        <CodeIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().insertContent("\n> ").run()}
        className="btn btn-sm btn-ghost"
        title="Quote"
      >
        <QuoteIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().insertContent("\n---\n").run()}
        className="btn btn-sm btn-ghost"
        title="Horizontal Rule"
      >
        <DividerHorizontalIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default function PostEditorPage() {
  const [postNumber, setPostNumber] = useState("");
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const convertMarkdownToHTML = (markdown: string) => {
    return marked(markdown, { headerIds: false, mangle: false });
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bold: false,
        italic: false,
        bulletList: false,
        orderedList: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        strike: false,
        dropcursor: false,
        gapcursor: false,
        text: {},
        paragraph: {},
        doc: {},
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "font-mono text-base leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getText());
    },
  });

  useEffect(() => {
    // Set initial post number (007)
    setPostNumber("007");
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
      editor?.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
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
          content: editor?.getText() || content, // Get plain text for metadata generation
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

      // Set the content with metadata and preserve the existing content
      editor?.commands.setContent(metadataContent + (editor.getHTML() || content));
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
      formData.append("content", editor?.getHTML() || content);

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
      editor?.commands.setContent("");

      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPreviewContent = () => {
    if (!editor) return "";

    // Get the raw text content from the editor
    const rawContent = editor.getText();

    // For metadata section, keep it as plain text
    if (rawContent.startsWith("---")) {
      const parts = rawContent.split("---");
      if (parts.length >= 3) {
        // Keep metadata as preformatted text and render the rest as HTML
        return `<pre className="font-mono text-sm">---${parts[1]}---</pre>${marked(parts.slice(2).join("---"))}`;
      }
    }

    // Convert markdown to HTML for the preview
    return marked(rawContent);
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

          {/* Enhanced Markdown Editor */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label">
                <span className="label-text">Content</span>
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
                <button type="button" onClick={() => setIsPreviewMode(!isPreviewMode)} className="btn btn-sm btn-ghost">
                  {isPreviewMode ? "Edit" : "Preview"}
                </button>
              </div>
            </div>

            <div className="w-full rounded-lg border border-base-300 overflow-hidden">
              {isPreviewMode ? (
                <div
                  className="prose prose-sm max-w-none p-4 min-h-[400px] bg-base-100"
                  dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                />
              ) : (
                <div className="min-h-[400px] bg-base-100">
                  <MenuBar editor={editor} />
                  <div className="p-4">
                    <EditorContent editor={editor} />
                  </div>
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
