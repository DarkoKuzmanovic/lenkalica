import fs from "fs";
import path from "path";

export interface Comic {
  id: string;
  image: string;
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
    .map((fileName) => ({
      id: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
      image: `/images/comics/${fileName}`,
    }));

  return comics.sort((a, b) => a.id.localeCompare(b.id));
}
