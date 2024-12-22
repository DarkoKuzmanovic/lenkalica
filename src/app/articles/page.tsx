import { getAllArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1>Articles & Stories</h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            Discover fascinating stories about culture, history, and geography. Each article is carefully crafted to
            bring you unique insights and perspectives.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
