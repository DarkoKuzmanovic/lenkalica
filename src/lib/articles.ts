import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdownToHtml } from "./markdown";
import { isSafeContentId } from "@/utils/validation";
import audioManifest from "./audio-manifest.json";

const articlesDirectory = path.join(process.cwd(), "content/articles");

// Type for the audio manifest generated at build time
const manifest = audioManifest as Record<string, { file: string; size: number }>;

export interface Article {
  id: string;
  title: string;
  date: string;
  content: string;
  coverImage: string;
  audioFile?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  author?: string;
}

export async function getAllArticles(): Promise<Article[]> {
  // Create directory if it doesn't exist
  if (!fs.existsSync(articlesDirectory)) {
    fs.mkdirSync(articlesDirectory, { recursive: true });
    return [];
  }

  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(articlesDirectory);
  } catch (error) {
    console.error("Error reading articles directory:", error);
    return [];
  }

  const articles = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const id = fileName.replace(/\.md$/, "");
        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        // Convert markdown to HTML
        const contentHtml = await renderMarkdownToHtml(content);

        // Use build-time audio manifest instead of fs.existsSync (which fails on Vercel)
        const hasAudio = id in manifest;

        return {
          id,
          title: data.title,
          date: data.date,
          content: contentHtml,
          coverImage: `https://raw.githubusercontent.com/DarkoKuzmanovic/lenkalica/main/public/images/covers/${id}.png`,
          audioFile: hasAudio
            ? `https://raw.githubusercontent.com/DarkoKuzmanovic/lenkalica/main/public/audio/${id}.mp3`
            : undefined,
          excerpt: data.excerpt,
          category: data.category,
          tags: data.tags,
          author: data.author,
        };
      }),
  );

  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  // Validate ID to prevent path traversal attacks
  if (!isSafeContentId(id)) {
    console.warn(`Invalid article ID attempted: ${id}`);
    return undefined;
  }

  try {
    const fullPath = path.join(articlesDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML
    const contentHtml = await renderMarkdownToHtml(content);

    // Use build-time audio manifest instead of fs.existsSync (which fails on Vercel)
    const hasAudio = id in manifest;

    return {
      id,
      title: data.title,
      date: data.date,
      content: contentHtml,
      coverImage: `https://raw.githubusercontent.com/DarkoKuzmanovic/lenkalica/main/public/images/covers/${id}.png`,
      audioFile: hasAudio
        ? `https://raw.githubusercontent.com/DarkoKuzmanovic/lenkalica/main/public/audio/${id}.mp3`
        : undefined,
      excerpt: data.excerpt,
      category: data.category,
      tags: data.tags,
      author: data.author,
    };
  } catch {
    return undefined;
  }
}
