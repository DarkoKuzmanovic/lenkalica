"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// Function to get available cover images
const getAvailableCoverImages = () => {
  // Currently we have images 1 and 2
  return [1, 2, 3].map((num) => `/images/about-cover-${num}.png`);
};

export default function AboutPage() {
  const [coverImage, setCoverImage] = useState<string>("/images/about-cover-1.png");

  useEffect(() => {
    const images = getAvailableCoverImages();
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setCoverImage(randomImage);
  }, []);

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1>About Lenkalica</h1>
          <p className="mt-4 text-lg">
            Hello love! &#129392; <br />I hope this becomes a place where you can find inspiration and joy. &#127968;
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <div className="relative w-full h-[400px] mb-9 rounded-xl overflow-hidden">
            <Image src={coverImage} alt="About Lenkalica" fill className="object-cover" priority />
          </div>

          <h2>How it all started</h2>
          <p>
            <i>&quot;It was a cold and stormy night...&quot;</i> &#128513; ...in the middle of the winter of 2024. You
            were peacefuly asleep, Frasier was running on TV, I was on my god-knows-which cup of coffee, clacking on the
            keyboard. And <i>suddenly</i> I made a rocking website for you and was dying to show it off... then I
            decided it wasn&apos;t good enogh. Rinse and repeat, and after a few iterations, name changes, idea changes
            here we are. &#x1F941;
          </p>

          <h2>My Mission</h2>
          <p>
            When your mind wanders - I&apos;d like it to settle on the wonders of the world around us. When you smile,
            I&apos;d like to be the one that brought that smile to your face. When you&apos;re sad, I hope this makes
            things a little bit lighter.
            <br />
            <br />
            So, to say it simply - <b>my mission is to make you feel loved. &#x2665;&#xfe0f;</b>
          </p>

          <h2>How I build it</h2>
          <p>
            I build this website using <a href="https://www.cursor.com">Cursor IDE</a>. That&apos;s a fork of VSCode,
            but with better AI buddy. Tech stack I&apos;m using is <a href="https://nextjs.org/">Next.js</a> (which
            makes it load faster than Springfield&apos;s website), <a href="https://tailwindcss.com/">Tailwind CSS</a>{" "}
            (makes it look very cool, modern, and so on and so forth),{" "}
            <a href="https://www.typescriptlang.org/">TypeScript</a> (which makes it work very well), and it&apos;s
            hosted on Github and brought to life on Vercel.
            <br />
            <br />
            Remind me to tell you more in-depth about some cool features of it.
          </p>
          <Image src="/images/signature.png" alt="With Love, Your Daka" width={300} height={300} />
        </div>
      </div>
    </div>
  );
}
