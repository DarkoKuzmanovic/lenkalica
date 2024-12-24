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
