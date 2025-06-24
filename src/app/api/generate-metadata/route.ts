import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with proper error handling
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY && new GoogleGenerativeAI(GEMINI_API_KEY);

const PROMPT = `You are a helpful assistant that generates metadata for a given article content.
  The metadata should be in JSON format and include the following fields:

  - category: string (e.g., "History", "Culture", "Travel", "Current Events")
  - tags: string[] (an array of relevant keywords, maximum 10, e.g., ["city", "country", "monument"])
  - excerpt: string (a short summary of the article, maximum 200 characters)
  - author: string (The author of this article)

  Example:
  {
    "category": "History",
    "tags": ["city", "country", "monument"],
    "excerpt": "A short summary of the article.",
    "author": "John Doe"
  }
  `;

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    console.log("Content received:", content);

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });
    const result = await model.generateContent(PROMPT + content);
    const response = await result.response;
    let responseText = response.text();

    // Remove ```json and ``` from the response
    responseText = responseText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");

    let metadata;
    try {
      metadata = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.error("Response text:", responseText);
      return NextResponse.json(
        {
          error: "Failed to parse Gemini response",
          details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
          response: responseText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ metadata });
  } catch (error) {
    console.error("Error generating metadata:", error);
    console.error("Full error object:", error);
    return NextResponse.json(
      {
        error: "Failed to generate metadata",
        details: error instanceof Error ? error.message + "\n" + (error.stack || "") : "Unknown error",
      },
      { status: 500 }
    );
  }
}
