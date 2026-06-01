"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, MessageSquare, Search, BookOpen, Bookmark, User, ShieldAlert, LogOut, Sparkles, Menu, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/auth/login/actions";
import { useState } from "react";

interface NavbarProps {
  user: any; // User object from Supabase Auth
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOutAction();
  };

  const navItems = [
    { name: "Chapters", href: "/chapters", icon: Compass },
    { name: "AskViveka", href: "/ask", icon: MessageSquare },
    { name: "Search", href: "/search", icon: Search },
    { name: "Daily Wisdom", href: "/daily", icon: BookOpen },
    { name: "Bookmarks", href: "/bookmarks", icon: Bookmark, authRequired: true },
    { name: "Admin", href: "/admin", icon: ShieldAlert, adminRequired: true },
  ];

  const filteredItems = navItems.filter((item) => {
    if (item.authRequired && !user) return false;
    if (item.adminRequired && (!user || user.email !== "admin@askviveka.ai")) return false;
    return true;
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900/60 bg-zinc-950/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative size-12 overflow-hidden rounded-full border border-amber-500/30 bg-zinc-950 p-0.5 shadow-[0_0_10px_rgba(245,158,11,0.15)] animate-float-slow transition-all duration-300 group-hover:border-amber-500/60">
              <Image
                src="/logo.png"
                alt="AskViveka Logo"
                fill
                sizes="40px"
                className="object-contain p-1"
              />
            </div>
            {/* <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-widest text-white group-hover:text-amber-400 transition-colors leading-none uppercase font-sans">
                AskViveka
              </span>
              <span className="text-[10px] font-bold text-zinc-450 tracking-wider leading-none mt-1 group-hover:text-zinc-300 transition-colors uppercase">
                Timeless Wisdom
              </span>
            </div> */}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300",
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
                )}
              >
                <Icon className={cn("size-3.5", isActive ? "text-amber-400" : "text-zinc-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-zinc-400 lg:inline-block font-semibold">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 shadow-sm transition-all duration-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700"
              >
                <LogOut className="size-3.5 text-zinc-400" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-zinc-950 shadow-md hover:bg-amber-500 transition-all duration-300"
            >
              <User className="size-3.5" />
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-xl border border-zinc-800 bg-zinc-950/80 p-2 text-zinc-400 hover:text-zinc-200 transition-all focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-lg shadow-2xl z-40 animate-fade-in">
          <nav className="flex flex-col gap-1.5 p-4">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200",
                    isActive
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
                  )}
                >
                  <Icon className={cn("size-4", isActive ? "text-amber-400" : "text-zinc-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
