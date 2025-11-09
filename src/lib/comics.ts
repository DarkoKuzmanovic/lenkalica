import fs from "fs";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export interface Comic {
  id: string;
  title: string;
  description?: string;
  image: string;
  series?: string;
  issueNumber?: number;
  tags: string[];
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
  // Legacy support for existing image-only comics
  timestamp?: number;
}

const comicsDirectory = path.join(process.cwd(), "public/images/comics");
const comicsMetadataDirectory = path.join(process.cwd(), "content/comics");

// Helper function to ensure metadata directory exists
async function ensureMetadataDirectory() {
  if (!fs.existsSync(comicsMetadataDirectory)) {
    await mkdir(comicsMetadataDirectory, { recursive: true });
  }
}

// Helper function to generate comic metadata file path
function getComicMetadataPath(id: string): string {
  return path.join(comicsMetadataDirectory, `${id}.json`);
}

// Helper function to read comic metadata
async function readComicMetadata(id: string): Promise<Partial<Comic> | null> {
  try {
    const metadataPath = getComicMetadataPath(id);
    if (!fs.existsSync(metadataPath)) {
      return null;
    }

    const metadataContent = fs.readFileSync(metadataPath, "utf-8");
    const metadata = JSON.parse(metadataContent);

    // Convert date strings back to Date objects
    if (metadata.publishDate) metadata.publishDate = new Date(metadata.publishDate);
    if (metadata.createdAt) metadata.createdAt = new Date(metadata.createdAt);
    if (metadata.updatedAt) metadata.updatedAt = new Date(metadata.updatedAt);

    return metadata;
  } catch (error) {
    console.error(`Error reading metadata for comic ${id}:`, error);
    return null;
  }
}

// Helper function to write comic metadata
async function writeComicMetadata(comic: Comic): Promise<void> {
  await ensureMetadataDirectory();

  const metadataPath = getComicMetadataPath(comic.id);
  const metadataToWrite = {
    ...comic,
    publishDate: comic.publishDate.toISOString(),
    createdAt: comic.createdAt.toISOString(),
    updatedAt: comic.updatedAt.toISOString(),
  };

  await writeFile(metadataPath, JSON.stringify(metadataToWrite, null, 2));
}

export async function getAllComics(): Promise<Comic[]> {
  // Create directories if they don't exist
  if (!fs.existsSync(comicsDirectory)) {
    fs.mkdirSync(comicsDirectory, { recursive: true });
    return [];
  }

  await ensureMetadataDirectory();

  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(comicsDirectory);
  } catch (error) {
    console.error("Error reading comics directory:", error);
    return [];
  }

  const comics = fileNames
    .filter((fileName) => /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName))
    .map(async (fileName) => {
      const filePath = path.join(comicsDirectory, fileName);
      const stats = fs.statSync(filePath);
      const id = fileName.replace(/\.[^/.]+$/, ""); // Remove file extension

      // Try to read metadata
      const metadata = await readComicMetadata(id);

      if (metadata) {
        // Return comic with full metadata
        return {
          ...metadata,
          id,
          image: `https://raw.githubusercontent.com/DarkoKuzmanovic/lenkalica/main/public/images/comics/${fileName}`,
        } as Comic;
      } else {
        // Create legacy comic with basic info
        return {
          id,
          title: id, // Use filename as title for legacy comics
          image: `https://raw.githubusercontent.com/DarkoKuzmanovic/lenkalica/main/public/images/comics/${fileName}`,
          tags: [],
          publishDate: stats.birthtime,
          createdAt: stats.birthtime,
          updatedAt: stats.birthtime,
          timestamp: stats.birthtime.getTime(), // Legacy support
        } as Comic;
      }
    });

  // Wait for all async operations to complete
  const resolvedComics = await Promise.all(comics);

  // Sort by publishDate, newest first (fallback to timestamp for legacy)
  return resolvedComics.sort((a, b) => {
    const dateA = a.publishDate || (a.timestamp ? new Date(a.timestamp) : new Date(0));
    const dateB = b.publishDate || (b.timestamp ? new Date(b.timestamp) : new Date(0));
    return dateB.getTime() - dateA.getTime();
  });
}

// Get a single comic by ID
export async function getComicById(id: string): Promise<Comic | null> {
  const comics = await getAllComics();
  return comics.find(comic => comic.id === id) || null;
}

// Create a new comic
export async function createComic(comicData: Omit<Comic, "id" | "createdAt" | "updatedAt">, imageFileName: string): Promise<Comic> {
  const now = new Date();
  const id = imageFileName.replace(/\.[^/.]+$/, ""); // Use filename as ID

  const newComic: Comic = {
    ...comicData,
    id,
    image: `https://raw.githubusercontent.com/DarkoKuzmanovic/lenkalica/main/public/images/comics/${imageFileName}`,
    createdAt: now,
    updatedAt: now,
  };

  // Write metadata
  await writeComicMetadata(newComic);

  return newComic;
}

// Update an existing comic
export async function updateComic(id: string, updates: Partial<Comic>): Promise<Comic | null> {
  const existingComic = await getComicById(id);
  if (!existingComic) {
    return null;
  }

  const updatedComic: Comic = {
    ...existingComic,
    ...updates,
    id, // Ensure ID doesn't change
    image: existingComic.image, // Ensure image path doesn't change
    updatedAt: new Date(),
  };

  await writeComicMetadata(updatedComic);
  return updatedComic;
}

// Delete a comic
export async function deleteComic(id: string): Promise<boolean> {
  try {
    const comic = await getComicById(id);
    if (!comic) {
      return false;
    }

    // Delete metadata file
    const metadataPath = getComicMetadataPath(id);
    if (fs.existsSync(metadataPath)) {
      fs.unlinkSync(metadataPath);
    }

    // Delete image file
    const imagePath = path.join(process.cwd(), "public", comic.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting comic ${id}:`, error);
    return false;
  }
}

// Get comics by series
export async function getComicsBySeries(series: string): Promise<Comic[]> {
  const comics = await getAllComics();
  return comics.filter(comic => comic.series === series);
}

// Get all unique series names
export async function getAllSeries(): Promise<string[]> {
  const comics = await getAllComics();
  const seriesSet = new Set<string>();

  comics.forEach(comic => {
    if (comic.series) {
      seriesSet.add(comic.series);
    }
  });

  return Array.from(seriesSet).sort();
}

// Search comics by title, description, or tags
export async function searchComics(query: string): Promise<Comic[]> {
  const comics = await getAllComics();
  const lowercaseQuery = query.toLowerCase();

  return comics.filter(comic =>
    comic.title.toLowerCase().includes(lowercaseQuery) ||
    (comic.description && comic.description.toLowerCase().includes(lowercaseQuery)) ||
    comic.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
