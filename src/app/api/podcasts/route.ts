import { getAllArticles } from "@/lib/articles";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  try {
    const allArticles = await getAllArticles();
    const articlesWithAudio = allArticles.filter((article) => article.audioFile);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPodcasts = articlesWithAudio.slice(startIndex, endIndex);

    const totalPages = Math.ceil(articlesWithAudio.length / limit);

    return NextResponse.json({
      data: paginatedPodcasts,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error("Failed to fetch podcasts:", err);
    return NextResponse.json({ error: "Failed to fetch podcasts" }, { status: 500 });
  }
}
