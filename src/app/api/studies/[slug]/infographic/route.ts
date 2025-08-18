import { getStudyInfographic } from "@/lib/studies";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const infographicContent = await getStudyInfographic(slug);
    
    if (!infographicContent) {
      return NextResponse.json({ error: "Infographic not found" }, { status: 404 });
    }
    
    return new NextResponse(infographicContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching study infographic:", error);
    return NextResponse.json({ error: "Failed to fetch infographic" }, { status: 500 });
  }
}