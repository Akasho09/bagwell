import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TopBar } from "../components/topBar2";
import { Suspense } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "PinBoard - Discover & Share Creative Ideas",
    template: "%s | PinBoard",
  },
  description: "Discover and save creative ideas, images, and inspiration. Browse through categories like interior design, nature, fashion, food, travel, and more.",
  keywords: [
    "pinterest clone",
    "image sharing",
    "creative ideas",
    "inspiration",
    "design",
    "photography",
    "interior design",
    "fashion",
    "food",
    "travel",
  ],
  authors: [{ name: "PinBoard Team" }],
  creator: "PinBoard",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://freeimageprompts.vercel.app",
    title: "PinBoard - Discover & Share Creative Ideas",
    description: "Discover and save creative ideas, images, and inspiration.",
    siteName: "PinBoard",
  },
  twitter: {
    card: "summary_large_image",
    title: "PinBoard - Discover & Share Creative Ideas",
    description: "Discover and save creative ideas, images, and inspiration.",
    creator: "@pinboard",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen `}
      >
        <main className="flex justify-center items-center min-h-screen min-w-screen theme ">
        <Suspense fallback={null}>
          <TopBar />
          <div className="overflow-hidden mt-16 max-w-[60%]">
                {children}
          </div>
        </Suspense>
        </main>
        <footer className="border-t border-slate-700  mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold !text-black text-transparent">
                  freeimageprompts
                </span>
              </div>
              <p className="text-sm text-slate-600">
                © 2024 freeimageprompts. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <a href="#" className="hover:text-rose-500 transition-colors">About</a>
                <a href="#" className="hover:text-rose-500 transition-colors">Privacy</a>
                <a href="#" className="hover:text-rose-500 transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}