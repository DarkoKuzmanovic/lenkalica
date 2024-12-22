export function calculateReadingTime(content: string): string {
  // Average reading speed (words per minute)
  const WORDS_PER_MINUTE = 200;

  // Remove HTML tags and trim whitespace
  const plainText = content.replace(/<[^>]*>/g, "").trim();

  // Count words (split by whitespace)
  const wordCount = plainText.split(/\s+/).length;

  // Calculate reading time in minutes
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  // Format the output
  if (minutes === 1) {
    return "1 min read";
  }
  return `${minutes} min read`;
}
