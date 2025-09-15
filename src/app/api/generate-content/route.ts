import { NextRequest, NextResponse } from "next/server";

// Initialize OpenRouter API with proper error handling
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { prompt, systemPrompt, temperature, topP } = await req.json();

    // If OpenRouter API is not available, return error
    if (!OPENROUTER_API_KEY) {
      console.error("OpenRouter API key not configured");
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
    }

    // Generate content using OpenRouter
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lenkalica.com",
          "X-Title": "Lenkalica Blog Content Generator",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini-2024-07-18",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: temperature,
          top_p: topP,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("OpenRouter API error:", errorData);
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const apiResponse = await response.json();
      const content = apiResponse.choices[0]?.message?.content || "";

      if (!content) {
        throw new Error("No content received from OpenRouter API");
      }

      return NextResponse.json({ content });
    } catch (modelError) {
      console.error("OpenRouter API Error:", modelError);
      // Add more detailed error information
      const errorMessage =
        modelError instanceof Error ? `${modelError.message}\n${modelError.stack || ""}` : "Unknown model error";
      console.error("Detailed error:", errorMessage);

      return NextResponse.json(
        {
          error: "Failed to generate content",
          details: errorMessage,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
