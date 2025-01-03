import Image from "next/image";
import type { Short } from "@/lib/shorts";
import { headers } from "next/headers";

async function getShorts(): Promise<Short[]> {
  // Get the host from headers during SSR
  const headersList = headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const response = await fetch(`${protocol}://${host}/api/shorts`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error("Failed to fetch shorts");
  }

  return response.json();
}

export default async function ShortsPage() {
  const shorts = await getShorts();

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

function ShortCard({ short }: { short: Short }) {
  return (
    <a href={short.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
      <article className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200 h-full flex flex-col">
        {/* Image */}
        <figure className="relative aspect-square">
          <Image
            src={short.image}
            alt={short.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
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
