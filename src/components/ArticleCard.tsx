import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/articles";
import { calculateReadingTime } from "@/utils/readingTime";

export default function ArticleCard({ article }: { article: Article }) {
  const readingTime = calculateReadingTime(article.content);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
      <div className="flex-shrink-0 relative h-56">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{article.category}</p>
          <Link href={`/articles/${article.id}`} className="block mt-2 group">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
              {article.title}
            </h2>
          </Link>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-300 line-clamp-3">{article.excerpt}</p>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <time dateTime={article.date} className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {readingTime}
          </div>
        </div>
      </div>
    </div>
  );
}
