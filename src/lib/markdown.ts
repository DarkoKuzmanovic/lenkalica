import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import supersub from "remark-supersub";
import { defaultSchema } from "rehype-sanitize";

/**
 * Converts markdown to HTML using the unified remark/rehype pipeline.
 * Supports superscript/subscript syntax, preserves raw HTML, and sanitizes output.
 * Sanitization prevents XSS attacks while allowing common formatting elements.
 *
 * @param markdown - The markdown content to convert
 * @returns Promise resolving to sanitized HTML string
 */
export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  // Extend default schema to allow common elements used in articles
  const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [
      ...(defaultSchema.tagNames || []),
      "sup",
      "sub",
      "figure",
      "figcaption",
      "iframe", // For embedded content - be cautious with this
    ],
    attributes: {
      ...defaultSchema.attributes,
      // Allow common attributes for iframe (for video embeds, etc.)
      iframe: ["src", "width", "height", "frameborder", "allowfullscreen", "title"],
      // Allow data attributes for custom functionality
      "*": [...(defaultSchema.attributes?.["*"] || []), "className", "id"],
    },
  };

  const processedContent = await remark()
    .use(supersub)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(markdown);

  return processedContent.toString();
}
