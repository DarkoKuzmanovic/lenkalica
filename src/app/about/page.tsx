import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1>About Lenkalica</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Exploring and sharing fascinating stories about culture, history, and geography.
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <div className="relative w-full h-[300px] mb-8 rounded-xl overflow-hidden">
            <Image src="/images/about-cover.jpg" alt="About Lenkalica" fill className="object-cover" priority />
          </div>

          <h2>Our Mission</h2>
          <p>
            At Lenkalica, we believe that every place has a story to tell. Our mission is to uncover and share these
            fascinating narratives about culture, history, and geography that shape our world.
          </p>

          <h2>What We Cover</h2>
          <ul>
            <li>Cultural traditions and their evolution over time</li>
            <li>Historical events that shaped communities</li>
            <li>Geographical wonders and their impact on civilizations</li>
            <li>Stories of cultural exchange and human connection</li>
          </ul>

          <h2>Our Approach</h2>
          <p>
            We combine thorough research with engaging storytelling to bring you articles that are both informative and
            enjoyable to read. Each piece is carefully crafted to provide unique insights while remaining accessible to
            all readers.
          </p>

          <h2>Join Our Journey</h2>
          <p>
            Whether you're a history enthusiast, culture lover, or simply curious about the world around us, we invite
            you to join us on this journey of discovery. Through our articles, we hope to inspire a deeper appreciation
            for the rich tapestry of human experience.
          </p>
        </div>
      </div>
    </div>
  );
}
