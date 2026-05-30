"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, ArrowRight, Sparkles, Send, Plus, Loader, Compass, Bookmark, ShieldAlert, Sparkle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createConversationAction, getConversationMessagesAction } from "@/app/ask/actions";

interface Conversation {
  id: string;
  title: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AskChatInterfaceProps {
  user: any;
  conversations: Conversation[];
  initialQuery: string;
}

export default function AskChatInterface({
  user,
  conversations: initialConversations,
  initialQuery,
}: AskChatInterfaceProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Trigger initial query from URL param on mount
  useEffect(() => {
    if (initialQuery) {
      handleAutoSubmit(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAutoSubmit = async (queryText: string) => {
    setInput("");
    setLoading(true);

    // Form user message
    const newMessages: Message[] = [{ role: "user", content: queryText }];
    setMessages(newMessages);

    let currentConversationId = activeConversationId;

    // Create a new conversation if user is authenticated and hasn't selected one
    if (user && !currentConversationId) {
      const title = queryText.length > 30 ? queryText.substring(0, 30) + "..." : queryText;
      const newId = await createConversationAction(title);
      if (newId) {
        currentConversationId = newId;
        setActiveConversationId(newId);
        setConversations([{ id: newId, title }, ...conversations]);
      }
    }

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText, conversationId: currentConversationId }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...newMessages, { role: "assistant", content: data.answer }]);
      } else {
        const errData = await response.json();
        setMessages([
          ...newMessages,
          { role: "assistant", content: `### Error\nFailed to retrieve guidance. ${errData.error || ""}` },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "### Connection Error\nCould not connect to Ananta API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const queryToSend = input;
    setInput("");
    await handleAutoSubmit(queryToSend);
  };

  const handleLoadConversation = async (id: string) => {
    if (loading) return;
    setActiveConversationId(id);
    setLoading(true);
    const history = await getConversationMessagesAction(id);
    setMessages(history.map((m: any) => ({ role: m.role, content: m.content })));
    setLoading(false);
  };

  const handleNewSession = () => {
    if (loading) return;
    setActiveConversationId(null);
    setMessages([]);
    setInput("");
    router.push("/ask");
  };

  // Simple Markdown parser for Ananta's structured prompt outputs
  const renderMessageContent = (content: string) => {
    const sections = content.split(/(?=### )/);

    const headingConfig: Record<string, { label: string; icon: any; color: string }> = {
      "summary": { label: "Cosmic Insight", icon: Sparkle, color: "text-amber-400" },
      "relevant guidance": { label: "Timeless Guidance", icon: Compass, color: "text-amber-400" },
      "key verse": { label: "Sacred Verse", icon: Sparkles, color: "text-amber-400" },
      "practical reflection": { label: "Practical Reflection", icon: Sparkle, color: "text-emerald-400" },
      "suggested action": { label: "Suggested Action", icon: Sparkles, color: "text-blue-400" },
      "referenced verses": { label: "Referenced Verses", icon: Compass, color: "text-indigo-400" },
    };

    return (
      <div className="space-y-5 text-sm leading-relaxed text-zinc-300 font-sans">
        {sections.map((section, idx) => {
          if (section.startsWith("### ")) {
            const lines = section.split("\n");
            const rawHeading = lines[0].replace("### ", "").trim();
            const headingKey = rawHeading.toLowerCase();
            const config = headingConfig[headingKey] || { label: rawHeading, icon: Sparkles, color: "text-amber-400" };
            const HeadingIcon = config.icon;
            
            const body = lines.slice(1).join("\n").trim();

            const isVerse = headingKey === "key verse";

            return (
              <div key={idx} className="border-t border-zinc-900 pt-5 first:border-none first:pt-0">
                <h4 className={cn("text-xs font-extrabold uppercase tracking-widest mb-3.5 flex items-center gap-1.5", config.color)}>
                  <HeadingIcon className="size-3.5 animate-pulse" />
                  <span>{config.label}</span>
                </h4>
                
                {isVerse ? (
                  <div className="gilded-border rounded-2xl p-5 my-3 text-center bg-zinc-950/60 shadow-[inset_0_1px_10px_rgba(0,0,0,0.4)]">
                    <p className="whitespace-pre-line text-sm md:text-base font-serif italic text-zinc-100 font-bold leading-relaxed mb-2">
                      {body}
                    </p>
                    <div className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">Scripture Citation</div>
                  </div>
                ) : (
                  <div className="whitespace-pre-line pl-1 text-zinc-300 leading-relaxed text-[13px] md:text-sm font-medium">
                    {body}
                  </div>
                )}
              </div>
            );
          }
          return <div key={idx} className="whitespace-pre-line text-zinc-300 font-medium leading-relaxed">{section}</div>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)] bg-[#030308] text-zinc-100 font-sans">
      
      {/* Sidebar - Historical Conversations for Auth Users */}
      {user && (
        <aside className="hidden md:flex flex-col w-64 border-r border-zinc-900 bg-zinc-950/40 p-4 backdrop-blur-md">
          <button
            onClick={handleNewSession}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-dashed border-zinc-800 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-300"
          >
            <Plus className="size-4" />
            New Wisdom Session
          </button>

          {/* Conversation List */}
          <div className="mt-6 flex-1 overflow-y-auto space-y-1.5 pr-1">
            <label className="block text-xs font-extrabold uppercase tracking-widest text-zinc-500 mb-3 pl-2">
              Previous Conversations
            </label>
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => handleLoadConversation(c.id)}
                className={cn(
                  "flex items-center gap-2.5 w-full rounded-xl px-3 py-3 text-left text-xs font-bold uppercase tracking-wider transition-all duration-300",
                  activeConversationId === c.id
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
                )}
              >
                <MessageSquare className="size-3.5 shrink-0" />
                <span className="truncate">{c.title}</span>
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* Main Chat Pane */}
      <div className="flex-1 flex flex-col justify-between relative overflow-hidden">
        
        {/* Rotating Sacred Mandala Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none z-0">
          <svg
            className="size-[65vw] max-w-[650px] text-amber-500 animate-spin-super-slow"
            viewBox="0 0 400 400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="200" cy="200" r="190" strokeDasharray="5 5" />
            <circle cx="200" cy="200" r="150" />
            <circle cx="200" cy="200" r="120" strokeDasharray="10 10" />
            <circle cx="200" cy="200" r="90" />
            <circle cx="200" cy="200" r="60" />
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

        {/* Messages Timeline */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 relative z-10">
          
          {messages.length === 0 ? (
            // Serene Empty State
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12">
              <div className="relative mb-6 size-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-breath blur-sm" />
                <Compass className="size-8 text-amber-500 animate-spin-slow" />
              </div>
              
              <h2 className="text-xl font-extrabold tracking-widest text-white font-serif uppercase">
                Ask Ananta
              </h2>
              
              <p className="text-sm text-zinc-400 mt-3 leading-relaxed font-medium max-w-md">
                Describe a modern challenge or emotional obstacle you face today (e.g., anxiety, failure, stress, decision paralysis). Ananta will retrieve grounded Bhagavad Gita teachings to frame a peaceful reflection.
              </p>
            </div>
          ) : (
            // Message bubbles timeline
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col gap-2 p-6 rounded-2xl border shadow-lg backdrop-blur-md animate-fade-in transition-all duration-300",
                    m.role === "user"
                      ? "bg-zinc-900/60 border-zinc-800 ml-auto max-w-md"
                      : "bg-zinc-900/35 border-amber-500/15 mr-auto w-full gilded-border"
                  )}
                >
                  {/* Speaker Label */}
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-amber-500/80 mb-1">
                    <Sparkle className="size-3 text-amber-500" />
                    <span>{m.role === "user" ? "You" : "Ananta AI Guide"}</span>
                  </div>

                  {/* Body */}
                  {m.role === "user" ? (
                    <p className="text-xs md:text-sm font-semibold text-zinc-200 leading-relaxed">{m.content}</p>
                  ) : (
                    renderMessageContent(m.content)
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="bg-zinc-900/30 border border-zinc-950 p-6 rounded-2xl mr-auto w-full flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-zinc-500 animate-pulse">
                  <Loader className="size-4 animate-spin text-amber-500" />
                  <span>Consulting authentic scriptures...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

        </div>

        {/* Dynamic Chat input form */}
        <div className="border-t border-zinc-900 bg-zinc-950/80 p-4 relative z-10 backdrop-blur-md shadow-[0_-4px_30px_rgba(0,0,0,0.3)]">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="I feel stressed about my targets / I am afraid of losing my loved ones..."
                className="flex-1 px-4 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-sm text-white focus:outline-none focus:border-amber-500/40 focus:bg-zinc-900/60 placeholder-zinc-550 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-6 text-zinc-950 hover:bg-amber-500 shadow disabled:opacity-40 disabled:hover:bg-amber-600 transition-colors duration-200"
              >
                <Send className="size-4" />
              </button>
            </form>
            {!user && (
              <p className="text-xs text-zinc-500 text-center mt-2.5 font-bold uppercase tracking-widest">
                You are searching as guest. Sign in to save this session and view history.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
