import { NextResponse } from "next/server";
import { getNextShortNumber } from "@/lib/shorts";

export async function GET() {
  try {
    const nextNumber = await getNextShortNumber();
    return NextResponse.json({ nextNumber });
  } catch (error) {
    console.error("Error getting next short number:", error);
    return NextResponse.json({ error: "Failed to get next short number" }, { status: 500 });
  }
}