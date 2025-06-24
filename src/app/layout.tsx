import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif, Literata } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { AudioProvider } from "@/context/AudioContext";
import AudioPlayer from "@/components/AudioPlayer";
import ErrorBoundary from "@/components/ErrorBoundary";
import ScrollToTop from "@/components/ScrollToTop";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "Lenkalica - Stories about Culture, History, and Geography",
  description: "Discover fascinating stories about culture, history, and geography.",
  keywords: "culture, history, geography, stories, articles, podcasts",
  authors: [{ name: "Lenkalica" }],
  openGraph: {
    title: "Lenkalica - Stories about Culture, History, and Geography",
    description: "Discover fascinating stories about culture, history, and geography.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lenkalica - Stories about Culture, History, and Geography",
    description: "Discover fascinating stories about culture, history, and geography.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <body
        className={`${notoSans.variable} ${notoSerif.variable} ${literata.variable} font-sans antialiased min-h-screen flex flex-col bg-base-100 text-base-content`}
      >
        <ThemeProvider>
          <AudioProvider>
            <ErrorBoundary>
              <div className="drawer">
                <input
                  id="main-drawer"
                  type="checkbox"
                  className="drawer-toggle"
                  aria-label="Toggle navigation menu"
                  title="Toggle navigation menu"
                />
                <div className="drawer-content flex flex-col min-h-screen">
                  {/* Header */}
                  <Header />

                  {/* Breadcrumbs */}
                  <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4">
                    <div className="flex flex-wrap items-center gap-2 min-h-[3rem]">
                      <Breadcrumbs />
                    </div>
                  </div>

                  {/* Main Content */}
                  <main className="flex-1 bg-base-100" role="main" tabIndex={-1}>
                    <ErrorBoundary>{children}</ErrorBoundary>
                  </main>

                  {/* Audio Player */}
                  <AudioPlayer />

                  {/* Footer */}
                  <Footer />

                  {/* Scroll to Top */}
                  <ScrollToTop />
                </div>
              </div>
            </ErrorBoundary>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
