import { getAllArticles } from "@/lib/articles";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Function to escape XML special characters, but not URLs
function escapeXml(unsafe: string, isUrl = false): string {
  if (isUrl) {
    return unsafe;
  }
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Function to validate audio file
function validateAudioFile(audioFile: string): { isValid: boolean; size: number } {
  try {
    const fullPath = path.join(process.cwd(), "public", audioFile);
    const stats = fs.statSync(fullPath);
    return { isValid: true, size: stats.size };
  } catch (error) {
    console.error(`Error validating audio file ${audioFile}:`, error);
    return { isValid: false, size: 0 };
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
    const articlesWithAudio = articles.filter((article): article is typeof article & { audioFile: string } => {
      if (typeof article.audioFile !== "string") return false;
      const { isValid } = validateAudioFile(article.audioFile);
      return isValid;
    });

    // Get the base URL from environment variable or default to production URL
    const baseUrl = ensureHttps(process.env.NEXT_PUBLIC_BASE_URL || "lenkalica.vercel.app");
    const podcastCoverUrl = `${baseUrl}/images/podcast-cover.jpg`;

    // Create the RSS feed
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0">
  <channel>
    <title>Lenkalica Podcasts</title>
    <link>${escapeXml(baseUrl, true)}/podcasts</link>
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
    <itunes:image href="${escapeXml(podcastCoverUrl, true)}"/>
    <image>
      <url>${escapeXml(podcastCoverUrl, true)}</url>
      <title>Lenkalica Podcasts</title>
      <link>${escapeXml(baseUrl, true)}/podcasts</link>
    </image>
    <googleplay:image href="${escapeXml(podcastCoverUrl, true)}"/>
    ${articlesWithAudio
      .map((article) => {
        const { size } = validateAudioFile(article.audioFile);
        const audioUrl = `${baseUrl}${article.audioFile}`;
        const articleUrl = `${baseUrl}/articles/${article.id}`;

        return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <description>${escapeXml(article.excerpt || "")}</description>
      <itunes:summary>${escapeXml(article.excerpt || "")}</itunes:summary>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <enclosure
        url="${escapeXml(audioUrl, true)}"
        type="audio/mpeg"
        length="${size}"
      />
      <guid isPermaLink="false">${escapeXml(articleUrl, true)}</guid>
      <link>${escapeXml(articleUrl, true)}</link>
      ${article.author ? `<itunes:author>${escapeXml(article.author)}</itunes:author>` : ""}
      <itunes:duration>00:00:00</itunes:duration>
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
      }
    );
  }
}
