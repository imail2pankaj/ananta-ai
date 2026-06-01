import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AskViveka - Ancient Wisdom for Modern Life",
  description: "Navigate anxiety, fear, success, and relationships using timeless guidance grounded in Bhagavad Gita scripture.",
  keywords: ["Bhagavad Gita", "wisdom", "mindfulness", "stress relief", "spiritual guidance", "philosophy"],
  openGraph: {
    title: "AskViveka - Ancient Wisdom for Modern Life",
    description: "timeless scriptures decoded for modern mental clarity and life guidance.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // RSC level auth state check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={cn(
        "dark",
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        raleway.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-zinc-50/50 text-slate-800 dark:bg-black dark:text-zinc-50">
        <Navbar user={user} />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
