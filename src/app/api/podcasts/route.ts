import { getAllArticles } from "@/lib/articles";
import { NextRequest, NextResponse } from "next/server";
import { parsePaginationParams } from "@/utils/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePaginationParams(searchParams, { defaultLimit: 6, maxLimit: 100 });

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
