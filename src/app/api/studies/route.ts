import { getAllStudies } from "@/lib/studies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  try {
    const studies = await getAllStudies();

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStudies = studies.slice(startIndex, endIndex);

    const totalPages = Math.ceil(studies.length / limit);

    return NextResponse.json({
      data: paginatedStudies,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error("Failed to fetch studies:", err);
    return NextResponse.json({ error: "Failed to fetch studies" }, { status: 500 });
  }
}