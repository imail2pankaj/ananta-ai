import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-10 mt-auto shadow-[0_-4px_30px_rgba(0,0,0,0.3)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Calming Quote Banner */}
        <div className="flex flex-col items-center justify-center text-center pb-8 border-b border-zinc-900/60 mb-8">
          <Sparkles className="size-4 text-amber-500 mb-3 animate-pulse" />
          <p className="text-xs italic text-zinc-400 max-w-2xl leading-relaxed font-serif">
            "Yoga is perfect evenness of mind, a deep peace that remains unaffected by failure or success."
          </p>
          <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500/80 mt-1">
            Bhagavad Gita • Chapter 2, Verse 48
          </span>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <div className="flex items-center gap-2">
              <Compass className="size-4 text-amber-500 animate-spin-slow" />
              <span className="text-base font-extrabold tracking-widest text-white uppercase font-sans">
                AskViveka
              </span>
            </div>
            <p className="text-xs text-zinc-400 text-center sm:text-left font-medium mt-1">
              Timeless guidelines from authentic scriptures for navigating modern life.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Link href="/chapters" className="hover:text-amber-400 transition-colors">
              Chapters
            </Link>
            <Link href="/ask" className="hover:text-amber-400 transition-colors">
              Ask AI
            </Link>
            <Link href="/search" className="hover:text-amber-400 transition-colors">
              Search
            </Link>
            <Link href="/daily" className="hover:text-amber-400 transition-colors">
              Daily Wisdom
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-900/50 pt-6 text-center">
          <p className="text-[14px] text-zinc-400 font-semibold tracking-wide">
            © {new Date().getFullYear()} AskViveka Platform. Secular spiritual wisdom for mental clarity. Not medical or therapeutic advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
