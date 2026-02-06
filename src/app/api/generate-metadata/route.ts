import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/utils/validation";

// Initialize OpenRouter API with proper error handling
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `You are a helpful assistant that generates metadata for article content. Return ONLY valid JSON with these fields:

- category: string (e.g., "History", "Culture", "Travel", "Current Events")
- tags: string[] (an array of relevant keywords, maximum 10)
- excerpt: string (a short summary, maximum 200 characters)
- author: string (use "Darko Kuzmanovic" as default author)

IMPORTANT: Ensure that titles never contain semicolons ":" as they break article listing. Use "-" or em dash "—" instead.

Return only the JSON object, no other text or formatting.`;

export async function POST(req: NextRequest) {
  // Check authorization to prevent API credit abuse
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { error: "Unauthorized. API key required in production." },
      { status: 401 },
    );
  }

  try {
    const { content, title } = await req.json();

    // If OpenRouter API is not available, return default metadata
    if (!OPENROUTER_API_KEY) {
      console.warn("OpenRouter API key not configured, using default metadata");
      return NextResponse.json({
        metadata: {
          category: "Current Events",
          tags: ["general"],
          excerpt: content.slice(0, 197) + "...",
          author: "Darko Kuzmanovic",
        },
      });
    }

    // Generate metadata using OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lenkalica.com",
        "X-Title": "Lenkalica Blog Metadata Generator",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini-2024-07-18", // Using a more reliable free model
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: `Title: ${title}\n\nContent: ${content}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", errorData);
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const apiResponse = await response.json();
    let responseText = apiResponse.choices[0]?.message?.content || "";

    // Clean up the response (remove any markdown formatting)
    responseText = responseText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

    let metadata;
    try {
      metadata = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing OpenRouter response:", parseError);
      console.error("Response text:", responseText);
      return NextResponse.json(
        {
          error: "Failed to parse OpenRouter response",
          details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
        },
        { status: 500 }
      );
    }

    // Post-process to ensure titles don't contain semicolons
    if (metadata.title) {
      metadata.title = metadata.title.replace(/:/g, ' -');
    }

    return NextResponse.json({ metadata });
  } catch (error) {
    console.error("Error generating metadata:", error);
    console.error("Full error object:", error);
    // Only return generic error to clients, don't expose stack traces
    return NextResponse.json(
      {
        error: "Failed to generate metadata",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
