import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";
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
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Generate a unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension safely
    const originalName = file.name;
    const ext = originalName.substring(originalName.lastIndexOf(".")).toLowerCase();

    // Validate extension
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: "Invalid file extension" }, { status: 400 });
    }

    // Generate unique filename with sanitization
    const filename = sanitizeFilename(`${nanoid()}${ext}`);

    // Save to public/images directory
    const imagesDir = join(process.cwd(), "public", "images");
    const filepath = join(imagesDir, filename);

    await writeFile(filepath, buffer);

    // Return the public URL
    const imageUrl = `https://raw.githubusercontent.com/DarkoKuzmanovic/lenkalica/main/public/images/${filename}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    if (error instanceof Error && error.message.includes("sanitization")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
