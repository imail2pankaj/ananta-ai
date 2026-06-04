import { createClient, createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { toggleBookmarkAction } from "@/app/bookmarks/actions";
import VerseCard from "@/components/VerseCard";
import { Bookmark, Compass, User, Sparkles, Star } from "lucide-react";

export const revalidate = 0; // Dynamic server component

export default async function BookmarksPage() {
  const supabase = await createClient();

  // RSC Auth check
  const { data: { user } } = await supabase.auth.getUser();

  const stars = [
    { top: "8%", left: "12%", delay: "0s", speed: "animate-twinkle-slow" },
    { top: "25%", left: "85%", delay: "1.2s", speed: "animate-twinkle-medium" },
    { top: "50%", left: "10%", delay: "0.4s", speed: "animate-twinkle-fast" },
    { top: "78%", left: "88%", delay: "2.1s", speed: "animate-twinkle-slow" },
  ];

  if (!user) {
    return (
      <div className="relative flex flex-1 items-center justify-center py-20 px-4 bg-[#030308] text-zinc-100 min-h-screen overflow-hidden font-sans">
        {/* Meditative background glowing orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-glow-indigo rounded-full opacity-30 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[65vw] h-[65vw] bg-glow-amber rounded-full opacity-20 pointer-events-none" />

        {/* Twinkling Star Particle Canopy */}
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

        <div className="relative z-10 text-center rounded-3xl border border-zinc-900 bg-zinc-950/45 p-8 max-w-md shadow-2xl backdrop-blur-md gilded-border">
          <div className="relative mb-5 size-14 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-breath blur-sm" />
            <User className="size-6 text-amber-500" />
          </div>
          
          <h2 className="text-lg font-extrabold uppercase tracking-widest text-white mb-3 font-serif">
            Authentication Required
          </h2>
          
          <p className="text-xs text-zinc-400 mb-8 leading-relaxed font-medium">
            Please sign in or create an account to save verses, maintain custom chat history, and view your daily reflections.
          </p>
          
          <Link
            href="/auth/login"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-amber-600 px-8 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-md hover:bg-amber-500 transition-all duration-300"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  // Fetch user bookmarks
  const { data: bookmarksData, error } = await supabase
    .from("bookmarks")
    .select("id, verse_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Bookmarks fetch error:", error);
  }

  let bookmarks: any[] = [];
  if (bookmarksData && bookmarksData.length > 0) {
    const verseIds = bookmarksData.map(b => b.verse_id);
    const adminSupabase = createAdminClient();
    const { data: verses, error: versesError } = await adminSupabase
      .from("verses")
      .select(`
        id,
        verse_number,
        speaker,
        sanskrit_text,
        transliteration,
        chapter:chapters(chapter_number)
      `)
      .in("id", verseIds);

    if (versesError) {
      console.error("Bookmarks verses fetch error:", versesError);
    }

    if (verses) {
      const versesMap = new Map(verses.map(v => [v.id, v]));
      bookmarks = bookmarksData
        .map(b => ({
          id: b.id,
          verse: versesMap.get(b.verse_id)
        }))
        .filter(b => b.verse !== undefined);
    }
  }

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

      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur px-4 py-1.5 text-xs font-semibold text-amber-400 shadow-sm mb-4">
            <Bookmark className="size-3.5 text-amber-500 animate-pulse" />
            <span className="tracking-wide uppercase">Saved Guidelines</span>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-sans uppercase">
            My Saved Verses
          </h1>
          
          <p className="mt-4 max-w-xl mx-auto text-sm text-zinc-400 leading-relaxed font-medium">
            A quiet sanctuary containing the verses and commentaries that speak directly to your modern challenges.
          </p>
        </div>

        {/* Bookmarks Grid / Timeline */}
        {bookmarks && bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {bookmarks.map((b: any) => {
              const v = b.verse;
              const chNumber = v.chapter?.chapter_number || 1;
              return (
                <div key={b.id} className="animate-fade-in shadow-xl">
                  <VerseCard
                    verseId={v.id}
                    chapterNumber={chNumber}
                    verseNumber={v.verse_number}
                    speaker={v.speaker}
                    sanskritText={v.sanskrit_text}
                    transliteration={v.transliteration}
                    isBookmarkedInitial={true}
                    onBookmarkToggle={toggleBookmarkAction}
                    isAuthenticated={true}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/45 p-12 text-center max-w-md mx-auto shadow-2xl backdrop-blur-md gilded-border">
            <Compass className="size-10 mx-auto text-zinc-650 mb-4 animate-spin-slow" />
            
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-300">
              No Saved Verses
            </h3>
            
            <p className="text-xs text-zinc-500 mt-2 max-w-xs mx-auto mb-8 font-medium leading-relaxed">
              As you browse the scripture chapters or search for mental clarity, toggle bookmarks to build your portfolio of saved wisdom guides.
            </p>
            
            <Link
              href="/chapters"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-amber-600 px-8 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-md hover:bg-amber-500 transition-all duration-300"
            >
              Browse Chapters
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
