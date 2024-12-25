import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with proper error handling
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

// Only initialize if API key is available
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

const PROMPT = `Given the following article content, generate metadata in the following format:
{
  "category": "One of: History & Culture, Science & Nature, Technology, Travel, Current Events",
  "tags": ["tag1", "tag2", "tag3", ...] (5-10 relevant tags),
  "excerpt": "A compelling 1-2 sentence summary of the article (max 200 characters)",
  "author": "A fitting author name based on the content and style of writing"
}

Use the sample format but generate appropriate values based on the article content.
Make the excerpt engaging and informative.
Choose the most relevant category from the list provided.
Select specific, relevant tags that capture key topics, places, and themes.
Generate a suitable author name that matches the writing style and subject matter.

Article content:
`;

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    // If Gemini API is not available, return default metadata
    if (!genAI) {
      console.warn("Gemini API key not configured, using default metadata");
      return NextResponse.json({
        metadata: {
          category: "Current Events",
          tags: ["general"],
          excerpt: content.slice(0, 197) + "...",
          author: "Lenkalica Staff",
        },
      });
    }

    // Generate metadata using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(PROMPT + content);
    const response = await result.response;
    const metadata = JSON.parse(response.text());

    return NextResponse.json({ metadata });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return NextResponse.json(
      {
        error: "Failed to generate metadata",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
