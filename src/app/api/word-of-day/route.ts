import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const response = await fetch("https://www.merriam-webster.com/word-of-the-day");
    const html = await response.text();

    // Parse HTML using cheerio
    const $ = cheerio.load(html);

    // Extract word data
    const word = $(".word-header-txt").text().trim();
    const pronunciation = $(".word-syllables").text().trim();
    const definition = $(".wod-definition-container p").first().text().trim();
    const example = $(".wod-example-sentences p").first().text().trim();

    // Format today's date
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return NextResponse.json({
      word,
      pronunciation,
      definition,
      example,
      date,
    });
  } catch (error) {
    console.error("Error fetching word of the day:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch word of the day",
      },
      { status: 500 }
    );
  }
}
