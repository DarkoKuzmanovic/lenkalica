import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { isAuthorized, sanitizeFilename } from "@/utils/validation";

export async function POST(req: NextRequest) {
  // Check authorization (requires API key in production)
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized. API key required in production." }, { status: 401 });
  }

  // TODO: Add rate limiting middleware here
  // Consider using a package like 'rate-limiter-flexible' or implementing custom logic

  try {
    const formData = await req.formData();

    // Get file names and content
    const markdownFileName = formData.get("markdownFileName") as string;
    const content = formData.get("content") as string;
    const coverImage = formData.get("coverImage") as File;
    const coverImageFileName = formData.get("coverImageFileName") as string;

    // Validate required fields
    if (!markdownFileName || typeof markdownFileName !== "string") {
      return NextResponse.json({ error: "Markdown filename is required" }, { status: 400 });
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Sanitize filenames to prevent path traversal
    const safeMarkdownFileName = sanitizeFilename(markdownFileName);
    if (!safeMarkdownFileName.endsWith(".md")) {
      return NextResponse.json({ error: "Markdown file must have .md extension" }, { status: 400 });
    }

    // Save markdown file
    const markdownPath = path.join(process.cwd(), "content", "shorts", safeMarkdownFileName);
    await writeFile(markdownPath, content);

    // Save cover image if provided
    if (coverImage) {
      if (!coverImageFileName || typeof coverImageFileName !== "string") {
        return NextResponse.json({ error: "Cover image filename is required" }, { status: 400 });
      }

      // Validate cover image type
      const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedImageTypes.includes(coverImage.type)) {
        return NextResponse.json({ error: "Invalid cover image type. Allowed: jpg, jpeg, png, webp" }, { status: 400 });
      }

      const safeCoverImageFileName = sanitizeFilename(coverImageFileName);

      // Validate file extension
      const imageExt = safeCoverImageFileName.substring(safeCoverImageFileName.lastIndexOf(".")).toLowerCase();
      const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
      if (!allowedImageExtensions.includes(imageExt)) {
        return NextResponse.json(
          { error: "Invalid cover image extension. Allowed: jpg, jpeg, png, webp" },
          { status: 400 },
        );
      }

      const imageBuffer = Buffer.from(await coverImage.arrayBuffer());
      const imagePath = path.join(process.cwd(), "public", "images", "covers", safeCoverImageFileName);
      await writeFile(imagePath, imageBuffer);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating short:", error);
    if (error instanceof Error && error.message.includes("sanitization")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create short" }, { status: 500 });
  }
}
