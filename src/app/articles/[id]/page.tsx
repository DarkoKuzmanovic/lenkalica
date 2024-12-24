import { getArticleById } from "@/lib/articles";
import ArticleMeta from "@/components/ArticleMeta";
import Image from "next/image";
import { notFound } from "next/navigation";
import AudioButton from "@/components/AudioButton";
import TTSButton from "@/components/TTSButton";
import { Metadata } from "next";

type PageParams = { id: string };

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const article = await getArticleById(params.id);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${article.title} | Lenkalica`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: PageParams }) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  // Remove HTML tags for TTS
  const plainText = article.content.replace(/<[^>]*>/g, "");

  return (
    <div className="py-8">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative w-full h-[400px] mb-12 rounded-2xl overflow-hidden shadow-xl">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
        </div>

        {/* Article Header */}
        <header className="max-w-3xl mx-auto text-center mb-12">
          <h1>{article.title}</h1>
          <ArticleMeta article={article} />
          <div className="mt-6 flex items-center justify-center gap-4">
            {article.audioFile && <AudioButton audioUrl={article.audioFile} title={article.title} />}
            <TTSButton text={plainText} title={article.title} />
          </div>
        </header>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          <div
            className="prose prose-lg md:prose-xl dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 my-12 justify-center">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
