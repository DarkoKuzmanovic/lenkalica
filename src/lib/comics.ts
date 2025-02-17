import fs from "fs";
import path from "path";

export interface Comic {
  id: string;
  image: string;
  timestamp: number;
}

const comicsDirectory = path.join(process.cwd(), "public/images/comics");

export async function getAllComics(): Promise<Comic[]> {
  // Create directory if it doesn't exist
  if (!fs.existsSync(comicsDirectory)) {
    fs.mkdirSync(comicsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(comicsDirectory);

  const comics = fileNames
    .filter((fileName) => /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName))
    .map((fileName) => {
      const filePath = path.join(comicsDirectory, fileName);
      const stats = fs.statSync(filePath);
      return {
        id: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
        image: `/images/comics/${fileName}`,
        timestamp: stats.birthtime.getTime(), // Get the creation time
      };
    });

  // Sort by timestamp, newest first
  return comics.sort((a, b) => b.timestamp - a.timestamp);
}
