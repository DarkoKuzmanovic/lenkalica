import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
      return "/fallback-shorts/default.png";
    }
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    const fallbackImage = fallbackImages[randomIndex];
    return `/fallback-shorts/${fallbackImage}`;
  } catch (error) {
    console.error("Error accessing fallback images:", error);
    return "/fallback-shorts/default.png";
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

async function extractMetaTags(html: string): Promise<Record<string, string>> {
  const metaTags: Record<string, string> = {};
  const metaRegex = /<meta[^>]+>/g;
  const propertyRegex = /(?:property|name)=["']([^"']+)["']/;
  const contentRegex = /content=["']([^"']+)["']/;

  const matches = html.match(metaRegex) || [];

  for (const match of matches) {
    const propertyMatch = match.match(propertyRegex);
    const contentMatch = match.match(contentRegex);

    if (propertyMatch && contentMatch) {
      metaTags[propertyMatch[1]] = contentMatch[1];
    }
  }

  return metaTags;
}

async function scrapeImage(url: string): Promise<string | null> {
  const cache = loadImageCache();
  const cacheEntry = cache[url];

  if (cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_DURATION) {
    return cacheEntry.image;
  }

  // Return fallback immediately for science.org URLs
  if (url.includes("science.org")) {
    const fallbackImage = getRandomFallbackImage();
    cache[url] = { image: fallbackImage, timestamp: Date.now() };
    saveImageCache(cache);
    return fallbackImage;
  }

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
        },
      });

      // If we get a 403, use fallback image
      if (response.status === 403) {
        const fallbackImage = getRandomFallbackImage();
        cache[url] = { image: fallbackImage, timestamp: Date.now() };
        saveImageCache(cache);
        return fallbackImage;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const metaTags = await extractMetaTags(html);

      // Try OpenGraph image
      const ogImage = metaTags["og:image"];
      if (ogImage) {
        cache[url] = { image: ogImage, timestamp: Date.now() };
        saveImageCache(cache);
        return ogImage;
      }

      // Try Twitter image
      const twitterImage = metaTags["twitter:image"];
      if (twitterImage) {
        cache[url] = { image: twitterImage, timestamp: Date.now() };
        saveImageCache(cache);
        return twitterImage;
      }

      // If no image found, use fallback
      const fallbackImage = getRandomFallbackImage();
      cache[url] = { image: fallbackImage, timestamp: Date.now() };
      saveImageCache(cache);
      return fallbackImage;
    } catch (error) {
      console.error(`Error scraping image from ${url} (attempt ${attempt + 1}/${MAX_RETRIES}):`, error);
      if (attempt < MAX_RETRIES - 1) {
        await delay(RETRY_DELAY * (attempt + 1));
        continue;
      }
    }
  }

  // If all retries failed, use fallback
  const fallbackImage = getRandomFallbackImage();
  cache[url] = { image: fallbackImage, timestamp: Date.now() };
  saveImageCache(cache);
  return fallbackImage;
}

export async function getAllShorts(): Promise<Short[]> {
  try {
    const fileContents = fs.readFileSync(shortsFile, "utf8");
    const { data } = matter(fileContents) as { data: ShortsFileData };

    if (!Array.isArray(data.shorts)) {
      throw new Error("Invalid shorts data format");
    }

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

    return shorts.filter((short): short is Short => short !== null).sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error("Error getting all shorts:", error);
    return [];
  }
}
