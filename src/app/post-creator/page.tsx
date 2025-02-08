"use client";

import { useState, useEffect } from "react";
import { marked } from "marked";
import { DocumentArrowDownIcon, BookmarkIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface SavedPrompt {
  name: string;
  systemPrompt: string;
  temperature: number;
  topP: number;
}

export default function PostCreatorPage() {
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    "You're a world renowned geography journalist working for Lenkalica magazine (something like National Geography). You write articles that are rich in culture, geography and targeted to amaze readers. Articles should have sub headings and IT'S A MUST to be factually correct. Feel free to research internet or ask for sources if needed."
  );
  const [temperature, setTemperature] = useState(0.65);
  const [topP, setTopP] = useState(0.9);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [promptName, setPromptName] = useState("");

  // Load saved prompts on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedPrompts");
    if (saved) {
      setSavedPrompts(JSON.parse(saved));
    }
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setGeneratedContent(editor.getText());
    },
  });

  useEffect(() => {
    if (editor && generatedContent) {
      editor.commands.setContent(generatedContent);
    }
  }, [editor, generatedContent]);

  const handleSavePrompt = () => {
    if (!promptName.trim()) return;

    const newPrompt: SavedPrompt = {
      name: promptName,
      systemPrompt,
      temperature,
      topP,
    };

    const updatedPrompts = [...savedPrompts, newPrompt];
    setSavedPrompts(updatedPrompts);
    localStorage.setItem("savedPrompts", JSON.stringify(updatedPrompts));
    setShowSaveDialog(false);
    setPromptName("");
  };

  const handleLoadPrompt = (saved: SavedPrompt) => {
    setSystemPrompt(saved.systemPrompt);
    setTemperature(saved.temperature);
    setTopP(saved.topP);
  };

  const handleDeletePrompt = (index: number) => {
    const updatedPrompts = savedPrompts.filter((_, i) => i !== index);
    setSavedPrompts(updatedPrompts);
    localStorage.setItem("savedPrompts", JSON.stringify(updatedPrompts));
  };

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
          topP,
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
    if (!editor) return;

    const content = editor.getText();
    if (!content) return;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    const firstLine = content.split("\n")[0].replace(/[#\s]/g, "").slice(0, 50);
    const filename = `${firstLine || "generated-content"}.md`;

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-base-content">Post Creator (Gemini Test)</h1>

        <div className="space-y-6">
          {/* System Prompt Input with Save/Load */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label">
                <span className="label-text">System Prompt</span>
              </label>
              <div className="flex gap-2">
                <button onClick={() => setShowSaveDialog(true)} className="btn btn-sm btn-ghost gap-2">
                  <BookmarkIcon className="h-4 w-4" />
                  Save Prompt
                </button>
                <div className="dropdown dropdown-end">
                  <button tabIndex={0} className="btn btn-sm btn-ghost gap-2">
                    <FolderOpenIcon className="h-4 w-4" />
                    Load Prompt
                  </button>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-96">
                    {savedPrompts.map((saved, index) => (
                      <li key={index} className="flex flex-col gap-1 p-2 hover:bg-base-200 rounded">
                        <div className="flex justify-between items-center">
                          <button onClick={() => handleLoadPrompt(saved)} className="flex-1 text-left font-medium">
                            {saved.name}
                          </button>
                          <button onClick={() => handleDeletePrompt(index)} className="btn btn-ghost btn-xs text-error">
                            Delete
                          </button>
                        </div>
                        <div className="text-xs opacity-70">
                          Temp: {saved.temperature} | Top P: {saved.topP}
                        </div>
                      </li>
                    ))}
                    {savedPrompts.length === 0 && <li className="p-2 text-sm opacity-70">No saved prompts</li>}
                  </ul>
                </div>
              </div>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="textarea textarea-bordered w-full h-32"
              placeholder="Enter system prompt..."
            />
          </div>

          {/* Parameters Control */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Top P Control */}
            <div>
              <label className="label">
                <span className="label-text">Top P: {topP}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="range range-primary"
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>Precise (0.0)</span>
                <span>Balanced (0.5)</span>
                <span>Diverse (1.0)</span>
              </div>
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
                    {isPreviewMode ? "Edit" : "Preview"}
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
                  <div className="min-h-[400px] p-4 bg-base-100">
                    <EditorContent editor={editor} className="prose max-w-none" />
                  </div>
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

          {/* Save Prompt Dialog */}
          {showSaveDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-base-100 p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-lg font-bold mb-4">Save System Prompt</h3>
                <input
                  type="text"
                  value={promptName}
                  onChange={(e) => setPromptName(e.target.value)}
                  placeholder="Enter prompt name"
                  className="input input-bordered w-full mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowSaveDialog(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button onClick={handleSavePrompt} className="btn btn-primary" disabled={!promptName.trim()}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
