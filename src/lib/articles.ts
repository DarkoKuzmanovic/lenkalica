import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "content/articles");

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
}

export async function getAllArticles(): Promise<Article[]> {
  // Create directory if it doesn't exist
  if (!fs.existsSync(articlesDirectory)) {
    fs.mkdirSync(articlesDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);

  const articles = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const id = fileName.replace(/\.md$/, "");
        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        // Convert markdown to HTML
        const processedContent = await remark().use(html).process(content);
        const contentHtml = processedContent.toString();

        return {
          id,
          title: data.title,
          date: data.date,
          content: contentHtml,
          coverImage: `/images/covers/${id}.png`,
          audioFile: `/audio/${id}.mp3`,
          excerpt: data.excerpt,
          category: data.category,
          tags: data.tags,
        };
      })
  );

  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  try {
    const fullPath = path.join(articlesDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
      id,
      title: data.title,
      date: data.date,
      content: contentHtml,
      coverImage: `/images/covers/${id}.png`,
      audioFile: `/audio/${id}.mp3`,
      excerpt: data.excerpt,
      category: data.category,
      tags: data.tags,
    };
  } catch {
    return undefined;
  }
}
