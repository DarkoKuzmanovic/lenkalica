import { getAllShorts } from "@/lib/shorts";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const shorts = await getAllShorts();
    return NextResponse.json(shorts);
  } catch (error) {
    console.error("Error fetching shorts:", error);
    return NextResponse.json({ error: "Failed to fetch shorts" }, { status: 500 });
  }
}
