import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Get file names and content
    const markdownFileName = formData.get("markdownFileName") as string;
    const content = formData.get("content") as string;
    const coverImage = formData.get("coverImage") as File;
    const coverImageFileName = formData.get("coverImageFileName") as string;
    const audioFile = formData.get("audioFile") as File;
    const audioFileName = formData.get("audioFileName") as string;

    // Save markdown file
    const markdownPath = path.join(process.cwd(), "content", "articles", markdownFileName);
    await writeFile(markdownPath, content);

    // Save cover image if provided
    if (coverImage) {
      const imageBuffer = Buffer.from(await coverImage.arrayBuffer());
      const imagePath = path.join(process.cwd(), "public", "images", "covers", coverImageFileName);
      await writeFile(imagePath, imageBuffer);
    }

    // Save audio file if provided
    if (audioFile) {
      const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
      const audioPath = path.join(process.cwd(), "public", "audio", audioFileName);
      await writeFile(audioPath, audioBuffer);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
