import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { AudioProvider } from "@/context/AudioContext";
import AudioPlayer from "@/components/AudioPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
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
