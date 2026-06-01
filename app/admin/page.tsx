import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { ShieldCheck, BarChart3, Database, Users, Cpu, Search, Plus, Compass, BookOpen } from "lucide-react";

export const revalidate = 0; // Dynamic server component

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // RSC Auth check
  const { data: { user } } = await supabase.auth.getUser();

  // For demonstration / SaaS safety, we'll verify the email matches "admin@askviveka.ai"
  const isAdmin = user && user.email === "admin@askviveka.ai";

  if (!isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-zinc-50/50 dark:bg-black font-sans">
        <div className="text-center rounded-3xl border border-zinc-200 bg-white p-12 dark:border-zinc-800 dark:bg-zinc-900 max-w-md shadow-sm">
          <ShieldCheck className="size-10 mx-auto text-red-500 mb-3" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2 font-serif">
            Access Restricted
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
            Only authorized administrators can access the AskViveka dashboard, modify scriptures, or inspect server-level usage logs.
          </p>
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-950 px-6 text-xs font-bold text-white shadow hover:bg-indigo-900 dark:bg-amber-600 dark:text-zinc-950 dark:hover:bg-amber-500"
          >
            Return to Sanctuary
          </Link>
        </div>
      </div>
    );
  }

  // Fetch counts from DB to show real metrics
  const { count: scripturesCount } = await supabase
    .from("scriptures")
    .select("*", { count: "exact", head: true });

  const { count: chaptersCount } = await supabase
    .from("chapters")
    .select("*", { count: "exact", head: true });

  const { count: versesCount } = await supabase
    .from("verses")
    .select("*", { count: "exact", head: true });

  const { count: authorsCount } = await supabase
    .from("authors")
    .select("*", { count: "exact", head: true });

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50/50 dark:bg-black font-sans">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-900 dark:text-amber-400 uppercase tracking-widest mb-1">
              <ShieldCheck className="size-3.5" />
              <span>Admin Console</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-indigo-950 dark:text-zinc-50 font-serif">
              AskViveka Dashboard
            </h1>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50/80 px-3 py-1.5 text-xs font-semibold text-red-900 dark:bg-zinc-900 dark:text-red-400">
            System Admin: {user.email}
          </span>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
          
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider dark:text-zinc-500">
                Scriptures
              </span>
              <Database className="size-4 text-indigo-900 dark:text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-indigo-950 dark:text-zinc-50">
              {scripturesCount || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider dark:text-zinc-500">
                Chapters
              </span>
              <Compass className="size-4 text-indigo-900 dark:text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-indigo-950 dark:text-zinc-50">
              {chaptersCount || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider dark:text-zinc-500">
                Total Verses
              </span>
              <BookOpen className="size-4 text-indigo-900 dark:text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-indigo-950 dark:text-zinc-50">
              {versesCount || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider dark:text-zinc-500">
                Commentators
              </span>
              <Users className="size-4 text-indigo-900 dark:text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-indigo-950 dark:text-zinc-50">
              {authorsCount || 0}
            </p>
          </div>

        </div>

        {/* Content Management & Technical Logs Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* AI Logs */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center gap-1.5 border-b border-zinc-100 pb-3 mb-4 dark:border-zinc-800">
              <Cpu className="size-4 text-zinc-400 dark:text-zinc-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                AI API Consumption Logs
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-zinc-500 dark:text-zinc-400">
                <thead>
                  <tr className="border-b border-zinc-150 text-[10px] uppercase font-bold text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                    <th className="py-2 text-left">Endpoint</th>
                    <th className="py-2 text-left">Model</th>
                    <th className="py-2 text-left">Tokens Spent</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  <tr>
                    <td className="py-3 font-semibold text-zinc-800 dark:text-zinc-350">/api/ask</td>
                    <td className="py-3">gpt-4o-mini</td>
                    <td className="py-3">1,480 tokens</td>
                    <td className="py-3 text-right text-green-500 font-semibold">SUCCESS</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-zinc-800 dark:text-zinc-350">/api/ask</td>
                    <td className="py-3">gpt-4o-mini</td>
                    <td className="py-3">950 tokens</td>
                    <td className="py-3 text-right text-green-500 font-semibold">SUCCESS</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-zinc-800 dark:text-zinc-350">/api/ask</td>
                    <td className="py-3">text-embedding-3-small</td>
                    <td className="py-3">30 tokens</td>
                    <td className="py-3 text-right text-green-500 font-semibold">SUCCESS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Search Metrics */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center gap-1.5 border-b border-zinc-100 pb-3 mb-4 dark:border-zinc-800">
              <Search className="size-4 text-zinc-400 dark:text-zinc-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Popular Search Topics
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-850 dark:text-zinc-300">1. karma</span>
                <span className="rounded-full bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 font-bold text-zinc-500">234 searches</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-850 dark:text-zinc-300">2. fear</span>
                <span className="rounded-full bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 font-bold text-zinc-500">189 searches</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-850 dark:text-zinc-300">3. anxiety</span>
                <span className="rounded-full bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 font-bold text-zinc-500">144 searches</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-850 dark:text-zinc-300">4. failure</span>
                <span className="rounded-full bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 font-bold text-zinc-500">98 searches</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
