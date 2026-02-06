import { getAllComics, createComic } from "@/lib/comics";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parsePaginationParams, isAuthorized, sanitizeFilename } from "@/utils/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePaginationParams(searchParams, {
    defaultLimit: 9,
    maxLimit: 50,
  });
  const series = searchParams.get("series");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || "publishDate";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  try {
    let allComics = await getAllComics();

    // Filter by series if specified
    if (series) {
      allComics = allComics.filter((comic) => comic.series === series);
    }

    // Search if query specified
    if (search) {
      const lowercaseSearch = search.toLowerCase();
      allComics = allComics.filter(
        (comic) =>
          comic.title.toLowerCase().includes(lowercaseSearch) ||
          (comic.description && comic.description.toLowerCase().includes(lowercaseSearch)) ||
          comic.tags.some((tag) => tag.toLowerCase().includes(lowercaseSearch)),
      );
    }

    // Sort comics
    allComics.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "series":
          aValue = a.series || "";
          bValue = b.series || "";
          break;
        case "createdAt":
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case "publishDate":
        default:
          aValue = a.publishDate.getTime();
          bValue = b.publishDate.getTime();
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComics = allComics.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allComics.length / limit);

    return NextResponse.json({
      data: paginatedComics,
      currentPage: page,
      totalPages,
      totalItems: allComics.length,
      filters: { series, search, sortBy, sortOrder },
    });
  } catch (err) {
    console.error("Failed to fetch comics:", err);
    return NextResponse.json({ error: "Failed to fetch comics" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Check authorization (requires API key in production)
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. API key required in production." }, { status: 401 });
  }

  // TODO: Add rate limiting middleware here
  // Consider using a package like 'rate-limiter-flexible' or implementing custom logic

  try {
    const formData = await request.formData();

    // Get form data
    const imageFile = formData.get("image") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const series = formData.get("series") as string;
    const issueNumber = formData.get("issueNumber") as string;
    const tags = formData.get("tags") as string;
    const publishDate = formData.get("publishDate") as string;

    // Validate required fields
    if (!imageFile) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Validate image file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json({ error: "Invalid image file type" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (imageFile.size > maxSize) {
      return NextResponse.json({ error: "Image file too large (max 10MB)" }, { status: 400 });
    }

    // Sanitize and generate filename
    const fileExtension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const sanitizedTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const timestamp = Date.now();
    const fileName = sanitizeFilename(`${timestamp}-${sanitizedTitle}.${fileExtension}`);

    // Save image file
    const comicsDirectory = path.join(process.cwd(), "public/images/comics");

    if (!fs.existsSync(comicsDirectory)) {
      fs.mkdirSync(comicsDirectory, { recursive: true });
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(comicsDirectory, fileName);

    fs.writeFileSync(filePath, buffer);

    // Parse tags
    const tagsArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    // Create comic metadata
    const comicData = {
      title: title.trim(),
      description: description?.trim() || undefined,
      series: series?.trim() || undefined,
      issueNumber: issueNumber ? parseInt(issueNumber, 10) : undefined,
      tags: tagsArray,
      publishDate: publishDate ? new Date(publishDate) : new Date(),
    };

    const newComic = await createComic(comicData, fileName);

    return NextResponse.json({
      success: true,
      data: newComic,
      message: "Comic created successfully",
    });
  } catch (error) {
    console.error("Failed to create comic:", error);
    return NextResponse.json({ error: "Failed to create comic" }, { status: 500 });
  }
}
