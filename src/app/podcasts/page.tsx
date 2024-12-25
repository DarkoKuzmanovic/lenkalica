import { getAllArticles } from "@/lib/articles";
import Image from "next/image";
import Link from "next/link";
import AudioButton from "@/components/AudioButton";
import { calculateReadingTime } from "@/utils/readingTime";

export default async function PodcastsPage() {
  const allArticles = await getAllArticles();
  const articlesWithAudio = allArticles.filter((article) => article.audioFile);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1>Podcasts</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Listen to our articles in audio format. Perfect for when you&apos;re on the go.
          </p>
          <div className="mt-6">
            <Link
              href="/api/podcast-feed"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
              Subscribe to RSS Feed
            </Link>
          </div>
        </div>

        <div className="mt-16 space-y-8">
          {articlesWithAudio.map((article) => (
            <div
              key={article.id}
              className="flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full md:w-72 h-48 md:h-auto">
                <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">{article.category}</span>
                    <span>•</span>
                    <span>{calculateReadingTime(article.content)}</span>
                  </div>

                  <Link href={`/articles/${article.id}`}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-3">
                      {article.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{article.excerpt}</p>
                </div>

                <div className="flex items-center justify-between">
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  {article.audioFile && <AudioButton audioUrl={article.audioFile} title={article.title} />}
                </div>
              </div>
            </div>
          ))}

          {articlesWithAudio.length === 0 && (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">No audio articles available yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
