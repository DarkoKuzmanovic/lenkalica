import { Article } from "@/lib/articles";
import { calculateReadingTime } from "@/utils/readingTime";

export default function ArticleMeta({ article }: { article: Article }) {
  const readingTime = calculateReadingTime(article.content);

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-base-content/70">
      {article.author && (
        <div className="flex items-center">
          <svg className="mr-2 h-4 w-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="font-medium">{article.author}</span>
        </div>
      )}
      <time dateTime={article.date} className="flex items-center">
        <svg className="mr-2 h-4 w-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {new Date(article.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <div className="flex items-center">
        <svg className="mr-2 h-4 w-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <span className="badge badge-primary">{article.category}</span>
      </div>
      <div className="flex items-center">
        <svg className="mr-2 h-4 w-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="badge badge-ghost">{readingTime}</span>
      </div>
    </div>
  );
}
