import { getArticleById } from "@/lib/articles";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const article = await getArticleById(id);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error: unknown) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
