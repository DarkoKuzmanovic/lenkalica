import fs from "fs";
import path from "path";
import matter from "gray-matter";
import * as cheerio from "cheerio";

export type Short = {
  id: string;
  title: string;
  date: string;
  url: string;
  image: string;
};

type CacheEntry = {
  image: string;
  timestamp: number;
};

type ShortData = {
  title: string;
  date: string;
  url: string;
};

type ShortsFileData = {
  shorts: ShortData[];
};

const shortsFile = path.join(process.cwd(), "content/shorts.md");
const fallbackImagesDirectory = path.join(process.cwd(), "public/fallback-shorts");
const cacheFile = path.join(process.cwd(), ".next/cache/shorts-images.json");
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

function getRandomFallbackImage(): string {
  try {
    const fallbackImages = fs.readdirSync(fallbackImagesDirectory);
    if (fallbackImages.length === 0) {
      console.error("No fallback images found in directory:", fallbackImagesDirectory);
      return "/fallback-shorts/default.png"; // Ensure you have a default.png
    }
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    const fallbackImage = fallbackImages[randomIndex];
    return `/fallback-shorts/${fallbackImage}`;
  } catch (error) {
    console.error("Error accessing fallback images:", error);
    return "/fallback-shorts/default.png"; // Ensure you have a default.png
  }
}

function loadImageCache(): Record<string, CacheEntry> {
  try {
    if (fs.existsSync(cacheFile)) {
      const cache = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      return cache;
    }
  } catch (error) {
    console.error("Error loading image cache:", error);
  }
  return {};
}

function saveImageCache(cache: Record<string, CacheEntry>) {
  try {
    // Ensure the cache directory exists
    const cacheDir = path.dirname(cacheFile);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error("Error saving image cache:", error);
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeImage(url: string): Promise<string | null> {
  const cache = loadImageCache();
  const cacheEntry = cache[url];

  // Check if we have a valid cached entry
  if (cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_DURATION) {
    return cacheEntry.image;
  }

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ShortsScraper/1.0; +https://lenkalica.com)",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Try OpenGraph image first
      const ogImage = $('meta[property="og:image"]').attr("content") || $('meta[name="og:image"]').attr("content");
      if (ogImage) {
        cache[url] = { image: ogImage, timestamp: Date.now() };
        saveImageCache(cache);
        return ogImage;
      }

      // Try Twitter image
      const twitterImage = $('meta[name="twitter:image"]').attr("content");
      if (twitterImage) {
        cache[url] = { image: twitterImage, timestamp: Date.now() };
        saveImageCache(cache);
        return twitterImage;
      }

      // Try first large image in the article
      const firstLargeImage = $("img[width][height]")
        .filter((_, img) => {
          const width = parseInt($(img).attr("width") || "0");
          const height = parseInt($(img).attr("height") || "0");
          return width >= 600 && height >= 400;
        })
        .first()
        .attr("src");

      if (firstLargeImage) {
        // Convert relative URLs to absolute
        const finalImage = firstLargeImage.startsWith("/")
          ? `${new URL(url).origin}${firstLargeImage}`
          : firstLargeImage;

        cache[url] = { image: finalImage, timestamp: Date.now() };
        saveImageCache(cache);
        return finalImage;
      }

      return null;
    } catch (error) {
      console.error(`Error scraping image from ${url} (attempt ${attempt + 1}/${MAX_RETRIES}):`, error);
      if (attempt < MAX_RETRIES - 1) {
        await delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
        continue;
      }
    }
  }

  return null;
}

export async function getAllShorts(): Promise<Short[]> {
  try {
    // Read the shorts markdown file
    const fileContents = fs.readFileSync(shortsFile, "utf8");
    const { data } = matter(fileContents) as { data: ShortsFileData };

    if (!Array.isArray(data.shorts)) {
      throw new Error("Invalid shorts data format");
    }

    // Convert the data into Short objects with scraped images
    const shorts: Short[] = await Promise.all(
      data.shorts.map(async (short: ShortData, index: number) => {
        if (!short.url || !short.title || !short.date) {
          console.error(`Invalid short data at index ${index}:`, short);
          return null;
        }

        try {
          const scrapedImage = await scrapeImage(short.url);
          return {
            id: `short-${index + 1}`,
            title: short.title,
            date: short.date,
            url: short.url,
            image: scrapedImage || getRandomFallbackImage(),
          };
        } catch (error) {
          console.error(`Error processing short at index ${index}:`, error);
          return null;
        }
      })
    );

    // Filter out any null entries and sort by date
    return shorts.filter((short): short is Short => short !== null).sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error("Error getting all shorts:", error);
    return [];
  }
}
