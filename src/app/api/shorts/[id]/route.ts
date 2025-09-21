import { NextRequest, NextResponse } from "next/server";
import { getShortById } from "@/lib/shorts";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const short = await getShortById(id);

    if (!short) {
      return NextResponse.json({ error: "Short not found" }, { status: 404 });
    }

    return NextResponse.json(short);
  } catch (err) {
    console.error("Failed to fetch short:", err);
    return NextResponse.json({ error: "Failed to fetch short" }, { status: 500 });
  }
}