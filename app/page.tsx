"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star, ArrowRight, MessageSquare, Compass, ShieldCheck, HelpCircle } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/ask?q=${encodeURIComponent(prompt)}`);
  };

  const stars = [
    { top: "8%", left: "12%", delay: "0s", speed: "animate-twinkle-slow" },
    { top: "22%", left: "82%", delay: "1.5s", speed: "animate-twinkle-medium" },
    { top: "42%", left: "6%", delay: "0.5s", speed: "animate-twinkle-fast" },
    { top: "58%", left: "88%", delay: "2s", speed: "animate-twinkle-slow" },
    { top: "72%", left: "18%", delay: "3s", speed: "animate-twinkle-medium" },
    { top: "14%", left: "48%", delay: "2.5s", speed: "animate-twinkle-fast" },
    { top: "88%", left: "62%", delay: "1s", speed: "animate-twinkle-slow" },
  ];

  const mindStates = [
    {
      title: "Anxiety & Future",
      emoji: "🧘",
      description: "Grounding and peace for when you feel overwhelmed by what lies ahead.",
      query: "I feel anxious about my future and uncertainty.",
      color: "from-emerald-500/5 to-teal-500/5 hover:from-emerald-500/10 hover:to-teal-500/10 border-emerald-500/10 dark:border-emerald-500/20",
      accent: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Fear & Courage",
      emoji: "🛡️",
      description: "Finding inner strength, resilience, and steadiness in difficult moments.",
      query: "How do I overcome fear and build real courage?",
      color: "from-blue-500/5 to-indigo-500/5 hover:from-blue-500/10 hover:to-indigo-500/10 border-blue-500/10 dark:border-blue-500/20",
      accent: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Failure & Struggle",
      emoji: "🌊",
      description: "Developing equanimity (Samatvam) and learning to navigate setbacks.",
      query: "I am struggling with failure and feel stuck.",
      color: "from-purple-500/5 to-pink-500/5 hover:from-purple-500/10 hover:to-pink-500/10 border-purple-500/10 dark:border-purple-500/20",
      accent: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Purpose & Duty",
      emoji: "🌅",
      description: "Clarifying your true nature (Swadharma) and acting with alignment.",
      query: "How do I find my true purpose and do my duty?",
      color: "from-amber-500/5 to-orange-500/5 hover:from-amber-500/10 hover:to-orange-500/10 border-amber-500/10 dark:border-amber-500/20",
      accent: "text-amber-600 dark:text-amber-500",
    },
  ];

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#030308] text-zinc-100">
      
      {/* 1. Meditative background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-glow-indigo rounded-full opacity-60 dark:opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-glow-amber rounded-full opacity-45 dark:opacity-35 pointer-events-none" />
      <div className="absolute top-[35%] right-[10%] w-[40vw] h-[40vw] bg-glow-indigo rounded-full opacity-35 dark:opacity-20 pointer-events-none" style={{ animationDelay: '-6s' }} />

      {/* 2. Concentric geometric Sacred Mandala */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30 select-none z-0">
        <svg
          className="size-[85vw] max-w-[850px] text-indigo-500/10 dark:text-amber-500/5 animate-spin-super-slow mix-blend-screen"
          viewBox="0 0 400 400"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
        >
          <circle cx="200" cy="200" r="190" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="175" />
          <circle cx="200" cy="200" r="150" strokeDasharray="8 8" />
          <circle cx="200" cy="200" r="120" />
          <circle cx="200" cy="200" r="90" strokeDasharray="3 3" />
          <circle cx="200" cy="200" r="60" />
          <circle cx="200" cy="200" r="30" />

          {/* Ray lines */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            return (
              <line
                key={i}
                x1="200"
                y1="200"
                x2={200 + 175 * Math.cos((angle * Math.PI) / 180)}
                y2={200 + 175 * Math.sin((angle * Math.PI) / 180)}
                className="opacity-40"
              />
            );
          })}

          {/* Concentric petal nodes */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12;
            const x = 200 + 120 * Math.cos((angle * Math.PI) / 180);
            const y = 200 + 120 * Math.sin((angle * Math.PI) / 180);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="30"
                className="opacity-25"
              />
            );
          })}

          {/* Inner petal layer */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            const x = 200 + 60 * Math.cos((angle * Math.PI) / 180);
            const y = 200 + 60 * Math.sin((angle * Math.PI) / 180);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="18"
                className="opacity-30"
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

      {/* Hero Section Container */}
      <section className="relative z-10 w-full max-w-5xl px-4 pt-28 pb-20 text-center sm:px-6 lg:px-8 animate-fade-in-up">
        
        {/* Breathing Logo Halo Container */}
        <div className="relative mx-auto mb-10 size-32 flex items-center justify-center">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-500/10 to-indigo-500/10 animate-breath blur-md pointer-events-none" />
          <div className="absolute -inset-1 rounded-full border border-amber-500/20 animate-breath opacity-75 pointer-events-none" style={{ animationDelay: '1.5s' }} />
          <div className="absolute -inset-5 rounded-full border border-indigo-500/10 animate-breath opacity-50 pointer-events-none" style={{ animationDelay: '3s' }} />

          {/* Central Calming Logo Circle */}
          <div className="relative size-28 overflow-hidden rounded-full border border-amber-500/30 bg-zinc-950/80 p-2 shadow-2xl animate-float-slow">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-indigo-950/10 blur opacity-60 pointer-events-none" />
            <Image
              src="/logo.png"
              alt="Ananta Lotus Symbol"
              fill
              sizes="112px"
              priority
              className="object-contain p-4 transition-all duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Calming tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur px-4 py-1.5 text-xs font-semibold text-amber-400 shadow-sm mb-6">
          <Star className="size-3.5 fill-amber-400 text-transparent animate-pulse" />
          <span className="tracking-wide">Bhagavad Gita Wisdom Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl mx-auto leading-[1.15] mb-8 font-sans">
          Ancient Wisdom <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-indigo-300 bg-clip-text text-transparent">
            for Modern Life
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-zinc-400 mb-12">
          Present your modern challenge, uncertainty, or obstacle. Receive comforting guidance and reflections completely grounded in timeless, authentic scriptures.
        </p>

        {/* Main Input Box */}
        <div className="max-w-xl mx-auto mb-10">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 p-2 shadow-xl focus-within:border-amber-500/40 transition-all duration-300 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what is on your mind today..."
              className="flex-1 px-4 py-3 text-sm focus:outline-none bg-transparent text-white placeholder-zinc-500"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-6 py-3.5 text-xs font-bold text-zinc-950 shadow-md hover:bg-amber-500 transition-all duration-200"
            >
              Ask Ananta
              <ArrowRight className="size-4 ml-1.5" />
            </button>
          </form>
        </div>

        {/* Ethereal Section Divider */}
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto mb-8 opacity-40">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-650" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Or Select a State of Mind</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-650" />
        </div>

        {/* Interactive Mind States Grid */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-16">
          {mindStates.map((state) => (
            <button
              key={state.title}
              onClick={() => router.push(`/ask?q=${encodeURIComponent(state.query)}`)}
              className={`group relative flex gap-4 p-5 rounded-2xl border text-left bg-zinc-900/30 backdrop-blur-sm shadow-sm transition-all duration-350 hover:scale-[1.01] hover:-translate-y-0.5 border-zinc-800/80 hover:bg-zinc-900/50 hover:border-zinc-700/60`}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${state.color} opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none`} />
              
              <span className="text-3xl select-none shrink-0">{state.emoji}</span>
              
              <div className="flex-1 min-w-0 relative z-10">
                <h3 className={`text-sm font-extrabold uppercase tracking-widest transition-colors flex items-center gap-1.5 ${state.accent}`}>
                  {state.title}
                  <ArrowRight className="size-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </h3>
                <p className="text-xs text-zinc-400 group-hover:text-zinc-300 mt-1 leading-relaxed font-medium">
                  {state.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* CTA Actions */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/chapters"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/80 px-8 text-sm font-semibold text-zinc-300 shadow-sm hover:bg-zinc-900 hover:text-white transition-all duration-200"
          >
            Browse Chapters
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-amber-600 px-8 text-sm font-bold text-zinc-950 shadow-md hover:bg-amber-500 transition-all duration-200"
          >
            Start Free
          </Link>
        </div>
      </section>

      {/* Core Principles / Features Section */}
      <section className="relative z-10 w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-zinc-900/80 bg-zinc-950/40">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center p-8 bg-zinc-900/20 rounded-3xl border border-zinc-900 shadow-sm card-premium">
            <div className="mb-5 rounded-full bg-zinc-900/90 p-3.5 text-amber-500">
              <Compass className="size-6" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-100 mb-3">
              Browse the Gita
            </h3>
            <p className="text-[13px] leading-relaxed text-zinc-400 font-medium">
              Explore all 18 chapters and 700+ verses complete with original Sanskrit transcripts, speaker contexts, and modern transliterations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center p-8 bg-zinc-900/20 rounded-3xl border border-zinc-900 shadow-sm card-premium">
            <div className="mb-5 rounded-full bg-zinc-900/90 p-3.5 text-amber-500">
              <MessageSquare className="size-6" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-100 mb-3">
              Context-Grounded AI
            </h3>
            <p className="text-[13px] leading-relaxed text-zinc-400 font-medium">
              Ask life's questions. Ananta performs vector searches to retrieve context from verses and commentaries to build tailored reflections.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center p-8 bg-zinc-900/20 rounded-3xl border border-zinc-900 shadow-sm card-premium">
            <div className="mb-5 rounded-full bg-zinc-900/90 p-3.5 text-amber-500">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-100 mb-3">
              Secular Wisdom
            </h3>
            <p className="text-[13px] leading-relaxed text-zinc-400 font-medium">
              No dogma or temple visual overloads. A clean, premium experience focused on navigating stress, failure, purpose, and anxiety.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
