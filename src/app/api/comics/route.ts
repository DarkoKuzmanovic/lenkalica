import { getAllComics, createComic } from "@/lib/comics";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);
  const series = searchParams.get("series");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || "publishDate";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  try {
    let allComics = await getAllComics();
    
    // Filter by series if specified
    if (series) {
      allComics = allComics.filter(comic => comic.series === series);
    }
    
    // Search if query specified
    if (search) {
      const lowercaseSearch = search.toLowerCase();
      allComics = allComics.filter(comic => 
        comic.title.toLowerCase().includes(lowercaseSearch) ||
        (comic.description && comic.description.toLowerCase().includes(lowercaseSearch)) ||
        comic.tags.some(tag => tag.toLowerCase().includes(lowercaseSearch))
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
    
    if (!imageFile) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }
    
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    
    // Validate image file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json({ error: "Invalid image file type" }, { status: 400 });
    }
    
    // Generate filename
    const fileExtension = imageFile.name.split('.').pop() || 'jpg';
    const sanitizedName = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const timestamp = Date.now();
    const fileName = `${timestamp}-${sanitizedName}.${fileExtension}`;
    
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
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    
    // Create comic metadata
    const comicData = {
      title,
      description: description || undefined,
      series: series || undefined,
      issueNumber: issueNumber ? parseInt(issueNumber, 10) : undefined,
      tags: tagsArray,
      publishDate: publishDate ? new Date(publishDate) : new Date(),
    };
    
    const newComic = await createComic(comicData, fileName);
    
    return NextResponse.json({ 
      success: true, 
      data: newComic,
      message: "Comic created successfully"
    });
    
  } catch (error) {
    console.error("Failed to create comic:", error);
    return NextResponse.json({ error: "Failed to create comic" }, { status: 500 });
  }
}
