import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Play, Bookmark, BookmarkCheck, Star, Sparkles, Sparkle } from "lucide-react";
import VerseDetailTabs from "@/components/VerseDetailTabs";

interface VersePageProps {
  params: Promise<{ chapterNum: string; verseNum: string }>;
}

export default async function VerseDetailPage({ params }: VersePageProps) {
  const { chapterNum, verseNum } = await params;
  const chapterNumberInt = parseInt(chapterNum, 10);
  const verseNumberInt = parseInt(verseNum, 10);

  const supabase = await createClient();

  // Get scripture
  const { data: scripture } = await supabase
    .from("scriptures")
    .select("*")
    .eq("slug", "bhagavad-gita")
    .single();

  if (!scripture) {
    return (
      <div className="flex-1 py-16 text-center bg-[#030308] text-zinc-100">
        <p className="text-zinc-450 uppercase font-bold text-xs">Scripture not found</p>
      </div>
    );
  }

  // Get chapter
  const { data: chapter } = await supabase
    .from("chapters")
    .select("*")
    .eq("scripture_id", scripture.id)
    .eq("chapter_number", chapterNumberInt)
    .single();

  if (!chapter) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[50vh] bg-[#030308] text-zinc-100">
        <h2 className="text-xl font-bold text-red-500 mb-2 font-serif">Chapter Not Found</h2>
        <p className="text-sm text-zinc-450">Chapter {chapterNumberInt} is not found.</p>
        <Link href="/chapters" className="mt-4 text-xs font-bold uppercase tracking-widest text-amber-500 hover:underline">
          Back to Chapters
        </Link>
      </div>
    );
  }

  // Get verse
  const { data: verse } = await supabase
    .from("verses")
    .select("*")
    .eq("chapter_id", chapter.id)
    .eq("verse_number", verseNumberInt)
    .single();

  if (!verse) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[50vh] bg-[#030308] text-zinc-100">
        <h2 className="text-xl font-extrabold uppercase tracking-widest text-red-500 mb-2 font-serif">Verse Not Found</h2>
        <p className="text-xs text-zinc-450">
          Verse {chapterNumberInt}.{verseNumberInt} is not available in the database.
        </p>
        <Link
          href={`/chapters/${chapterNumberInt}`}
          className="mt-4 text-xs font-bold uppercase tracking-widest text-amber-500 hover:underline"
        >
          Back to Chapter {chapterNumberInt}
        </Link>
      </div>
    );
  }

  // Get interpretations joined with author info
  const { data: interpretations, error: intError } = await supabase
    .from("verse_interpretations")
    .select("id, translation, commentary, author:authors(name, code)")
    .eq("verse_id", verse.id);

  if (intError) {
    console.error("Interpretations query error:", intError);
  }

  // Cast interpretations for typescript safety
  const formattedInterpretations = (interpretations || []).map((item: any) => ({
    id: item.id,
    translation: item.translation || undefined,
    commentary: item.commentary || undefined,
    author: {
      name: item.author?.name || "Commentator",
      code: item.author?.code || "unknown",
    },
  }));

  const stars = [
    { top: "12%", left: "10%", delay: "0s", speed: "animate-twinkle-slow" },
    { top: "28%", left: "82%", delay: "1.2s", speed: "animate-twinkle-medium" },
    { top: "52%", left: "6%", delay: "0.6s", speed: "animate-twinkle-fast" },
    { top: "82%", left: "88%", delay: "2.4s", speed: "animate-twinkle-slow" },
  ];

  return (
    <div className="relative flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-[#030308] text-zinc-100 overflow-hidden font-sans">
      
      {/* 1. Meditative background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-glow-indigo rounded-full opacity-35 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-glow-amber rounded-full opacity-25 pointer-events-none" />

      {/* 2. Concentric geometric Sacred Mandala background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-5 select-none z-0">
        <svg
          className="size-[80vw] max-w-[800px] text-amber-500 animate-spin-super-slow"
          viewBox="0 0 400 400"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          <circle cx="200" cy="200" r="190" strokeDasharray="5 5" />
          <circle cx="200" cy="200" r="150" />
          <circle cx="200" cy="200" r="120" strokeDasharray="10 10" />
          <circle cx="200" cy="200" r="90" />
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <line
                key={i}
                x1="200"
                y1="200"
                x2={200 + 190 * Math.cos((angle * Math.PI) / 180)}
                y2={200 + 190 * Math.sin((angle * Math.PI) / 180)}
              />
            );
          })}
        </svg>
      </div>

      {/* 3. Twinkling Star Particle Canopy */}
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

      <div className="relative z-10 mx-auto max-w-4xl">
        
        {/* Back Link */}
        <div className="mb-8 flex justify-between items-center">
          <Link
            href={`/chapters/${chapter.chapter_number}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="size-3.5" />
            Back to Chapter {chapter.chapter_number}
          </Link>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500/80 flex items-center gap-1.5 animate-pulse">
            <Sparkles className="size-3.5 text-amber-500" />
            Gita Wisdom
          </span>
        </div>

        {/* Primary Verse Large Detail Card */}
        <div className="mb-10 rounded-3xl border border-zinc-900 bg-zinc-950/45 p-8 shadow-xl backdrop-blur-md gilded-border">
          
          <div className="flex items-center justify-between border-b border-zinc-900/60 pb-4 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-zinc-400">
              <Sparkle className="size-3 text-amber-500 animate-pulse" />
              {verse.speaker} Speaks
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-400 border border-amber-500/25 animate-glow-pulse">
              Verse {chapter.chapter_number}.{verse.verse_number}
            </span>
          </div>

          {/* Sanskrit Slok centered */}
          <div className="relative rounded-2xl p-6 my-6 text-center bg-zinc-950/70 border border-zinc-900/60 shadow-[inset_0_1px_15px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none select-none text-[10rem] font-serif text-amber-500">ॐ</div>
            <p className="relative z-10 whitespace-pre-line text-3xl font-serif font-extrabold leading-loose text-zinc-100 tracking-wide">
              {verse.sanskrit_text}
            </p>
          </div>

          {/* Transliteration */}
          <div className="border-t border-zinc-900/60 pt-6 mt-6 text-center">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-550 mb-2">
              Transliteration
            </h4>
            <p className="italic text-sm leading-relaxed text-zinc-450 px-6 sm:px-12 font-medium">
              {verse.transliteration}
            </p>
          </div>
        </div>

        {/* Commentaries and Commentators Tabs Section */}
        <VerseDetailTabs
          verse={{
            verse_number: verse.verse_number,
            speaker: verse.speaker,
            sanskrit_text: verse.sanskrit_text,
            transliteration: verse.transliteration,
          }}
          chapterNumber={chapter.chapter_number}
          interpretations={formattedInterpretations}
        />

      </div>
    </div>
  );
}
