import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { Search, Compass, ChevronRight, Play, Star, Sparkles, Sparkle } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  let results: any[] = [];
  let errorMsg = "";

  if (query) {
    const supabase = await createClient();

    // Perform text search over verse interpretations
    const { data, error } = await supabase
      .from("verse_interpretations")
      .select(`
        translation,
        commentary,
        verse:verses(
          id,
          verse_number,
          speaker,
          sanskrit_text,
          transliteration,
          chapter:chapters(chapter_number)
        ),
        author:authors(name)
      `)
      .or(`translation.ilike.%${query}%,commentary.ilike.%${query}%`)
      .limit(15);

    if (error) {
      console.error("Search query error:", error);
      errorMsg = error.message;
    } else {
      results = data || [];
    }
  }

  const sampleKeywords = ["karma", "fear", "anxiety", "anger", "attachment", "leadership"];

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
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur px-4 py-1.5 text-xs font-semibold text-amber-400 shadow-sm mb-4">
            <Search className="size-3.5 text-amber-500 animate-pulse" />
            <span className="tracking-wide uppercase">Wisdom Search</span>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-sans uppercase">
            Timeless Topic Search
          </h1>
          
          <p className="mt-4 max-w-xl mx-auto text-sm text-zinc-400 leading-relaxed font-medium">
            Search keywords, values, or mental obstacles to retrieve matching Bhagavad Gita teachings.
          </p>
        </div>

        {/* Search Input Box Card */}
        <div className="mb-10 rounded-3xl border border-zinc-900 bg-zinc-950/45 p-6 shadow-xl backdrop-blur-md">
          <form method="GET" className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Type keywords (e.g. fear, karma, anxiety...)"
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 text-sm text-white focus:outline-none focus:border-amber-500/40 focus:bg-zinc-900/60 placeholder-zinc-550 transition-all duration-300"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-6 py-3.5 text-xs font-bold text-zinc-950 shadow-md hover:bg-amber-500 transition-all duration-300"
            >
              Search
            </button>
          </form>

          {/* Quick links */}
          <div className="mt-5 flex items-center flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="text-zinc-500 pr-1 select-none">
              Popular Topics:
            </span>
            {sampleKeywords.map((kw) => (
              <Link
                key={kw}
                href={`/search?q=${kw}`}
                className="rounded-xl border border-zinc-900 bg-zinc-900/30 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/20 px-3.5 py-1.5 text-[10px] text-zinc-450 tracking-wider transition-all duration-300"
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>

        {/* Results Timeline */}
        {query && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                <Sparkles className="size-3.5 text-amber-500 animate-pulse" />
                Found {results.length} Matches for "{query}"
              </h2>
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-red-950/30 border border-red-900/50 p-4 text-xs font-bold uppercase tracking-widest text-red-400">
                {errorMsg}
              </div>
            )}

            {results.length === 0 && !errorMsg && (
              <div className="rounded-3xl border border-zinc-900 bg-zinc-950/45 p-12 text-center shadow-xl backdrop-blur-md">
                <Compass className="size-8 mx-auto text-zinc-650 mb-3 animate-spin-slow" />
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-300">
                  No Verses Found
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto font-medium">
                  Try searching for synonyms or alternate values, e.g., 'attachment', 'duty', or 'mind'.
                </p>
              </div>
            )}

            {results.map((item, index) => {
              const v = item.verse;
              const chNumber = v?.chapter?.chapter_number;
              const vNumber = v?.verse_number;

              if (!v) return null;

              return (
                <div
                  key={`${v.id}-${index}`}
                  className="rounded-3xl border border-zinc-900 bg-zinc-950/45 p-6 shadow-xl backdrop-blur-md card-premium gilded-border"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900/60 pb-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 border border-amber-500/25">
                      Verse {chNumber}.{vNumber}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-zinc-550 uppercase tracking-widest">
                      <Sparkle className="size-3 text-amber-500" />
                      {v.speaker} Speaks
                    </span>
                  </div>

                  {/* Sanskrit text */}
                  <div className="relative rounded-2xl p-5 my-4 text-center bg-zinc-950/70 border border-zinc-900/60 shadow-[inset_0_1px_15px_rgba(0,0,0,0.5)] font-serif">
                    <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none select-none text-[8rem] font-serif text-amber-500">ॐ</div>
                    <p className="relative z-10 whitespace-pre-line text-base sm:text-lg font-extrabold leading-loose text-zinc-100 group-hover:text-amber-300 transition-colors">
                      {v.sanskrit_text}
                    </p>
                  </div>

                  {/* Translation segment match */}
                  <div className="mt-4 border-t border-zinc-900/60 pt-4">
                    <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 mb-2">
                      <Sparkle className="size-2.5 text-amber-500" />
                      <span>Match Snippet ({Array.isArray(item.author) ? (item.author[0] as any)?.name : (item.author as any)?.name})</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 font-medium">
                      {item.translation || item.commentary}
                    </p>
                  </div>

                  {/* Explore button */}
                  <div className="mt-5 flex justify-end">
                    <Link
                      href={`/chapters/${chNumber}/verses/${vNumber}`}
                      className="group inline-flex items-center text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400"
                    >
                      Explore Commentary
                      <ChevronRight className="size-4 ml-0.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
