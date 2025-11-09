import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import supersub from "remark-supersub";

const shortsDirectory = path.join(process.cwd(), "content/shorts");

export interface Short {
  id: string;
  title: string;
  date: string;
  content: string;
  coverImage: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  author?: string;
}

export async function getAllShorts(): Promise<Short[]> {
  // Create directory if it doesn't exist
  if (!fs.existsSync(shortsDirectory)) {
    fs.mkdirSync(shortsDirectory, { recursive: true });
    return [];
  }

  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(shortsDirectory);
  } catch (error) {
    console.error("Error reading shorts directory:", error);
    return [];
  }

  const shorts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const id = fileName.replace(/\.md$/, "");
        const fullPath = path.join(shortsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        // Convert markdown to HTML
        const processedContent = await remark()
          .use(supersub)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeRaw)
          .use(rehypeStringify)
          .process(content);
        const contentHtml = processedContent.toString();

        // Construct image path
        const coverImage = `https://raw.githubusercontent.com/DarkoKuzmanovic/lenkalica/main/public/images/covers/${id}.png`;

        return {
          id,
          title: data.title || "Untitled",
          date: data.date || new Date().toISOString().split("T")[0],
          content: contentHtml,
          coverImage,
          excerpt: data.excerpt,
          category: data.category,
          tags: data.tags,
          author: data.author,
        };
      })
  );

  // Sort by date (newest first)
  return shorts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getShortById(id: string): Promise<Short | null> {
  try {
    const fullPath = path.join(shortsDirectory, `${id}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML
    const processedContent = await remark()
      .use(supersub)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .process(content);
    const contentHtml = processedContent.toString();

    // Construct image path
    const coverImage = `https://raw.githubusercontent.com/DarkoKuzmanovic/lenkalica/main/public/images/covers/${id}.png`;

    return {
      id,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString().split("T")[0],
      content: contentHtml,
      coverImage,
      excerpt: data.excerpt,
      category: data.category,
      tags: data.tags,
      author: data.author,
    };
  } catch (error) {
    console.error("Error reading short:", error);
    return null;
  }
}

export async function getNextShortNumber(): Promise<string> {
  try {
    const shorts = await getAllShorts();
    if (shorts.length === 0) {
      return "001";
    }

    // Extract numbers from IDs and find the highest
    const numbers = shorts
      .map((short) => {
        const match = short.id.match(/^(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => !isNaN(num));

    const maxNumber = Math.max(...numbers);
    const nextNumber = maxNumber + 1;

    // Pad with zeros to 3 digits
    return nextNumber.toString().padStart(3, "0");
  } catch (error) {
    console.error("Error getting next short number:", error);
    return "001";
  }
}