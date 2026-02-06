import { NextRequest, NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";
import { getAllShorts } from "@/lib/shorts";
import { parsePaginationParams } from "@/utils/validation";

interface SearchResult {
  id: string;
  title: string;
  type: "article" | "podcast" | "short";
  url: string;
  excerpt?: string;
  image?: string;
  date?: string;
}

function searchInText(text: string, query: string): boolean {
  if (!text || !query) return false;
  return text.toLowerCase().includes(query.toLowerCase());
}

function createExcerpt(content: string, query: string, maxLength: number = 150): string {
  if (!content) return "";

  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const queryIndex = lowerContent.indexOf(lowerQuery);

  if (queryIndex === -1) {
    return content.substring(0, maxLength) + (content.length > maxLength ? "..." : "");
  }

  const start = Math.max(0, queryIndex - 50);
  const end = Math.min(content.length, queryIndex + query.length + 100);
  const excerpt = content.substring(start, end);

  return (start > 0 ? "..." : "") + excerpt + (end < content.length ? "..." : "");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const { page, limit } = parsePaginationParams(searchParams, { defaultLimit: 10, maxLimit: 100 });

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results: SearchResult[] = [];

    // Load articles once and reuse for both articles and podcasts search
    const articles = await getAllArticles();

    // Search articles
    for (const article of articles) {
      const matchesTitle = searchInText(article.title, query);
      const matchesContent = searchInText(article.content, query);
      const matchesExcerpt = article.excerpt && searchInText(article.excerpt, query);

      if (matchesTitle || matchesContent || matchesExcerpt) {
        results.push({
          id: article.id,
          title: article.title,
          type: "article",
          url: `/articles/${article.id}`,
          excerpt: article.excerpt || createExcerpt(article.content.replace(/<[^>]*>/g, ""), query),
          image: article.coverImage,
          date: article.date,
        });
      }
    }

    // Search podcasts (articles with audio) - reuse loaded articles data
    const podcasts = articles
      .filter((article) => article.audioFile)
      .map((article) => ({
        id: article.id,
        title: article.title,
        type: "podcast" as const,
        url: `/articles/${article.id}`,
        excerpt: article.excerpt,
        image: article.coverImage,
        date: article.date,
      }));

    for (const podcast of podcasts) {
      const matchesTitle = searchInText(podcast.title, query);
      const matchesExcerpt = podcast.excerpt && searchInText(podcast.excerpt, query);

      if (matchesTitle || matchesExcerpt) {
        // Only add if not already added as article
        const alreadyAdded = results.some((r) => r.id === podcast.id);
        if (!alreadyAdded) {
          results.push(podcast);
        }
      }
    }

    // Search shorts
    const shorts = await getAllShorts();
    for (const short of shorts) {
      const matchesTitle = searchInText(short.title, query);
      const matchesContent = searchInText(short.content, query);
      const matchesExcerpt = short.excerpt && searchInText(short.excerpt, query);

      if (matchesTitle || matchesContent || matchesExcerpt) {
        results.push({
          id: short.id,
          title: short.title,
          type: "short",
          url: `/shorts/${short.id}`,
          excerpt: short.excerpt || createExcerpt(short.content.replace(/<[^>]*>/g, ""), query),
          image: short.coverImage,
          date: short.date,
        });
      }
    }

    // Sort by relevance (title matches first, then by date)
    results.sort((a, b) => {
      const aTitleMatch = searchInText(a.title, query);
      const bTitleMatch = searchInText(b.title, query);

      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;

      // If both or neither match title, sort by date (newest first)
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }

      return 0;
    });

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);
    const totalPages = Math.ceil(results.length / limit);

    return NextResponse.json({
      results: paginatedResults,
      total: results.length,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
