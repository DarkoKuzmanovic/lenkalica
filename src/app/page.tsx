import NasaImageOfDay from "@/components/NasaImageOfDay";
import WordOfDay from "@/components/WordOfDay";
import ArtworkOfDay from "@/components/ArtworkOfDay";
import RandomFacts from "@/components/RandomFacts";
import DadJoke from "@/components/DadJoke";
import LiveWebcam from "@/components/LiveWebcam";

export default function HomePage() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Lenkalica</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Exploring stories about culture, history, and geography.
          </p>
        </div>

        <div className="space-y-16">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Word of the Day</h2>
              <a
                href="https://www.merriam-webster.com/word-of-the-day"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
              >
                Visit Merriam-Webster →
              </a>
            </div>
            <WordOfDay />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">NASA Astronomy Picture of the Day</h2>
              <a
                href="https://apod.nasa.gov/apod/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
              >
                Visit APOD Website →
              </a>
            </div>
            <NasaImageOfDay />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Random Facts</h2>
              <a
                href="https://uselessfacts.jsph.pl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
              >
                Visit Random Facts API →
              </a>
            </div>
            <RandomFacts />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dad Joke of the Day</h2>
              <a
                href="https://icanhazdadjoke.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
              >
                Visit icanhazdadjoke →
              </a>
            </div>
            <DadJoke />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Artwork of the Day</h2>
              <a
                href="https://www.artic.edu/collection"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
              >
                Visit Art Institute of Chicago →
              </a>
            </div>
            <ArtworkOfDay />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Daily Live Webcam from Around the World
              </h2>
            </div>
            <LiveWebcam />
          </div>
        </div>
      </div>
    </main>
  );
}
