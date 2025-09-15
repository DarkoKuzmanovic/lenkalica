import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const articlesDir = join(process.cwd(), "content", "articles");
    const files = await readdir(articlesDir);

    // Extract numbers from filenames that follow the "xxx-" pattern
    const numbers = files
      .map(filename => {
        const match = filename.match(/^(\d{3})-/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);

    // Find the highest number and add 1
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;

    // Format as 3-digit string
    const formattedNumber = nextNumber.toString().padStart(3, '0');

    return NextResponse.json({ nextNumber: formattedNumber });
  } catch (error) {
    console.error("Error getting next post number:", error);
    return NextResponse.json({ error: "Failed to get next post number" }, { status: 500 });
  }
}