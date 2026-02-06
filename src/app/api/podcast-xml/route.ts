import { getAllArticles } from "@/lib/articles";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Function to escape URLs for use in XML attributes
// Only escapes characters that are invalid in XML attributes (&, ")
// while preserving URL structure
function escapeUrlForXmlAttribute(url: string): string {
  return url.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

// Function to check if URL is remote
function isRemoteUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

// Function to get audio file size for local files
function getLocalAudioSize(audioFile: string): number {
  try {
    const fullPath = path.join(process.cwd(), "public", "audio", audioFile);
    const stats = fs.statSync(fullPath);
    return stats.size;
  } catch (error) {
    console.error(`Error getting audio file size ${audioFile}:`, error);
    return 0;
  }
}

// Function to ensure URL has https:// protocol
function ensureHttps(url: string): string {
  if (!url.startsWith("http")) {
    return `https://${url}`;
  }
  return url;
}

export async function GET() {
  try {
    const articles = await getAllArticles();
    // Filter articles that have audioFile set (already validated in getAllArticles)
    const articlesWithAudio = articles.filter((article): article is typeof article & { audioFile: string } => {
      return typeof article.audioFile === "string" && article.audioFile.length > 0;
    });

    // Get the base URL from environment variable or default to production URL
    const baseUrl = ensureHttps(process.env.NEXT_PUBLIC_BASE_URL || "lenkalica.vercel.app");
    const podcastCoverUrl = `https://raw.githubusercontent.com/DarkoKuzmanovic/lenkalica/main/public/images/podcast-cover.jpg`;

    // Create the RSS feed
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <atom:link href="${escapeUrlForXmlAttribute(baseUrl)}/api/podcast-xml" rel="self" type="application/rss+xml" />
    <title>Lenkalica Podcasts</title>
    <link>${escapeUrlForXmlAttribute(baseUrl)}/podcasts</link>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} Lenkalica</copyright>
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
    <itunes:image href="${escapeUrlForXmlAttribute(podcastCoverUrl)}"/>
    <image>
      <url>${escapeUrlForXmlAttribute(podcastCoverUrl)}</url>
      <title>Lenkalica Podcasts</title>
      <link>${escapeUrlForXmlAttribute(baseUrl)}/podcasts</link>
    </image>
    <googleplay:image href="${escapeUrlForXmlAttribute(podcastCoverUrl)}"/>
    ${articlesWithAudio
      .map((article) => {
        // Use audioFile directly if it's a remote URL, otherwise construct full URL
        const audioUrl = isRemoteUrl(article.audioFile) ? article.audioFile : `${baseUrl}/audio/${article.audioFile}`;
        const articleUrl = `${baseUrl}/articles/${article.id}`;
        // Try to get size from local file using article ID
        const size = getLocalAudioSize(`${article.id}.mp3`);

        return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <description>${escapeXml(article.excerpt || "")}</description>
      <itunes:summary>${escapeXml(article.excerpt || "")}</itunes:summary>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <enclosure
        url="${escapeUrlForXmlAttribute(audioUrl)}"
        type="audio/mpeg"${
          size > 0
            ? `
        length="${size}"`
            : ""
        }
      />
      <guid isPermaLink="false">${escapeUrlForXmlAttribute(articleUrl)}</guid>
      <link>${escapeUrlForXmlAttribute(articleUrl)}</link>
      ${article.author ? `<itunes:author>${escapeXml(article.author)}</itunes:author>` : ""}
      <itunes:duration>10:00</itunes:duration>
      ${article.category ? `<itunes:category text="${escapeXml(article.category)}"/>` : ""}
      <content:encoded><![CDATA[${article.excerpt || ""}]]></content:encoded>
    </item>`;
      })
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
      },
    );
  }
}
