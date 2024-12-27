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
        {/* Hero Section */}
        <div className="hero bg-base-200 rounded-box p-8 mb-16">
          <div className="hero-content text-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">Podcasts</h1>
              <p className="text-xl text-base-content/80">
                Listen to our articles in audio format. Perfect for when you&apos;re on the go.
              </p>
              <div className="mt-6">
                <Link href="/api/podcast-xml" className="btn btn-primary gap-2">
                  <svg
                    className="w-5 h-5"
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
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-8">
          {articlesWithAudio.map((article) => (
            <div key={article.id} className="card lg:card-side bg-base-100 shadow-xl">
              {/* Image */}
              <figure className="relative h-64 lg:w-[40%] lg:h-auto">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </figure>

              {/* Content */}
              <div className="card-body lg:w-[60%]">
                <div className="flex-1">
                  <div className="flex items-center gap-4 text-sm text-base-content/70 mb-3">
                    <span className="badge badge-primary">{article.category}</span>
                    <span>•</span>
                    <span>{calculateReadingTime(article.content)}</span>
                  </div>

                  <Link href={`/articles/${article.id}`}>
                    <h2 className="card-title hover:text-primary transition-colors mb-3">{article.title}</h2>
                  </Link>

                  <p className="text-base-content/70 line-clamp-2 mb-4">{article.excerpt}</p>
                </div>

                <div className="card-actions justify-between items-center">
                  <time className="text-sm text-base-content/60">
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
            <div className="alert alert-info justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>No audio articles available yet.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
