"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, ArrowRight, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface VerseCardProps {
  verseId: string;
  chapterNumber: number;
  verseNumber: number;
  speaker: string;
  sanskritText: string;
  transliteration: string;
  translation?: string;
  isBookmarkedInitial?: boolean;
  onBookmarkToggle?: (verseId: string, isBookmarked: boolean) => Promise<boolean>;
  isAuthenticated?: boolean;
}

export default function VerseCard({
  verseId,
  chapterNumber,
  verseNumber,
  speaker,
  sanskritText,
  transliteration,
  translation,
  isBookmarkedInitial = false,
  onBookmarkToggle,
  isAuthenticated = false,
}: VerseCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial);
  const [isMutating, setIsMutating] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please sign in to bookmark verses.");
      return;
    }
    if (!onBookmarkToggle || isMutating) return;

    setIsMutating(true);
    const nextState = !isBookmarked;
    const success = await onBookmarkToggle(verseId, nextState);
    if (success) {
      setIsBookmarked(nextState);
    }
    setIsMutating(false);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/45 p-6 shadow-xl backdrop-blur-md card-premium gilded-border">
      
      {/* Top Meta Info */}
      <div className="flex items-center justify-between mb-4 border-b border-zinc-900/60 pb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 border border-amber-500/25 animate-glow-pulse">
          Verse {chapterNumber}.{verseNumber}
        </span>
        <button
          onClick={handleBookmark}
          disabled={isMutating}
          className={cn(
            "rounded-full p-2 transition-all hover:bg-white/5 border border-transparent hover:border-zinc-800",
            isBookmarked ? "text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-105" : "text-zinc-500 hover:text-zinc-300"
          )}
          title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
        >
          {isBookmarked ? (
            <BookmarkCheck className="size-5 stroke-[2] animate-breath" />
          ) : (
            <Bookmark className="size-5 stroke-[1.8]" />
          )}
        </button>
      </div>

      {/* Speaker */}
      <div className="flex items-center gap-2 mb-3 text-xs font-extrabold uppercase tracking-widest text-zinc-400">
        <Sparkles className="size-3 text-amber-500" />
        <span>{speaker} Speaks</span>
      </div>

      {/* Sanskrit Slok Container */}
      <div className="relative rounded-2xl p-6 my-4 text-center bg-zinc-950/70 border border-zinc-900/60 shadow-[inset_0_1px_15px_rgba(0,0,0,0.5)]">
        {/* Soft Sanskrit Watermark Symbol inside the Slok Card */}
        <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none select-none text-[8rem] font-serif text-amber-500">ॐ</div>
        
        <p className="relative z-10 whitespace-pre-line text-lg sm:text-xl font-serif font-extrabold leading-loose text-zinc-100 tracking-wide">
          {sanskritText}
        </p>
      </div>

      {/* Transliteration */}
      <p className="text-center italic text-sm text-zinc-350 max-w-lg mx-auto px-4 mb-4 font-sans leading-relaxed">
        {transliteration}
      </p>

      {/* Translation */}
      {translation && (
        <div className="mt-4 border-t border-zinc-900/80 pt-4">
          <p className="text-sm sm:text-base leading-relaxed text-zinc-200 font-medium">
            {translation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex justify-end">
        <Link
          href={`/chapters/${chapterNumber}/verses/${verseNumber}`}
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400"
        >
          Explore Commentary
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
