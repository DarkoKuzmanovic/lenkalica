import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with proper error handling
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

// Only initialize if API key is available
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
} else {
  console.error("GEMINI_API_KEY is not set in environment variables");
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, systemPrompt, temperature, topP } = await req.json();

    console.log("Received prompt:", prompt);
    console.log("System prompt:", systemPrompt);
    console.log("Temperature:", temperature);
    console.log("Top P:", topP);

    // If Gemini API is not available, return error
    if (!genAI) {
      console.error("Gemini API key not configured");
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    // Generate content using Gemini
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-pro-exp-02-05",
        generationConfig: {
          temperature,
          topP,
        },
      });

      console.log("Model initialized");

      // Generate content with proper format
      const result = await model.generateContent([
        { text: "System: " + systemPrompt },
        { text: "\n\nUser: " + prompt },
      ]);

      console.log("Content generated");

      const response = await result.response;

      // Check if the response has a 'promptFeedback' field which indicates issues with the prompt
      if (response.promptFeedback) {
        console.warn("Prompt feedback:", response.promptFeedback);
        return NextResponse.json(
          {
            error: "Prompt feedback error",
            details: response.promptFeedback,
          },
          { status: 400 } // Use 400 for client-side errors
        );
      }

      const content = response.text();

      console.log("Response received, length:", content.length);

      return NextResponse.json({ content });
    } catch (modelError) {
      console.error("Gemini API Error:", modelError);
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
