import { getComicById, updateComic, deleteComic } from "@/lib/comics";
import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/utils/validation";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const comic = await getComicById(params.id);

    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    return NextResponse.json({ data: comic });
  } catch (error) {
    console.error(`Failed to fetch comic ${params.id}:`, error);
    return NextResponse.json({ error: "Failed to fetch comic" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authorization (requires API key in production)
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. API key required in production." }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("PUT /api/comics/[id] - Update request:", { id: params.id, body });

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Parse and validate issue number if provided
    if (body.issueNumber !== undefined) {
      const issueNum = parseInt(body.issueNumber, 10);
      if (isNaN(issueNum)) {
        return NextResponse.json({ error: "Issue number must be a valid integer" }, { status: 400 });
      }
      body.issueNumber = issueNum;
    }

    // Parse tags if provided as string
    if (body.tags && typeof body.tags === "string") {
      body.tags = body.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean);
    }

    // Parse dates if provided as strings
    if (body.publishDate && typeof body.publishDate === "string") {
      body.publishDate = new Date(body.publishDate);
    }

    // Ensure createdAt is a Date object if provided
    if (body.createdAt && typeof body.createdAt === "string") {
      body.createdAt = new Date(body.createdAt);
    }

    const updatedComic = await updateComic(params.id, body);

    if (!updatedComic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedComic,
      message: "Comic updated successfully",
    });
  } catch (error) {
    console.error(`Failed to update comic ${params.id}:`, error);
    return NextResponse.json({ error: "Failed to update comic" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authorization (requires API key in production)
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. API key required in production." }, { status: 401 });
  }

  try {
    const success = await deleteComic(params.id);

    if (!success) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Comic deleted successfully",
    });
  } catch (error) {
    console.error(`Failed to delete comic ${params.id}:`, error);
    return NextResponse.json({ error: "Failed to delete comic" }, { status: 500 });
  }
}
