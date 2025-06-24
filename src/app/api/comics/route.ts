import { getAllComics } from "@/lib/comics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);

  try {
    const allComics = await getAllComics();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComics = allComics.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allComics.length / limit);

    return NextResponse.json({
      data: paginatedComics,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error("Failed to fetch comics:", err);
    return NextResponse.json({ error: "Failed to fetch comics" }, { status: 500 });
  }
}
