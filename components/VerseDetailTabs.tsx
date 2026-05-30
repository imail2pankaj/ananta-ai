"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, Globe, FileText, Sparkles, Compass } from "lucide-react";

interface Interpretation {
  id: string;
  translation?: string;
  commentary?: string;
  author: {
    name: string;
    code: string;
  };
}

interface VerseDetailTabsProps {
  verse: {
    verse_number: number;
    speaker: string;
    sanskrit_text: string;
    transliteration: string;
  };
  chapterNumber: number;
  interpretations: Interpretation[];
}

export default function VerseDetailTabs({
  verse,
  chapterNumber,
  interpretations,
}: VerseDetailTabsProps) {
  const activeInterpretations = interpretations.filter(
    (item) => item.translation || item.commentary
  );

  const [activeAuthorCode, setActiveAuthorCode] = useState(
    activeInterpretations[0]?.author.code || ""
  );

  const [activeTab, setActiveTab] = useState<"translation" | "commentary" | "insights">("translation");

  const currentInterpretation = activeInterpretations.find(
    (item) => item.author.code === activeAuthorCode
  );

  const getInsights = () => {
    if (activeAuthorCode === "chinmay") {
      return "Reflecting on this verse: Swami Chinmayananda emphasizes that our deep identity issues originate from attachment to fruits of actions. In modern leadership, focusing exclusively on metrics and outcomes without loving the execution is the primary driver of operational stress and creative fatigue. Cultivate dedication to execution and detach from absolute expectations.";
    }
    if (activeAuthorCode === "siva") {
      return "Reflecting on this verse: Swami Sivananda directs us toward absolute mental stillness. Modern anxiety is caused by the constant friction between our desires and external realities. By dedicating our efforts to a higher, selfless calling, we transform daily work into active meditation, filtering out the constant noise of the ego.";
    }
    return "This scripture guides us to explore the distinction between our constant awareness and temporary emotional states (like fear, stress, or attachment). Modern psychology supports this: mindfulness and cognitive reframing allow us to observe anxiety without identifying with it, helping us make wiser, calmer decisions in high-stakes environments.";
  };

  return (
    <div className="w-full space-y-6 font-sans">
      
      {/* Commentator Picker Bar */}
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950/45 p-5 shadow-xl backdrop-blur-md">
        <label className="block text-xs font-extrabold uppercase tracking-widest text-zinc-500 mb-3 pl-1">
          Select Commentator
        </label>
        <div className="flex flex-wrap gap-2">
          {activeInterpretations.map((item) => (
            <button
              key={item.author.code}
              onClick={() => setActiveAuthorCode(item.author.code)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 border",
                activeAuthorCode === item.author.code
                  ? "bg-amber-600 border-amber-600 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              )}
            >
              <User className="size-3.5" />
              {item.author.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-zinc-900">
        <button
          onClick={() => setActiveTab("translation")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-4 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300",
            activeTab === "translation"
              ? "border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Globe className="size-4" />
          Translation
        </button>
        <button
          onClick={() => setActiveTab("commentary")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-4 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300",
            activeTab === "commentary"
              ? "border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          <FileText className="size-4" />
          Commentary
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-4 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300",
            activeTab === "insights"
              ? "border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Sparkles className="size-4" />
          Modern Insights
        </button>
      </div>

      {/* Tabs Content */}
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950/45 p-8 shadow-xl backdrop-blur-md min-h-[220px] gilded-border">
        {activeTab === "translation" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-3">
              <Globe className="size-4 text-amber-500" />
              <span>Translation by {currentInterpretation?.author.name || "Commentator"}</span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-200 font-medium">
              {currentInterpretation?.translation || "No translation available for this commentator."}
            </p>
          </div>
        )}

        {activeTab === "commentary" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-3">
              <FileText className="size-4 text-amber-500" />
              <span>Detailed Commentary by {currentInterpretation?.author.name || "Commentator"}</span>
            </div>
            <div className="text-xs sm:text-sm leading-relaxed text-zinc-300 font-medium whitespace-pre-line">
              {currentInterpretation?.commentary || "No commentary available for this commentator."}
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-3">
              <Compass className="size-4 text-amber-500 animate-spin-slow" />
              <span>Ancient Wisdom for Modern Life Reflection</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 font-medium">
              {getInsights()}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
