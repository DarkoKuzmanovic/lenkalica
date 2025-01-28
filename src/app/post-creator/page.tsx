"use client";

import { useState } from "react";
import { marked } from "marked";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

export default function PostCreatorPage() {
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    "You're a world renowned geography journalist working for Lenkalica magazine (something like National Geography). You write articles that are rich in culture, geography and targeted to amaze readers. Articles should have sub headings and IT'S A MUST to be factually correct. Feel free to research internet or ask for sources if needed."
  );
  const [temperature, setTemperature] = useState(0.65);

  const handleGenerate = async () => {
    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          systemPrompt,
          temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Failed to generate content");
      }

      const { content } = await response.json();
      setGeneratedContent(content);
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const handleSaveMarkdown = () => {
    if (!generatedContent) return;

    // Create blob and download link
    const blob = new Blob([generatedContent], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    // Generate filename from first line or default
    const firstLine = generatedContent.split("\n")[0].replace(/[#\s]/g, "").slice(0, 50);
    const filename = `${firstLine || "generated-content"}.md`;

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-base-content">Post Creator (Gemini Test)</h1>

        <div className="space-y-6">
          {/* System Prompt Input */}
          <div>
            <label className="label">
              <span className="label-text">System Prompt</span>
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="textarea textarea-bordered w-full h-32"
              placeholder="Enter system prompt..."
            />
          </div>

          {/* Temperature Control */}
          <div>
            <label className="label">
              <span className="label-text">Temperature: {temperature}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="range range-primary"
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>Focused (0.0)</span>
              <span>Balanced (0.5)</span>
              <span>Creative (1.0)</span>
            </div>
          </div>

          {/* User Prompt Input */}
          <div>
            <label className="label">
              <span className="label-text">Your Prompt</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="textarea textarea-bordered w-full h-32"
              placeholder="Enter your prompt for the AI..."
            />
            <div className="mt-2 flex justify-end">
              <button onClick={handleGenerate} disabled={isGenerating || !prompt} className="btn btn-primary">
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          {/* Generated Content */}
          {generatedContent && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label">
                  <span className="label-text">Generated Content</span>
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-sm">Word count: {getWordCount(generatedContent)}</span>
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="btn btn-sm btn-ghost"
                  >
                    {isPreviewMode ? "View Markdown" : "Preview"}
                  </button>
                </div>
              </div>
              <div className="w-full rounded-lg border border-base-300 overflow-hidden">
                {isPreviewMode ? (
                  <div
                    className="prose prose-sm max-w-none p-4 min-h-[400px] bg-base-100"
                    dangerouslySetInnerHTML={{ __html: marked(generatedContent) }}
                  />
                ) : (
                  <textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="w-full min-h-[400px] p-4 bg-base-100 text-base-content font-mono text-sm resize-none focus:outline-none"
                    readOnly
                  />
                )}
              </div>
              {/* Save Markdown Button */}
              <div className="mt-4 flex justify-end">
                <button onClick={handleSaveMarkdown} className="btn btn-outline btn-primary gap-2">
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  Save as Markdown
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
