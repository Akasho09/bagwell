import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TopBar } from "../components/topBar2";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900 h-screen w-screen`}
      >
        <TopBar />
        <main className="flex justify-center items-center min-h-screen min-w-screen">
          <div className=" max-w-[60%]">
          {children}
          </div>
        </main>
        <footer className="border-t border-slate-200 bg-slate-50 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 010 2H6v2a1 1 0 01-2 0V5zM20 5a1 1 0 00-1-1h-4a1 1 0 100 2h2v2a1 1 0 102 0V5zM4 19a1 1 0 001 1h4a1 1 0 100-2H6v-2a1 1 0 10-2 0v3zM20 19a1 1 0 01-1 1h-4a1 1 0 110-2h2v-2a1 1 0 112 0v3z" />
                  </svg>
                </div>
                <span className="font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
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