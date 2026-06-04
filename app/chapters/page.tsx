import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { Compass, BookOpen, ChevronRight, Star, Sparkles } from "lucide-react";

export const revalidate = 3600; // Cache for 1 hour

export default async function ChaptersPage() {
  const supabase = createAdminClient();

  // Get scriptures
  const { data: scripture } = await supabase
    .from("scriptures")
    .select("*")
    .eq("slug", "bhagavad-gita")
    .single();

  if (!scripture) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-[#030308] text-zinc-100">
        <div className="text-center rounded-3xl border border-zinc-900 bg-zinc-950 p-8 max-w-sm shadow-2xl">
          <h2 className="text-lg font-extrabold text-white mb-2 uppercase tracking-widest font-serif">
            No Scripture Found
          </h2>
          <p className="text-xs text-zinc-450 leading-relaxed">
            The Bhagavad Gita scripture has not been loaded in the database yet.
          </p>
        </div>
      </div>
    );
  }

  // Get chapters
  const { data: chapters, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("scripture_id", scripture.id)
    .order("chapter_number", { ascending: true });

  if (error || !chapters) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-[#030308] text-zinc-100">
        <p className="text-red-500 font-bold uppercase tracking-widest text-xs">Error loading chapters: {error?.message}</p>
      </div>
    );
  }

  const stars = [
    { top: "10%", left: "8%", delay: "0s", speed: "animate-twinkle-slow" },
    { top: "25%", left: "85%", delay: "1.2s", speed: "animate-twinkle-medium" },
    { top: "48%", left: "15%", delay: "0.4s", speed: "animate-twinkle-fast" },
    { top: "75%", left: "88%", delay: "2.1s", speed: "animate-twinkle-slow" },
    { top: "18%", left: "52%", delay: "2.8s", speed: "animate-twinkle-fast" },
    { top: "85%", left: "42%", delay: "0.8s", speed: "animate-twinkle-medium" },
  ];

  return (
    <div className="relative flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-[#030308] text-zinc-100 overflow-hidden">
      
      {/* 1. Meditative background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-glow-indigo rounded-full opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-glow-amber rounded-full opacity-30 pointer-events-none" />

      {/* 2. Concentric geometric Sacred Mandala */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-10 select-none z-0">
        <svg
          className="size-[80vw] max-w-[800px] text-amber-500 animate-spin-super-slow mix-blend-screen"
          viewBox="0 0 400 400"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          <circle cx="200" cy="200" r="190" strokeDasharray="5 5" />
          <circle cx="200" cy="200" r="160" />
          <circle cx="200" cy="200" r="130" strokeDasharray="10 10" />
          <circle cx="200" cy="200" r="100" />
          <circle cx="200" cy="200" r="70" />
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

      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur px-4 py-1.5 text-xs font-semibold text-amber-400 shadow-sm mb-4">
            <Compass className="size-3.5 text-amber-500 animate-spin-slow" />
            <span className="tracking-wide uppercase">Timeless Gita Guidance</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-sans uppercase">
            Bhagavad Gita Chapters
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm text-zinc-400 leading-relaxed font-medium">
            Journey through all 18 chapters covering spiritual yoga, devotion, discipline, karma, and selfless actions.
          </p>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/chapters/${chapter.chapter_number}`}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/45 p-6 shadow-xl backdrop-blur-md card-premium gilded-border"
            >
              <div>
                {/* Meta */}
                <div className="flex items-center justify-between mb-4 border-b border-zinc-900/60 pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500/85 flex items-center gap-1">
                    <Sparkles className="size-3 text-amber-500" />
                    Chapter {chapter.chapter_number}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-550">
                    <BookOpen className="size-3 text-zinc-550" />
                    {chapter.verses_count} Verses
                  </span>
                </div>

                {/* Names */}
                <div className="mb-4">
                  <h2 className="text-lg font-serif font-extrabold text-zinc-100 group-hover:text-amber-400 transition-colors leading-relaxed">
                    {chapter.sanskrit_name}
                  </h2>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-1">
                    {chapter.english_name} • <span className="text-zinc-500 italic font-medium lowercase first-letter:uppercase">({chapter.meaning_en})</span>
                  </p>
                </div>

                {/* Summary */}
                <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 font-medium line-clamp-3">
                  {chapter.summary_en}
                </p>
              </div>

              {/* Bottom Explore Trigger */}
              <div className="mt-6 flex items-center justify-end text-xs font-extrabold uppercase tracking-widest text-amber-500 group-hover:text-amber-400 group-hover:underline">
                Explore Chapter
                <ChevronRight className="size-3.5 ml-0.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
