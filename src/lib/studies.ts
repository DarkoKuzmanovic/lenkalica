import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import supersub from "remark-supersub";

const studiesDirectory = path.join(process.cwd(), "content/studies");

export interface Study {
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  author?: string;
  readingTime?: string;
  wordCount?: number;
  hasInfographic?: boolean;
  coverImage?: string;
}

export async function getAllStudies(): Promise<Study[]> {
  // Create directory if it doesn't exist
  if (!fs.existsSync(studiesDirectory)) {
    fs.mkdirSync(studiesDirectory, { recursive: true });
    return [];
  }

  const studyFolders = fs.readdirSync(studiesDirectory);

  const studies = await Promise.all(
    studyFolders
      .filter((folderName) => {
        const folderPath = path.join(studiesDirectory, folderName);
        return fs.statSync(folderPath).isDirectory();
      })
      .map(async (folderName) => {
        const slug = folderName;
        const indexPath = path.join(studiesDirectory, folderName, "index.md");
        
        if (!fs.existsSync(indexPath)) {
          return null;
        }

        const fileContents = fs.readFileSync(indexPath, "utf8");
        const { data, content } = matter(fileContents);

        // Convert markdown to HTML
        const processedContent = await remark()
          .use(supersub)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeRaw)
          .use(rehypeStringify)
          .process(content);
        const contentHtml = processedContent.toString();

        return {
          slug,
          title: data.title,
          date: data.date,
          content: contentHtml,
          excerpt: data.excerpt,
          category: data.category,
          tags: data.tags,
          author: data.author,
          readingTime: data.readingTime,
          wordCount: data.wordCount,
          hasInfographic: data.hasInfographic,
          coverImage: `/images/covers/${slug}.png`,
        };
      })
  );

  return studies
    .filter((study): study is Study => study !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getStudyBySlug(slug: string): Promise<Study | undefined> {
  try {
    const indexPath = path.join(studiesDirectory, slug, "index.md");
    const fileContents = fs.readFileSync(indexPath, "utf8");
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML
    const processedContent = await remark()
      .use(supersub)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      title: data.title,
      date: data.date,
      content: contentHtml,
      excerpt: data.excerpt,
      category: data.category,
      tags: data.tags,
      author: data.author,
      readingTime: data.readingTime,
      wordCount: data.wordCount,
      hasInfographic: data.hasInfographic,
      coverImage: `/images/covers/${slug}.png`,
    };
  } catch {
    return undefined;
  }
}

export async function getStudyInfographic(slug: string): Promise<string | undefined> {
  try {
    const infographicPath = path.join(studiesDirectory, slug, "infographic.html");
    
    if (!fs.existsSync(infographicPath)) {
      return undefined;
    }

    return fs.readFileSync(infographicPath, "utf8");
  } catch {
    return undefined;
  }
}