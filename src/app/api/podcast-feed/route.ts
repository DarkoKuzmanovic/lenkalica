import { getAllArticles } from "@/lib/articles";
import { NextResponse } from "next/server";

export async function GET() {
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
    <link>${baseUrl}/podcasts</link>
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
      <title>${article.title}</title>
      <description>${article.excerpt || ""}</description>
      <itunes:summary>${article.excerpt || ""}</itunes:summary>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <enclosure
        url="${baseUrl}${article.audioFile}"
        type="audio/mpeg"
        length="0"
      />
      <guid isPermaLink="false">${baseUrl}/articles/${article.id}</guid>
      <link>${baseUrl}/articles/${article.id}</link>
      ${article.author ? `<itunes:author>${article.author}</itunes:author>` : ""}
      <itunes:duration>00:00:00</itunes:duration>
      ${article.category ? `<itunes:category text="${article.category}"/>` : ""}
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
}
