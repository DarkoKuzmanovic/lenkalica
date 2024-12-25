import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with proper error handling
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    const { title, content } = await req.json();

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate metadata
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
