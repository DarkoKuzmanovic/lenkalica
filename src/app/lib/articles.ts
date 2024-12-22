import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export interface Article {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  audioFile: string;
}

export function getAllArticles(): Article[] {
  const fileNames = fs.readdirSync(articlesDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, "");
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        id,
        title: data.title,
        content,
        coverImage: `/images/covers/${id}.png`,
        audioFile: `/audio/${id}.mp3`,
      };
    })
    .sort((a, b) => (a.id > b.id ? 1 : -1));
}

export function getArticleById(id: string): Article | undefined {
  try {
    const fullPath = path.join(articlesDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.title,
      content,
      coverImage: `/images/covers/${id}.png`,
      audioFile: `/audio/${id}.mp3`,
    };
  } catch {
    return undefined;
  }
}
