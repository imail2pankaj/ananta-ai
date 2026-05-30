import { loginWithEmail, signupWithEmail, loginWithGoogle } from "./actions";
import { Lock, Mail, Star } from "lucide-react";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-md dark:border-zinc-800 dark:bg-zinc-900/40 backdrop-blur-sm">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1 mb-2">
            <Star className="size-5 text-amber-500 fill-amber-500" />
            <span className="text-xl font-bold tracking-tight text-indigo-950 dark:text-zinc-50">
              Ananta
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Join the journey of growth
          </h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Save conversations, bookmark verses, and explore Timeless Scripture.
          </p>
        </div>

        {/* Notices */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-800 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-lg bg-indigo-50 p-3 text-xs font-medium text-indigo-900 dark:bg-indigo-950/20 dark:text-indigo-400">
            {message}
          </div>
        )}

        {/* Credentials Form */}
        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Email Address
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="size-4 text-zinc-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border border-zinc-300 bg-zinc-50 pl-10 pr-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="size-4 text-zinc-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-lg border border-zinc-300 bg-zinc-50 pl-10 pr-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              formAction={loginWithEmail}
              className="w-full flex justify-center py-2 px-4 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-sm font-semibold text-white shadow transition-all dark:bg-amber-600 dark:text-zinc-950 dark:hover:bg-amber-500"
            >
              Sign In
            </button>
            <button
              formAction={signupWithEmail}
              className="w-full flex justify-center py-2 px-4 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-sm font-semibold text-zinc-700 transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
          <span className="relative bg-white dark:bg-zinc-900 px-3 text-xs text-zinc-400 uppercase tracking-wider font-semibold">
            Or continue with
          </span>
        </div>

        {/* OAuth Form */}
        <form action={loginWithGoogle}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-sm font-semibold text-zinc-700 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg className="size-4" viewBox="0 0 24 24" width="100%" height="100%">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.79 5.79 0 0 1-2.51 3.82v3.13h3.97c2.33-2.15 3.59-5.32 3.59-8.8z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.97-3.13c-1.1.74-2.5 1.18-3.99 1.18-3.07 0-5.67-2.08-6.6-4.88H1.31v3.23A11.996 11.996 0 0 0 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.4 14.26a7.22 7.22 0 0 1 0-4.52V6.51H1.31a11.99 11.99 0 0 0 0 10.98l4.09-3.23z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0A11.996 11.996 0 0 0 1.31 6.51l4.09 3.23c.93-2.8 3.53-4.88 6.6-4.88z"
              />
            </svg>
            Google OAuth
          </button>
        </form>
      </div>
    </div>
  );
}
