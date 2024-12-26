import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { AudioProvider } from "@/context/AudioContext";
import AudioPlayer from "@/components/AudioPlayer";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "Lenkalica - Stories about Culture, History, and Geography",
  description: "Discover fascinating stories about culture, history, and geography.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoSans.variable} ${notoSerif.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <AudioProvider>
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
              <Header />
              <Breadcrumbs />
              <AudioPlayer />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
