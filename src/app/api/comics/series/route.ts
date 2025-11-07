import { getAllSeries } from "@/lib/comics";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const series = await getAllSeries();

    return NextResponse.json({
      data: series,
      count: series.length,
    });
  } catch (error) {
    console.error("Failed to fetch series:", error);
    return NextResponse.json({ error: "Failed to fetch series" }, { status: 500 });
  }
}