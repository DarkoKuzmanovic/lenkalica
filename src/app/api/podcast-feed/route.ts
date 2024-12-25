import { getAllArticles } from "@/lib/articles";
import { NextResponse } from "next/server";

// Function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const articles = await getAllArticles();
    const articlesWithAudio = articles.filter((article) => article.audioFile);

    // Get the base URL from environment variable or default to localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Create the RSS feed
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Lenkalica Podcasts</title>
    <link>${escapeXml(baseUrl)}/podcasts</link>
    <language>en-us</language>
    <itunes:author>Lenkalica</itunes:author>
    <description>Listen to our articles in audio format. Perfect for when you're on the go.</description>
    <itunes:summary>Listen to our articles in audio format. Perfect for when you're on the go.</itunes:summary>
    <itunes:type>episodic</itunes:type>
    <itunes:owner>
      <itunes:name>Lenkalica</itunes:name>
      <itunes:email>contact@lenkalica.com</itunes:email>
    </itunes:owner>
    <itunes:explicit>false</itunes:explicit>
    <itunes:category text="Education"/>
    ${articlesWithAudio
      .map(
        (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <description>${escapeXml(article.excerpt || "")}</description>
      <itunes:summary>${escapeXml(article.excerpt || "")}</itunes:summary>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <enclosure
        url="${escapeXml(`${baseUrl}${article.audioFile}`)}"
        type="audio/mpeg"
        length="0"
      />
      <guid isPermaLink="false">${escapeXml(`${baseUrl}/articles/${article.id}`)}</guid>
      <link>${escapeXml(`${baseUrl}/articles/${article.id}`)}</link>
      ${article.author ? `<itunes:author>${escapeXml(article.author)}</itunes:author>` : ""}
      <itunes:duration>00:00:00</itunes:duration>
      ${article.category ? `<itunes:category text="${escapeXml(article.category)}"/>` : ""}
      <content:encoded><![CDATA[${article.content}]]></content:encoded>
    </item>`
      )
      .join("\n")}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating podcast feed:", error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Lenkalica Podcasts</title>
    <description>Error generating podcast feed</description>
  </channel>
</rss>`,
      {
        status: 500,
        headers: {
          "Content-Type": "application/xml",
        },
      }
    );
  }
}
