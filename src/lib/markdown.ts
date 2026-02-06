import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import supersub from "remark-supersub";

/**
 * Converts markdown to HTML using the unified remark/rehype pipeline.
 * Supports superscript/subscript syntax and preserves raw HTML.
 * 
 * @param markdown - The markdown content to convert
 * @returns Promise resolving to HTML string
 */
export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const processedContent = await remark()
    .use(supersub)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);
  
  return processedContent.toString();
}
