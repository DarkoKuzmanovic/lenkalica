import { NextRequest, NextResponse } from "next/server";
import { getAllShorts } from "@/lib/shorts";

interface Short {
  id: string;
  title: string;
  date: string;
  url: string;
  image: string;
}

interface PaginatedResponse {
  data: Short[];
  currentPage: number;
  totalPages: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  try {
    const shorts = await getAllShorts();

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedShorts = shorts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(shorts.length / limit);

    return NextResponse.json({
      data: paginatedShorts,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error("Failed to fetch shorts:", err);
    return NextResponse.json({ error: "Failed to fetch shorts" }, { status: 500 });
  }
}
