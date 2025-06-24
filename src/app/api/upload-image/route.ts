import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Generate a unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const originalName = file.name;
    const ext = originalName.substring(originalName.lastIndexOf("."));

    // Generate unique filename
    const filename = `${nanoid()}${ext}`;

    // Save to public/images directory
    const imagesDir = join(process.cwd(), "public", "images");
    const filepath = join(imagesDir, filename);

    await writeFile(filepath, buffer);

    // Return the public URL
    const imageUrl = `/images/${filename}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
