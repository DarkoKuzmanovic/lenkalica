import type { Short } from "@/lib/shorts";
import { getAllShorts } from "@/lib/shorts";
import { ImageWithFallback } from "@/components/ImageWithFallback";

// Enable static generation with ISR
export const revalidate = 3600; // Revalidate every hour

function ShortCard({ short }: { short: Short }) {
  return (
    <a href={short.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
      <article className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200 h-full flex flex-col">
        {/* Image */}
        <figure className="relative aspect-square">
          <ImageWithFallback src={short.image} alt={short.title} />
        </figure>

        {/* Content */}
        <div className="card-body flex-1 flex flex-col justify-between">
          <h2 className="card-title text-lg group-hover:text-primary transition-colors duration-200 line-clamp-3">
            {short.title}
          </h2>
          <time className="text-sm text-base-content/60 mt-auto">
            {new Date(short.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </article>
    </a>
  );
}

export default async function ShortsPage() {
  const shorts = await getAllShorts();

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="max-w-2xl">
          <h1 className="mb-4">Shorts</h1>
          <p className="text-base-content/70">A curated collection of interesting articles from around the web.</p>
        </header>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {shorts.map((short) => (
            <ShortCard key={short.id} short={short} />
          ))}
        </div>
      </div>
    </div>
  );
}
