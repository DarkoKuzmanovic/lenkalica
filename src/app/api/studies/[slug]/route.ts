import { getStudyBySlug } from "@/lib/studies";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const study = await getStudyBySlug(slug);
    if (!study) {
      return NextResponse.json({ error: "Study not found" }, { status: 404 });
    }
    return NextResponse.json(study);
  } catch (error: unknown) {
    console.error("Error fetching study:", error);
    return NextResponse.json({ error: "Failed to fetch study" }, { status: 500 });
  }
}