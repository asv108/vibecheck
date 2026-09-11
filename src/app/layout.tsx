import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/share";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Shared links need absolute og:image URLs. Set NEXT_PUBLIC_SITE_URL in
  // production; otherwise this falls back to the Vercel URL, then localhost.
  metadataBase: new URL(siteUrl()),
  title: "vibecheck — deploy your day with a canary first",
  description:
    "Five questions, four vibe signals, one animated canary that tells you whether today is safe to promote to production.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
