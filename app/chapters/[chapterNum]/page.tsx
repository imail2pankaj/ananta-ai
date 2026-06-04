import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { Compass, BookOpen, ChevronRight, Play, ArrowLeft, Star, Sparkles, Sparkle } from "lucide-react";

interface ChapterPageProps {
  params: Promise<{ chapterNum: string }>;
}

export const revalidate = 86400; // Cache for 24 hours

export async function generateStaticParams() {
  return Array.from({ length: 18 }, (_, i) => ({
    chapterNum: String(i + 1),
  }));
}

export default async function ChapterDetailPage({ params }: ChapterPageProps) {
  const { chapterNum } = await params;
  const chapterNumberInt = parseInt(chapterNum, 10);

  const supabase = await createClient();

  // Get Chapter details directly (eliminating redundant scripture query)
  const { data: chapter, error: chapterError } = await supabase
    .from("chapters")
    .select("*")
    .eq("chapter_number", chapterNumberInt)
    .single();

  if (chapterError || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[50vh] bg-[#030308] text-zinc-100">
        <h2 className="text-xl font-extrabold uppercase tracking-widest text-red-500 mb-2 font-serif">Error Loading Chapter</h2>
        <p className="text-xs text-zinc-450">{chapterError?.message || "Chapter not found"}</p>
        <Link href="/chapters" className="mt-4 text-xs font-bold uppercase tracking-widest text-amber-500 hover:underline">
          Back to all chapters
        </Link>
      </div>
    );
  }

  // Get Verses in this chapter
  const { data: verses, error: versesError } = await supabase
    .from("verses")
    .select("*")
    .eq("chapter_id", chapter.id)
    .order("verse_number", { ascending: true });

  if (versesError) {
    console.error("Verses load error:", versesError);
  }

  const stars = [
    { top: "8%", left: "15%", delay: "0s", speed: "animate-twinkle-slow" },
    { top: "25%", left: "80%", delay: "1.5s", speed: "animate-twinkle-medium" },
    { top: "45%", left: "8%", delay: "0.5s", speed: "animate-twinkle-fast" },
    { top: "75%", left: "88%", delay: "2s", speed: "animate-twinkle-slow" },
  ];

  return (
    <div className="relative flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-[#030308] text-zinc-100 overflow-hidden font-sans">
      
      {/* 1. Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-glow-indigo rounded-full opacity-35 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-glow-amber rounded-full opacity-25 pointer-events-none" />

      {/* 2. Twinkling Star Particle Canopy */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {stars.map((star, idx) => (
          <div
            key={idx}
            className={`twinkle-star ${star.speed}`}
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/chapters"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="size-3.5" />
            Back to Chapters
          </Link>
        </div>

        {/* Chapter Detail Header Card */}
        <div className="mb-10 rounded-3xl border border-zinc-900 bg-zinc-950/45 p-8 shadow-xl backdrop-blur-md gilded-border">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b border-zinc-900/60 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500/85 flex items-center gap-1">
                <Sparkles className="size-3 text-amber-500" />
                Chapter {chapter.chapter_number}
              </span>
              <h1 className="text-3xl font-serif font-extrabold tracking-tight text-white my-1">
                {chapter.sanskrit_name}
              </h1>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-1">
                {chapter.english_name} • <span className="text-zinc-500 italic font-medium lowercase first-letter:uppercase">({chapter.meaning_en})</span>
              </p>
            </div>
            
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-400 border border-amber-500/25 self-start">
              <BookOpen className="size-3.5" />
              {chapter.verses_count} Timeless Verses
            </div>
          </div>

          <div className="mt-6 relative">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 mb-3">
              Chapter Summary
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-300 font-medium pl-1">
              <span className="sanskrit-dropcap">ॐ</span>
              {chapter.summary_en}
            </p>
          </div>
        </div>

        {/* Verses Section Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
          <h2 className="text-lg font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
            <Compass className="size-4.5 text-amber-500 animate-spin-slow" />
            Verses in this Chapter
          </h2>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Select a verse to explore detailed commentaries
          </span>
        </div>

        {/* Verses list */}
        <div className="space-y-5">
          {verses?.map((verse) => (
            <Link
              key={verse.id}
              href={`/chapters/${chapter.chapter_number}/verses/${verse.verse_number}`}
              className="group flex flex-col justify-between rounded-3xl border border-zinc-900 bg-zinc-950/45 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 hover:border-amber-500/25 card-premium"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900/60 pb-3 mb-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500">
                  Verse {chapter.chapter_number}.{verse.verse_number}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-450 uppercase tracking-widest">
                  <Sparkle className="size-3 text-amber-500" />
                  {verse.speaker} Speaks
                </span>
              </div>

              {/* Sanskrit text */}
              <div className="text-center font-serif py-3 relative">
                <p className="whitespace-pre-line text-lg font-extrabold leading-loose text-zinc-100 group-hover:text-amber-300 transition-colors">
                  {verse.sanskrit_text}
                </p>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-900/60">
                <p className="text-xs italic text-zinc-400 line-clamp-1 max-w-md sm:max-w-xl font-medium">
                  {verse.transliteration}
                </p>
                <span className="inline-flex items-center text-xs font-extrabold uppercase tracking-widest text-amber-500 group-hover:text-amber-400 group-hover:underline shrink-0">
                  View Commentary
                  <ChevronRight className="size-3.5 ml-0.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
