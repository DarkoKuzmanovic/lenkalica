import { getAllArticles } from "@/lib/articles";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  try {
    const articles = await getAllArticles();

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = articles.slice(startIndex, endIndex);

    const totalPages = Math.ceil(articles.length / limit);

    return NextResponse.json({
      data: paginatedArticles,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error("Failed to fetch articles:", err);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
