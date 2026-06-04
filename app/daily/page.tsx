import { createClient, createAdminClient } from "@/lib/supabase";
import { toggleBookmarkAction } from "@/app/bookmarks/actions";
import VerseCard from "@/components/VerseCard";
import { BookOpen, Star, Sparkles } from "lucide-react";

export const revalidate = 0; // Dynamic server component

export default async function DailyWisdomPage() {
  // 1. Seed index based on current date
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Seed index between 0 and 718 (total verses count is 719)
  const seededIndex = (dayOfYear * 37) % 719;

  const adminSupabase = createAdminClient();

  // 2. Fetch the verse at that stable sorted offset
  const { data: verse, error: verseError } = await adminSupabase
    .from("verses")
    .select(`
      id,
      verse_number,
      speaker,
      sanskrit_text,
      transliteration,
      chapter:chapters(chapter_number, id)
    `)
    .order("id")
    .range(seededIndex, seededIndex)
    .single();

  if (verseError || !verse) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-[#030308] text-zinc-100">
        <p className="text-red-500 font-bold uppercase tracking-widest text-xs">Error loading daily wisdom: {verseError?.message}</p>
      </div>
    );
  }

  // 3. Fetch first translation for this verse to display as snippet
  const { data: interpretation } = await adminSupabase
    .from("verse_interpretations")
    .select("translation, author:authors(name)")
    .eq("verse_id", verse.id)
    .not("translation", "is", null)
    .limit(1)
    .maybeSingle();

  // 4. RSC Level Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check if bookmarked
  let isBookmarked = false;
  if (user) {
    const { data: bookmark } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .eq("verse_id", verse.id)
      .maybeSingle();

    isBookmarked = !!bookmark;
  }

  const vAny = verse as any;
  const chapterNumber = vAny.chapter?.chapter_number || 1;
  const authorObj = interpretation?.author;
  const authorName = Array.isArray(authorObj)
    ? (authorObj[0] as any)?.name
    : (authorObj as any)?.name;

  const translationText = interpretation?.translation 
    ? `${interpretation.translation} — Translated by ${authorName || "Swami"}`
    : "Commentary and translation details are available on the detail page.";

  const stars = [
    { top: "12%", left: "15%", delay: "0s", speed: "animate-twinkle-slow" },
    { top: "28%", left: "85%", delay: "1.5s", speed: "animate-twinkle-medium" },
    { top: "52%", left: "10%", delay: "0.5s", speed: "animate-twinkle-fast" },
    { top: "78%", left: "80%", delay: "2s", speed: "animate-twinkle-slow" },
  ];

  return (
    <div className="relative flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-[#030308] text-zinc-100 overflow-hidden font-sans">
      
      {/* 1. Meditative background glowing orbs */}
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

      <div className="relative z-10 mx-auto max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur px-4 py-1.5 text-xs font-semibold text-amber-400 shadow-sm mb-4">
            <BookOpen className="size-3.5 text-amber-500 animate-spin-slow" />
            <span className="tracking-wide uppercase">Daily Reflection</span>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-sans uppercase">
            Daily Wisdom
          </h1>
          
          <p className="mt-4 max-w-md mx-auto text-sm text-zinc-400 leading-relaxed font-medium">
            A single, curated scripture verse and meditation selected for today to ground your path.
          </p>
        </div>

        {/* Reusable VerseCard rendered directly as glass card */}
        <div className="animate-fade-in shadow-2xl rounded-3xl">
          <VerseCard
            verseId={verse.id}
            chapterNumber={chapterNumber}
            verseNumber={verse.verse_number}
            speaker={verse.speaker}
            sanskritText={verse.sanskrit_text}
            transliteration={verse.transliteration}
            translation={translationText}
            isBookmarkedInitial={isBookmarked}
            onBookmarkToggle={toggleBookmarkAction}
            isAuthenticated={!!user}
          />
        </div>

        {/* Reflection Practice Guide */}
        <div className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-2 font-serif font-bold text-xs uppercase tracking-widest">
            <Sparkles className="size-3.5 animate-pulse text-amber-500" />
            Today's Meditation Practice
          </div>
          
          <p className="text-xs text-zinc-300 leading-relaxed font-medium px-4">
            Absorb this verse at three key points today: once at dawn to frame your mental resilience, once at noon to maintain detached execution, and once at dusk to practice surrender and gratitude.
          </p>
        </div>

      </div>
    </div>
  );
}
